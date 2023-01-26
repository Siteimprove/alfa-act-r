import { Array } from "@siteimprove/alfa-array";
import { Audit, Outcome, Rule } from "@siteimprove/alfa-act";
import { Hashable } from "@siteimprove/alfa-hash";
import { Map } from "@siteimprove/alfa-map";
import { Option } from "@siteimprove/alfa-option";
import { Question } from "@siteimprove/alfa-rules";
import { Page } from "@siteimprove/alfa-web";

import { ExecutionContext } from "ava";
import * as fs from "fs";
import * as path from "path";

import { Fixture } from "../../common/fixture";

import { Context, Test } from "./context";
import { oracle } from "./oracle";

const strict = process.argv.slice(2).includes("--strict");

function readFixtures(directory: string): Array<Fixture.Fixture> {
  return fs
    .readdirSync(directory)
    .filter((filename) => filename.endsWith(".json"))
    .map(
      (filename) =>
        JSON.parse(
          fs.readFileSync(path.join(directory, filename), "utf8")
        ) as Fixture.Fixture
    );
}

export function fixture(
  dir: string,
  // If true, treat cantTell outcomes as non-strict matches.
  assisted: boolean = false
): <T extends Hashable, S>(
  t: ExecutionContext<Context<Page, T, Question.Metadata, S>>,
  rule: Option<Rule<Page, T, Question.Metadata, S>>,
  options?: Fixture.Options
) => Promise<void> {
  return async (t, rule, options = {}) => {
    if (!rule.isSome()) {
      return;
    }

    const fixture = t.title;

    // Record which option has been used to report the unused ones.
    let seen = (options.skip || [])
      .concat(options.lax || [])
      .concat(options.manual || [])
      .reduce((map, cur) => map.set(cur, false), Map.empty<string, boolean>());

    // Read all test cases for a given rule
    const tests = readFixtures(path.join("test", dir, fixture));

    t.plan(tests.length);

    for (const test of tests) {
      // If test has an unsupported type, just push it to the context as Ignored.
      if (test.type === "xml") {
        t.context.outcomes.push({
          kind: Test.Kind.Ignored,
          url: test.url,
          rule: rule.get(),
        });
        t.pass(test.id);
        continue;
      }

      const page = Page.from(test.page);

      const skip = options.skip?.includes(test.id) ?? false;
      const manual = options.manual?.includes(test.id) ?? false;
      const lax = options.lax?.includes(test.id) ?? false;
      const testID = `${fixture} / ${test.id}`;

      if (skip === manual ? skip : lax) {
        t.log(
          `At most one of skip, manual, and lax should be set for ${testID}.`
        );
      }

      seen = seen.set(test.id, true);

      const outcome = await Audit.of(
        page,
        [rule.get()],
        manual ? undefined : oracle(options.answers?.[test.id] ?? {}, t, testID)
      )
        .evaluate()
        .map((outcomes) =>
          Array.from(outcomes)
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
      const actual = outcome.outcome;
      const result = mapping(actual, expected);

      report(
        t,
        result,
        fixture,
        test,
        outcome.toJSON(),
        [skip, manual, lax],
        assisted
      );

      t.context.outcomes.push({
        kind: Test.Kind.Result,
        input: page,
        outcome: outcome,
      });
    }

    const notSeen = Array.from(seen.reject((value) => value).keys());
    if (notSeen.length > 0) {
      t.log(
        `Test cases ${fixture} / [${notSeen}] have been deleted upstream. Remove flags.`
      );
    }
  };
}

type Mapping = "ok" | "error" | "lax" | "manual";

/**
 * Compare Alfa's outcome with the expected one,
 * report any problem,
 * pass or fail the test.
 */
function report<T extends Hashable, Q, S>(
  t: ExecutionContext<Context<Page, T, Q, S>>,
  result: Mapping,
  fixtureID: string,
  test: Fixture.Fixture,
  outcome: Outcome.JSON,
  [skip, manual, lax]: [boolean, boolean, boolean],
  assisted: boolean = false
): void {
  const fullTestId = `${fixtureID} / ${test.id}`;

  switch (result) {
    case "ok": // Alfa and ACT-R perfectly agree
      // In strict mode for marked cases, fail and investigate why it is marked
      if (strict && (skip || manual || lax)) {
        t.fail(test.id);
        t.log("Outcome", outcome);
        t.log("Test", test);
      } else {
        t.pass(test.id);
        // Display warnings if the case was registered as imperfect match
        if (skip) {
          t.log(
            `Test case ${fullTestId} matches but is incorrectly marked as skipped`
          );
        }
        if (manual) {
          t.log(
            `Test case ${fullTestId} matches but is incorrectly marked as manual`
          );
        }
        if (lax) {
          t.log(
            `Test case ${fullTestId} matches but is incorrectly marked as lax`
          );
        }
      }
      break;
    case "error":
      if (skip) {
        t.fail.skip(test.id);
      } else {
        t.fail(test.id);
        t.log("Outcome", outcome);
        t.log("Test", test);
      }
      break;
    case "lax":
      // If the case is known to be a non-strict match between Alfa and ACT-R, everything is fine.
      // Otherwise, emit a warning or an error depending on test mode.
      if (!lax) {
        if (strict) {
          t.fail(test.id);
          t.log("Outcome", outcome);
          t.log("Test", test);
        } else {
          t.pass(test.id);
          t.log(
            `Test case ${fullTestId} doesn't match perfectly, investigate and mark as lax.`
          );
        }
      } else {
        t.pass(test.id);
      }
      break;
    case "manual":
      if (!assisted) {
        // This is an automated implementation, cantTell results are expected.
        t.pass(test.id);
        // If the case is known to need an oracle, everything is fine.
        // Otherwise, emit a warning.
        if (!manual) {
          t.log(
            `Test case ${fullTestId} cannot be checked automatically, mark as manual.`
          );
        }
      } else {
        // This is an assisted implementation, cantTell results are supsicious
        if (strict) {
          t.fail(test.id);
          t.log("Outcome", outcome);
          t.log("Test", test);
        } else {
          t.pass(test.id);
          t.log(`Test case ${fullTestId} has incomplete oracle.`);
        }
      }
      break;
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
function mapping(actual: Fixture.Outcome, expected: Fixture.Outcome): Mapping {
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
