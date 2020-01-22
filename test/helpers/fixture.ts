import * as path from "path";
import * as fs from "fs";

import { ExecutionContext } from "ava";

import { Audit, Rule, Outcome } from "@siteimprove/alfa-act";
import { Option } from "@siteimprove/alfa-option";
import { Page } from "@siteimprove/alfa-web";
import * as xpath from "@siteimprove/alfa-xpath";

import { Context } from "./context";

export interface FixtureAnswer {
  target: string;
  type: "boolean";
  question: string;
  answer: boolean;
}

export interface FixtureOptions {
  skip?: Array<string>;
  answers?: {
    [fixture: string]: Array<FixtureAnswer>;
  };
}

export async function fixture(
  t: ExecutionContext<Context>,
  rule: Option<Rule<Page, unknown>>,
  fixture: string,
  options: FixtureOptions = {}
): Promise<void> {
  const directory = path.join("test", "fixtures", fixture);

  const tests = fs
    .readdirSync(directory)
    .filter(filename => filename.endsWith(".json"))
    .map(filename =>
      JSON.parse(fs.readFileSync(path.join(directory, filename), "utf8"))
    );

  t.plan(tests.length);

  for (const test of tests) {
    const page = Page.from(test.page);

    const skip = options.skip && options.skip.includes(test.id);

    const outcome = await Audit.of(page)
      .add(rule.get())
      .evaluate()
      .map(outcomes =>
        [...outcomes]
          .filter(outcome => outcome.rule === rule.get())
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

    if (skip) {
      t.is.skip(expected, actual, test.id);
    } else {
      t.is(expected, actual, test.id);

      if (expected !== actual) {
        t.log("Outcome", outcome.toJSON());
        t.log("Test", test);
      }
    }

    t.context.outcomes.push([page, outcome]);
  }
}

export namespace fixture {
  export function title(
    title: string = "",
    rule: Rule<any, any>,
    fixture: string,
    options?: FixtureOptions
  ): string {
    return fixture;
  }
}
