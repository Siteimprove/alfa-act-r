import { Outcome } from "@siteimprove/alfa-act";
import { Page } from "@siteimprove/alfa-web";

export interface Context {
  outcomes: Array<Outcome<Page, unknown>>;
}
