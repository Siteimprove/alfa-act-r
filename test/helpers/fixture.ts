import * as path from "path";
import * as fs from "fs";

import { ExecutionContext } from "ava";

import { Audit, Rule, Outcome } from "@siteimprove/alfa-act";
import { Option } from "@siteimprove/alfa-option";
import { Page } from "@siteimprove/alfa-web";

import { Context } from "./context";

export interface FixtureAnswer {
  target: string;
  type: "boolean";
  question: string;
  answer: boolean;
}

export interface FixtureOptions {
  // Alfa is known to not match the implementation mapping
  skip?: Array<string>;
  // The test is known to need an oracle
  needOracle?: Array<string>;
  // Alfa is known to have a Inapplicable/Passed discrepancy with ACT-R
  nonStrict?: Array<string>;
  answers?: {
    [fixture: string]: Array<FixtureAnswer>;
  };
}

const strict = process.argv[2] === "--strict";

export async function fixture(
  t: ExecutionContext<Context>,
  rule: Option<Rule<Page, unknown, any>>,
  fixture: string,
  options: FixtureOptions = {}
): Promise<void> {
  const directory = path.join("test", "fixtures", fixture);

  const tests = fs
    .readdirSync(directory)
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) =>
      JSON.parse(fs.readFileSync(path.join(directory, filename), "utf8"))
    );

  t.plan(tests.length);

  for (const test of tests) {
    const page = Page.from(test.page);

    const skip = options.skip !== undefined && options.skip.includes(test.id);
    const needOracle =
      options.needOracle !== undefined && options.needOracle.includes(test.id);
    const nonStrict =
      options.nonStrict !== undefined && options.nonStrict.includes(test.id);
    const testID = `${fixture} / ${test.id}`;

    if (skip === needOracle ? skip : nonStrict) {
      console.warn(
        `At most one of skip, needOracle, and nonStrict should be set for ${testID}.`
      );
    }

    const outcome = await Audit.of<Page, unknown, unknown>(page, [rule.get()])
      .evaluate()
      .map((outcomes) =>
        [...outcomes]
          .filter((outcome) => outcome.rule === rule.get())
          .reduce((outcome, candidate) => {
            if (Outcome.isFailed(outcome)) {
              return outcome;
            }

            if (Outcome.isFailed(candidate)) {
              return candidate;
            }

            if (Outcome.isPassed(outcome)) {
              return outcome;
            }

            if (Outcome.isPassed(candidate)) {
              return candidate;
            }

            return outcome;
          })
      );

    const expected = test.outcome;
    const actual = outcome.toJSON().outcome;

    const result = mapping(actual, expected);

    switch (result) {
      case "ok": // Alfa and ACT-R perfectly agree
        t.pass(test.id);
        // Display warnings if the case was registered as imperfect match
        if (skip) {
          console.warn(
            `Test case ${testID} matches but is incorrectly marked as skipped`
          );
        }
        if (needOracle) {
          console.warn(
            `Test case ${testID} matches but is incorrectly marked as needing an oracle`
          );
        }
        if (nonStrict) {
          console.warn(
            `Test case ${testID} matches but is incorrectly marked as not strict`
          );
        }
        break;
      case "error":
        if (skip) {
          t.fail.skip(test.id);
        } else {
          t.fail(test.id);
          t.log("Outcome", outcome.toJSON());
          t.log("Test", test);
        }
        break;
      case "nonStrict":
        // If the case is known to be a non strict match between Alfa and ACT-R, everything is fine.
        // Otherwise, emit a warning or an error depending on test mode.
        if (!nonStrict) {
          if (strict) {
            t.fail(test.id);
            t.log("Outcome", outcome.toJSON());
            t.log("Test", test);
          } else {
            t.pass(test.id);
            console.warn(
              `Test case ${testID} doesn't match perfectly, investigate and mark as nonStrict.`
            );
          }
        } else {
          t.pass(test.id);
        }
        break;
      case "needOracle":
        // If the case is known to need an oracle, everything is fine.
        // Otherwise, emit a warning.
        t.pass(test.id);
        if (!needOracle) {
          console.warn(
            `Test case ${testID} has no or incomplete oracle, mark as needOracle.`
          );
        }
        break;
    }

    t.context.outcomes.push([page, outcome]);
  }
}

/**
 * @see https://act-rules.github.io/pages/implementations/mapping/#automated-mapping
 *
 *  ACT result -> | Inapplicable     | Passed           | Failed
 *  ALFA ↓        |                  |                  |
 *  --------------+------------------+------------------+-------------
 *  Inapplicable  | OK (strict)      | OK (not strict)  | Error
 *                |                  | Warning          |
 *  --------------+------------------+------------------+-------------
 *  Passed        | OK (not strict)  | OK (strict)      | Error
 *                | Warning          |                  |
 *  --------------+------------------+------------------+-------------
 *  Failed        | Error            | Error            | OK (strict)
 *  --------------+------------------+------------------+-------------
 *  CantTell      | OK (need oracle) | OK (need oracle) | OK (need oracle)
 *                | Warning          | Warning          | Warning
 */
function mapping(
  actual: string,
  expected: string
): "ok" | "error" | "nonStrict" | "needOracle" {
  switch (actual) {
    case "inapplicable":
      switch (expected) {
        case "inapplicable":
          return "ok";
        case "passed":
          return "nonStrict";
        case "failed":
          return "error";
      }
      return "error";
    case "passed":
      switch (expected) {
        case "passed":
          return "ok";
        case "inapplicable":
          return "nonStrict";
        case "failed":
          return "error";
      }
      return "error";
    case "failed":
      switch (expected) {
        case "inapplicable":
        case "passed":
          return "error";
        case "failed":
          return "ok";
      }
      return "error";
    case "cantTell":
      return "needOracle";
  }
  return "error";
}
