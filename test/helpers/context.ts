import { Aspect, Aspects, Target, Result } from "@siteimprove/alfa-act";

export interface Context {
  results: Array<{ aspects: Aspects; result: Result<Aspect, Target> }>;
}
