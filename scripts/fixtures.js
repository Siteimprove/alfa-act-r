const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const axios = require("axios");
const makeDir = require("make-dir");

const { Scraper } = require("@siteimprove/alfa-scrape");

const tests = "https://auto-wcag.github.io/auto-wcag/exported-testcases/testcases.json";

const out = path.join("test", "fixtures");

fetch(tests, out);

async function fetch(tests, out) {
  const { data } = await axios.get(tests);

  const rules = new Map();

  for (let test of data.testcases) {
    const directory = path.join(out, test.ruleId).toLowerCase();
    const url = new URL(test.url).href;

    const id = digest(url).substring(0, 4);
    const filename = id + ".json";

    test = {
      id,
      filename,
      url,
      outcome: test.expected
    };

    if (rules.has(directory)) {
      rules.get(directory).tests.push(test);
    } else {
      rules.set(directory, { tests: [test] });
    }
  }

  const scraper = new Scraper();

  for (const [directory, { tests }] of rules) {
    console.group(directory);

    await makeDir(directory);

    for (const { id, filename, url, outcome } of tests) {
      console.time(filename);

      const aspects = await scraper.scrape(url, { timeout: 10000 });

      const fixture = JSON.stringify(
        {
          id,
          outcome,
          aspects
        },
        null,
        "  "
      );

      fs.writeFileSync(path.join(directory, filename), fixture + "\n");

      console.timeEnd(filename);
    }

    console.groupEnd(directory);
  }

  scraper.close();
}

function digest(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}
