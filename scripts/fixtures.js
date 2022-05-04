const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const axios = require("axios");
const makeDir = require("make-dir");
const del = require("del");

const { Scraper } = require("@siteimprove/alfa-scraper");

const headers = require("./helpers/headers");

const testCases = {
  "act-r": {
    tests: "https://act-rules.github.io/testcases.json",
    out: path.join("test", "fixtures", "act-r"),
  },
  wai: {
    tests:
      "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases.json",
    out: path.join("test", "fixtures", "wai"),
  },
};

// If no extra argument is provided, download both ACT and WAI cases
// #1: node; #2 : this file; #3-…: actual arguments
const fetchACT =
  process.argv.length < 3 || process.argv.slice(2).includes("act-r");
const fetchWAI =
  process.argv.length < 3 || process.argv.slice(2).includes("wai");

if (!fetchACT && !fetchWAI) {
  console.error('Wrong argument, use either "act-r", or "wai", or none');
  process.exit(1);
}

if (fetchACT) {
  console.log("Fetching ACT-R test cases");
  cleanAndFetch("act-r");
}

if (fetchWAI) {
  console.log("Fetching WAI test cases");
  cleanAndFetch("wai");
}

async function cleanAndFetch(source) {
  const { tests, out } = testCases[source];
  del([out]).then(() => fetch(tests, out));
}

async function fetch(tests, out) {
  const { data } = await axios.get(tests);

  const rules = new Map();

  for (let test of data.testcases) {
    const directory = path.join(out, test.ruleId).toLowerCase();
    const url = new URL(test.url).href;

    const id = digest(url).substring(0, 6);
    const filename = id + ".json";

    test = {
      id,
      filename,
      url,
      outcome: test.expected,
    };

    if (rules.has(directory)) {
      rules.get(directory).tests.push(test);
    } else {
      rules.set(directory, { tests: [test] });
    }
  }

  const scraper = await Scraper.of();

  for (const [directory, { tests }] of rules) {
    console.group(directory);

    await makeDir(directory);

    for (const { id, filename, url, outcome } of tests) {
      console.time(filename);

      const result = await scraper
        .scrape(url)
        .then((page) => page.map((page) => page.toJSON()));

      if (result.isErr()) {
        console.error("%s: %s (%s)", filename, result.getErr(), url);
        process.exitCode = 1;
      }

      for (const page of result) {
        page.request.headers = headers.filter(page.request.headers);
        page.response.headers = headers.filter(page.response.headers);

        const fixture = JSON.stringify(
          {
            id,
            outcome,
            page,
          },
          undefined,
          2
        );

        fs.writeFileSync(path.join(directory, filename), fixture + "\n");
      }

      console.timeEnd(filename);
    }

    console.groupEnd(directory);
  }

  scraper.close();
}

function digest(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}
