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
  manual?: Array<string>;
  // Alfa is known to have a Inapplicable/Passed discrepancy with ACT-R
  lax?: Array<string>;
  answers?: {
    [fixture: string]: Array<FixtureAnswer>;
  };
}

const strict = process.argv.slice(2).includes("--strict");

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
    const manual =
      options.manual !== undefined && options.manual.includes(test.id);
    const lax = options.lax !== undefined && options.lax.includes(test.id);
    const testID = `${fixture} / ${test.id}`;

    if (skip === manual ? skip : lax) {
      t.log(
        `At most one of skip, manual, and lax should be set for ${testID}.`
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
          t.log(
            `Test case ${testID} matches but is incorrectly marked as skipped`
          );
        }
        if (manual) {
          t.log(
            `Test case ${testID} matches but is incorrectly marked as manual`
          );
        }
        if (lax) {
          t.log(`Test case ${testID} matches but is incorrectly marked as lax`);
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
      case "lax":
        // If the case is known to be a non strict match between Alfa and ACT-R, everything is fine.
        // Otherwise, emit a warning or an error depending on test mode.
        if (!lax) {
          if (strict) {
            t.fail(test.id);
            t.log("Outcome", outcome.toJSON());
            t.log("Test", test);
          } else {
            t.pass(test.id);
            t.log(
              `Test case ${testID} doesn't match perfectly, investigate and mark as lax.`
            );
          }
        } else {
          t.pass(test.id);
        }
        break;
      case "manual":
        // If the case is known to need an oracle, everything is fine.
        // Otherwise, emit a warning.
        t.pass(test.id);
        if (!manual) {
          t.log(
            `Test case ${testID} has no or incomplete oracle, mark as manual.`
          );
        }
        break;
    }

    t.context.outcomes.push([page, outcome]);
  }
}

export namespace fixture {
  export function title(
    title: string = "",
    rule: Rule<any, any, any>,
    fixture: string,
    options?: FixtureOptions
  ): string {
    return fixture;
  }
}

/**
 * @see https://act-rules.github.io/pages/implementations/mapping/#automated-mapping
 *
 *  ACT result -> | Inapplicable | Passed      | Failed
 *  ALFA ↓        |              |             |
 *  --------------+--------------+-------------+-------------
 *  Inapplicable  | OK (strict)  | OK (lax)    | Error
 *                |              | Warning     |
 *  --------------+--------------+-------------+-------------
 *  Passed        | OK (lax)     | OK (strict) | Error
 *                | Warning      |             |
 *  --------------+--------------+-------------+-------------
 *  Failed        | Error        | Error       | OK (strict)
 *  --------------+--------------+-------------+-------------
 *  CantTell      | OK (manual)  | OK (manual) | OK (manual)
 *                | Warning      | Warning     | Warning
 */
function mapping(
  actual: string,
  expected: string
): "ok" | "error" | "lax" | "manual" {
  switch (actual) {
    case "inapplicable":
      switch (expected) {
        case "inapplicable":
          return "ok";
        case "passed":
          return "lax";
        case "failed":
          return "error";
      }
      return "error";
    case "passed":
      switch (expected) {
        case "passed":
          return "ok";
        case "inapplicable":
          return "lax";
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
      return "manual";
  }
  return "error";
}
