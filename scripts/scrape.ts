import axios from "axios";
import { createHash } from "crypto";
import * as fs from "fs";
import * as jsdom from "jsdom";
import * as path from "path";

import { Array } from "@siteimprove/alfa-array";
import { Document } from "@siteimprove/alfa-dom";
import { Device } from "@siteimprove/alfa-device";
import { Request, Response } from "@siteimprove/alfa-http";
import { Map } from "@siteimprove/alfa-map";
import { None, Option } from "@siteimprove/alfa-option";
import { Scraper } from "@siteimprove/alfa-scraper";
import { Page } from "@siteimprove/alfa-web";

import * as dom from "@siteimprove/alfa-dom/native";

import { filterHeaders } from "./helpers/headers";

const testCases = {
  old: "https://act-rules.github.io/testcases.json",
  new: "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases.json",
} as const;

type Source = keyof typeof testCases;

// If no extra argument is provided, download both ACT and W3C cases
// #1: node; #2 : this file; #3-…: actual arguments
const fetchACT =
  process.argv.length < 3 || process.argv.slice(2).includes("old");
const fetchW3C =
  process.argv.length < 3 || process.argv.slice(2).includes("new");

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

async function cleanAndFetch(source: Source) {
  fs.rmSync(path.join("test", "fixtures", source), {
    recursive: true,
    force: true,
  });

  const rules = await getTestDescriptions(source);

  const scraper = await Scraper.of();
  const errors: Array<TestDescription> = [];

  let i = 1;
  for (const [directory, tests] of rules) {
    console.group(`${directory} (${i}/${rules.size})`);

    fs.mkdirSync(path.join("test", "fixtures", source, directory), {
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
        stillErrors.map((error) => `${error.ruleId} / ${error.id}`)
      );
      process.exitCode = 1;
    }
  }
}

// Rules for which we do not have an implementation, do not plan to have one,
// and therefore do not need to fetch test cases.
const ignoredRules = [
  // HTML images contain no text
  "0va7u6",
  // Link in context is descriptive
  "5effbb",
  // Device motion based changes to the content can also be created from the user interface
  "7677a9",
  // Focusable element has no keyboard trap
  "80af7b",
  // Content has alternative for visual reference
  "9bd38c",
  // Link is descriptive
  "aizyf1",
  // Device motion based changes to the content can be disabled
  "c249d5",
  // Attribute is not duplicated
  "e6952f",
  // Image not in the accessibility tree is decorative
  "e88epe",
  // Text content that changes automatically can be paused, stopped or hidden
  "efbfc7",
  // No keyboard shortcut uses only printable characters
  "ffbc54",
  // Image accessible name is descriptive
  "qt1vmo",
  // HTML page language subtag matches default language
  "ucwvc8",
];

async function getTestDescriptions(
  source: Source
): Promise<Map<string, Array<TestDescription>>> {
  const { data } = await axios.get(testCases[source], {
    headers: { "Accept-Encoding": "application/json" },
  });

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
      source,
      test.expected
    );

    rules = rules.set(
      ruleId,
      Array.append(rules.get(ruleId).getOr([]), testDescription)
    );
  }

  return rules;
}

function digest(data: string) {
  return createHash("sha256").update(data).digest("hex");
}

async function getTestCases(
  scraper: Scraper,
  tests: Array<TestDescription>
): Promise<Array<TestDescription>> {
  const errors: Array<TestDescription> = [];
  let i = 1;
  for (const test of tests) {
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
  test: TestDescription
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
      2
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
    2
  );
  fs.writeFileSync(path.join(test.directory, test.filename), fixture + "\n");
}

// These cases have instant redirect, we cannot use the normal Scraper since
// Puppeteer follows the redirect and we end up grabbing the wrong page.
// Fortunately, these do not use Javascript, so a simple GET is enough.
function hasInstantRedirect(ruleId: string, testId: string): boolean {
  return (
    (ruleId === "bc659a" && ["2907c2", "8adcea"].includes(testId)) ||
    (ruleId === "bisz58" && ["12f9c8", "e6fbb9"].includes(testId))
  );
}

async function scrapeInstantRedirect(test: TestDescription) {
  const response = await axios.get(test.url, {
    headers: { "Accept-Encoding": "text/html" },
  });

  const bar = new jsdom.JSDOM(response.data);
  const nodeJSON = dom.Native.fromNode(bar.window.document) as Document.JSON;

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
    2
  );
  fs.writeFileSync(path.join(test.directory, test.filename), fixture + "\n");
}

class TestDescription {
  public static of(
    ruleId: string,
    id: string,
    url: string,
    source: Source,
    outcome: string
  ): TestDescription {
    return new TestDescription(ruleId, id, url, source, outcome);
  }

  // The 6 chars rule ID provided by ACT rules
  private readonly _ruleId: string;
  // The 6 chars test ID computed here
  private readonly _id: string;
  // The URL of the test case provided by ACT rules
  private readonly _url: string;
  // The tests set (new/old) this is part of
  private readonly _source: Source;
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
    source: Source,
    outcome: string
  ) {
    this._ruleId = ruleId;
    this._id = id;
    this._url = url;
    this._source = source;
    this._outcome = outcome;

    this._directory = path.join("test", "fixtures", this._source, this._ruleId);
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

  public get source(): string {
    return this._source;
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
