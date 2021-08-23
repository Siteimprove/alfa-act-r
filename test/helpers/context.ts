import { Outcome } from "@siteimprove/alfa-act";

export interface Context<I, T, Q, S> {
  outcomes: Array<readonly [I, Outcome<I, T, Q, S>]>;
}
