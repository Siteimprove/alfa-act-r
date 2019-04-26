import * as path from "path";
import * as fs from "fs";
import { ExecutionContext } from "ava";

import { Rule, Result, Outcome, audit } from "@siteimprove/alfa-act";
import { Seq } from "@siteimprove/alfa-collection";

import { Context } from "./context";

export interface FixtureOptions {
  skip?: Array<string>;
}

export function fixture(
  t: ExecutionContext<Context>,
  rule: Rule<any, any>,
  fixture: string,
  options: FixtureOptions = {}
): void {
  const directory = path.join("test", "fixtures", fixture);

  const tests = fs
    .readdirSync(directory)
    .filter(filename => filename.endsWith(".json"))
    .map(filename =>
      JSON.parse(fs.readFileSync(path.join(directory, filename), "utf8"))
    );

  t.plan(tests.length);

  for (const test of tests) {
    const skip = options.skip && options.skip.includes(test.id);

    const precedence: { [O in Outcome]: number } = {
      [Outcome.Failed]: 3,
      [Outcome.CantTell]: 2,
      [Outcome.Passed]: 1,
      [Outcome.Inapplicable]: 0
    };

    const result = Seq(audit(test.aspects, [rule]).results)
      .filter(result => result.rule === rule)
      .reduce<Result<any, any>>((result, candidate) =>
        precedence[candidate.outcome] > precedence[result.outcome]
          ? candidate
          : result
      );

    if (skip) {
      t.assert.skip(test.outcome === result.outcome, test.id);
    } else {
      t.assert(test.outcome === result.outcome, test.id);
    }

    t.context.results.push({
      aspects: test.aspects,
      result
    });
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
