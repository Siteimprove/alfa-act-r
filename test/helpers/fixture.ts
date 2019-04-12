import * as path from "path";
import * as fs from "fs";
import { ExecutionContext } from "ava";

import { Rule, Outcome, audit } from "@siteimprove/alfa-act";

export interface FixtureOptions {
  skip?: Array<string>;
}

export function fixture(
  t: ExecutionContext,
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

  for (const test of tests) {
    if (options.skip && options.skip.includes(test.id)) {
      continue;
    }

    const precedence: { [O in Outcome]: number } = {
      [Outcome.Failed]: 3,
      [Outcome.CantTell]: 2,
      [Outcome.Passed]: 1,
      [Outcome.Inapplicable]: 0
    };

    const result = audit(test.aspects, [rule])
      .results.filter(result => result.rule === rule)
      .reduce((result, candidate) =>
        precedence[candidate.outcome] > precedence[result.outcome]
          ? candidate
          : result
      );

    t.assert(test.outcome === result.outcome, test.id);
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
