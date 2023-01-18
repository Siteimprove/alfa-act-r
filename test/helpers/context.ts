import { Outcome, Rule } from "@siteimprove/alfa-act";
import { Hashable } from "@siteimprove/alfa-hash";

export type Context<I, T extends Hashable, Q, S> = {
  outcomes: Array<Test.Result<I, T, Q, S> | Test.Ignored<I, T, Q, S>>;
};

export namespace Test {
  export enum Kind {
    // For tests that actually produced a result that should be treated normally
    Result,
    // For tests that are ignored because Alfa doesn't support the file type,
    // or similar reason, and need special processing of the result.
    Ignored,
  }

  export interface Result<I, T extends Hashable, Q, S> {
    kind: Kind.Result;
    input: I;
    outcome: Outcome<I, T, Q, S>;
  }

  export interface Ignored<I, T extends Hashable, Q, S> {
    kind: Kind.Ignored;
    url: string;
    rule: Rule<I, T, Q, S>;
  }
}
