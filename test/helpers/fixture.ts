import * as path from "path";
import * as fs from "fs";
import { ExecutionContext } from "ava";

import { Rule, audit } from "@siteimprove/alfa-act";

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

    const result = audit(test.aspects, [rule])
      .results.filter(result => result.rule === rule)
      .reduce((result, candidate) =>
        result.outcome === "failed"
          ? result
          : candidate.outcome === "failed"
          ? candidate
          : result.outcome === "cantTell"
          ? result
          : candidate.outcome === "cantTell"
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
