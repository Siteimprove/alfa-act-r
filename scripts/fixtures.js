"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const crypto_1 = require("crypto");
const axios_1 = require("axios");
const alfa_scraper_1 = require("@siteimprove/alfa-scraper");
const headers = require("./helpers/headers");
const testCases = {
    old: {
        tests: "https://act-rules.github.io/testcases.json",
        out: path.join("test", "fixtures", "old"),
    },
    new: {
        tests: "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases.json",
        out: path.join("test", "fixtures", "new"),
    },
};
// If no extra argument is provided, download both ACT and W3C cases
// #1: node; #2 : this file; #3-…: actual arguments
const fetchACT = process.argv.length < 3 || process.argv.slice(2).includes("old");
const fetchW3C = process.argv.length < 3 || process.argv.slice(2).includes("new");
if (!fetchACT && !fetchW3C) {
    console.error('Wrong argument, use either "old", or "new", or none');
    process.exit(1);
}
if (fetchACT) {
    console.log("Fetching ACT-R ('old') test cases");
    cleanAndFetch("old");
}
if (fetchW3C) {
    console.log("Fetching WAI ('new') test cases");
    cleanAndFetch("new");
}
async function cleanAndFetch(source) {
    const { tests, out } = testCases[source];
    console.log(`Cleaning ${out}`);
    fs.rmSync(out, { recursive: true, force: true });
    console.log(`Fetching…`);
    await fetch(tests, out);
}
async function fetch(tests, out) {
    const { data } = await axios_1.default.get(tests, {
        headers: {
            "Accept-Encoding": "application/json",
        },
    });
    const rules = new Map();
    for (const test of data.testcases) {
        const directory = path.join(out, test.ruleId).toLowerCase();
        const url = new URL(test.url).href;
        const id = digest(url).substring(0, 6);
        const filename = id + ".json";
        const testDescription = {
            id,
            filename,
            url,
            outcome: test.expected,
        };
        if (rules.has(directory)) {
            rules.get(directory).tests.push(testDescription);
        }
        else {
            rules.set(directory, { tests: [testDescription] });
        }
    }
    const scraper = await alfa_scraper_1.Scraper.of();
    const errors = [];
    for (const [directory, { tests }] of rules) {
        console.group(directory);
        fs.mkdirSync(directory, { recursive: true });
        errors.push(...(await getTestCases(scraper, directory, tests)));
        console.groupEnd();
    }
    scraper.close();
    if (errors.length > 0) {
        console.group("Some files could not be fetched — retrying");
        console.warn(errors);
        const scraper = await alfa_scraper_1.Scraper.of();
        const stillErrors = [];
        for (const { directory, ...test } of errors) {
            console.log(test);
            stillErrors.push(...(await getTestCases(scraper, directory, [test])));
        }
        scraper.close();
        console.groupEnd();
        if (stillErrors.length > 0) {
            console.error("Still failing after two attempts");
            console.error(stillErrors);
            process.exitCode = 1;
        }
    }
}
function digest(data) {
    return (0, crypto_1.createHash)("sha256").update(data).digest("hex");
}
async function getTestCases(scraper, directory, tests) {
    const errors = [];
    for (const { id, filename, url, outcome } of tests) {
        console.time(filename);
        const result = await scraper
            .scrape(url)
            .then((page) => page.map((page) => page.toJSON()));
        if (result.isErr()) {
            console.error("%s: %s (%s)", filename, result.getErr(), url);
            errors.push({ directory, id, filename, url, outcome });
        }
        for (const page of result) {
            page.request.headers = headers.filter(page.request.headers);
            page.response.headers = headers.filter(page.response.headers);
            const fixture = JSON.stringify({
                id,
                outcome,
                page,
            }, undefined, 2);
            fs.writeFileSync(path.join(directory, filename), fixture + "\n");
        }
        console.timeEnd(filename);
    }
    return errors;
}
//# sourceMappingURL=fixtures.js.map