import axios from "axios";
import { createHash } from "crypto";
import * as fs from "fs";
import * as jsdom from "jsdom";
import * as path from "path";

import { Array } from "@siteimprove/alfa-array";
import { Document } from "@siteimprove/alfa-dom";
import { Device } from "@siteimprove/alfa-device";
import { Map } from "@siteimprove/alfa-map";
import { None, Option } from "@siteimprove/alfa-option";
import { Scraper } from "@siteimprove/alfa-scraper";
import { Page } from "@siteimprove/alfa-web";

import * as dom from "@siteimprove/alfa-dom/native";

import { ignoredRules } from "../common/ignored-rules";
import { filterHeaders } from "./helpers/headers";

let source =
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases.json";
let destination = "fixtures";

if (process.argv.length > 2 && process.argv.slice(2).includes("old")) {
  source = "https://act-rules.github.io/testcases.json";
  destination = "old_fixtures";
}

const fixturesDir = path.join("test", destination);

console.log(`Grabbing test cases from ${source}.`);

cleanAndFetch();

async function cleanAndFetch() {
  fs.rmSync(fixturesDir, { recursive: true, force: true });
  fs.mkdirSync(fixturesDir);

  const rules = await getTestDescriptions();

  const scraper = await Scraper.of();
  const errors: Array<TestDescription> = [];

  let i = 1;
  for (const [directory, tests] of rules) {
    console.group(`${directory} (${i}/${rules.size})`);

    fs.mkdirSync(path.join(fixturesDir, directory), {
      recursive: true,
    });

    errors.push(...(await getTestCases(scraper, tests)));

    console.groupEnd();
    i++;
  }

  scraper.close();

  if (errors.length > 0) {
    console.group("Some files could not be fetched — retrying");
    console.warn(errors.map((error) => `${error.ruleId} / ${error.id}`));

    const scraper = await Scraper.of();
    const stillErrors: Array<TestDescription> = [];
    for (const test of errors) {
      console.log(test);
      stillErrors.push(...(await getTestCases(scraper, [test])));
    }
    scraper.close();

    console.groupEnd();

    if (stillErrors.length > 0) {
      console.error("Still failing after two attempts");
      console.error(
        stillErrors.map((error) => `${error.ruleId} / ${error.id}`),
      );
      process.exitCode = 1;
    }
  }
}

async function getTestDescriptions(): Promise<
  Map<string, Array<TestDescription>>
> {
  const { data } = await axios.get(source, {
    headers: { "Accept-Encoding": "application/json" },
  });

  fs.writeFileSync(
    path.join(fixturesDir, "testcases.json"),
    JSON.stringify(data, undefined, 2),
    "utf-8",
  );

  let rules = Map.empty<string, Array<TestDescription>>();

  for (const test of data.testcases) {
    const { ruleId } = test;
    if (ignoredRules.includes(ruleId)) {
      continue;
    }

    const url = new URL(test.url).href;
    const id = digest(url).substring(0, 6);

    const testDescription = TestDescription.of(
      ruleId,
      id,
      url,
      destination,
      test.expected,
    );

    rules = rules.set(
      ruleId,
      Array.append(rules.get(ruleId).getOr([]), testDescription),
    );
  }

  return rules;
}

function digest(data: string) {
  return createHash("sha256").update(data).digest("hex");
}

async function getTestCases(
  scraper: Scraper,
  tests: Array<TestDescription>,
): Promise<Array<TestDescription>> {
  const errors: Array<TestDescription> = [];
  let i = 1;
  for (const test of tests) {
    // wait 1.5s between fetches.
    await wait(1500);
    const label = `${test.filename} (${i} / ${tests.length})`;
    console.time(label);

    if (test.url.endsWith(".xml")) {
      // XML is not supported by Alfa. Store the data and mark as ignored.
      await scrapeXML(test);
    } else if (hasInstantRedirect(test.ruleId, test.id)) {
      await scrapeInstantRedirect(test);
    } else {
      (await getTestCase(scraper, test)).map((error) => errors.push(error));
    }

    console.timeEnd(label);
    i++;
  }

  return errors;
}

async function getTestCase(
  scraper: Scraper,
  test: TestDescription,
): Promise<Option<TestDescription>> {
  const result = await scraper
    .scrape(test.url)
    .then((page) => page.map((page) => page.toJSON()));

  if (result.isErr()) {
    console.error("%s: %s (%s)", test.filename, result.getErr(), test.url);
    return Option.of(test);
  }

  for (const page of result) {
    page.request.headers = filterHeaders(page.request.headers);
    page.response.headers = filterHeaders(page.response.headers);

    const fixture = JSON.stringify(
      { type: "test", id: test.id, outcome: test.outcome, page },
      undefined,
      2,
    );
    fs.writeFileSync(path.join(test.directory, test.filename), fixture + "\n");
  }

  return None;
}

async function scrapeXML(test: TestDescription) {
  const response = await axios.get(test.url, {
    headers: { "Accept-Encoding": "application/xml" },
  });

  const fixture = JSON.stringify(
    { type: "xml", id: test.id, url: test.url, data: response.data },
    undefined,
    2,
  );
  fs.writeFileSync(path.join(test.directory, test.filename), fixture + "\n");
}

// These cases have instant redirect, we cannot use the normal Scraper since
// Puppeteer follows the redirect and we end up grabbing the wrong page.
// Fortunately, these do not use Javascript, so a simple GET is enough.
function hasInstantRedirect(ruleId: string, testId: string): boolean {
  return (
    (ruleId === "bc659a" && ["2907c2", "8adcea"].includes(testId)) ||
    (ruleId === "bisz58" && ["12f9c8", "8a5f5a"].includes(testId))
  );
}

async function scrapeInstantRedirect(test: TestDescription) {
  const response = await axios.get(test.url, {
    headers: { "Accept-Encoding": "text/html" },
  });

  const document = new jsdom.JSDOM(response.data);
  const nodeJSON = (await dom.Native.fromNode(
    document.window.document,
  )) as Document.JSON;

  const page: Page.JSON = {
    device: Device.standard().toJSON(),
    document: nodeJSON,
    request: {
      method: "GET",
      url: test.url,
      headers: [],
      body: "",
    },
    response: {
      url: test.url,
      status: response.status,
      headers: [{ name: "content-type", value: "text/html; charset=utf-8" }],
      body: response.data,
    },
  };

  const fixture = JSON.stringify(
    {
      type: "redirect",
      id: test.id,
      outcome: test.outcome,
      page,
    },
    undefined,
    2,
  );
  fs.writeFileSync(path.join(test.directory, test.filename), fixture + "\n");
}

class TestDescription {
  public static of(
    ruleId: string,
    id: string,
    url: string,
    destination: string,
    outcome: string,
  ): TestDescription {
    return new TestDescription(ruleId, id, url, destination, outcome);
  }

  // The 6 chars rule ID provided by ACT rules
  private readonly _ruleId: string;
  // The 6 chars test ID computed here
  private readonly _id: string;
  // The URL of the test case provided by ACT rules
  private readonly _url: string;
  // The expected outcome of the test case
  private readonly _outcome: string;
  // The directory where the case is persisted
  private readonly _directory: string;
  // The filename storing the case
  private readonly _filename: string;

  private constructor(
    ruleId: string,
    id: string,
    url: string,
    destination: string,
    outcome: string,
  ) {
    this._ruleId = ruleId;
    this._id = id;
    this._url = url;
    this._outcome = outcome;

    this._directory = path.join("test", destination, this._ruleId);
    this._filename = `${id}.json`;
  }

  public get ruleId(): string {
    return this._ruleId;
  }

  public get id(): string {
    return this._id;
  }

  public get url(): string {
    return this._url;
  }

  public get outcome(): string {
    return this._outcome;
  }

  public get directory(): string {
    return this._directory;
  }

  public get filename(): string {
    return this._filename;
  }
}

/**
 * W3C / Cloudflare return Captcha pages if hit more than once
 * per second, so we had delays between the calls. This is not ideal
 * since it really slows down the process, but it's the best we can
 * do.
 */
async function wait(ms: number): Promise<void> {
  return new Promise((resolve, _) => {
    setTimeout(() => resolve(), ms);
  });
}
