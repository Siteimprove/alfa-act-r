import * as fs from "fs";

import { Document } from "@siteimprove/alfa-json-ld";
import { Page } from "@siteimprove/alfa-web";

import { Context } from "./context";

export function report<T, Q, S>(context: Context<Page, T, Q, S>, out: string) {
  const graph: Array<Document> = [];

  for (const [page, outcome] of context.outcomes) {
    const subject = page.toEARL();

    graph.push(subject);

    const assertion = outcome.toEARL();

    assertion["earl:test"] = outcome.rule.toEARL();

    assertion["earl:subject"] = {
      "@id": subject["@id"],
    };

    graph.push(assertion);
  }

  fs.writeFileSync(out, JSON.stringify(graph, null, 2));
}
