import { Outcome, Rule } from "@siteimprove/alfa-act";

export type Context<I, T, Q, S> = {
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

  export interface Result<I, T, Q, S> {
    kind: Kind.Result;
    input: I;
    outcome: Outcome<I, T, Q, S>;
  }

  export interface Ignored<I, T, Q, S> {
    kind: Kind.Ignored;
    url: string;
    rule: Rule<I, T, Q, S>;
  }
}
