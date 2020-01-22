import * as fs from "fs";

import { List } from "@siteimprove/alfa-json-ld";

import { Context } from "./context";

export function manifest(context: Context, out: string) {
  const graph: List = [];

  for (const [page, outcome] of context.outcomes) {
    const subject = page.toEARL();

    graph.push(subject);

    const assertion = outcome.toEARL();

    assertion["earl:subject"] = {
      "@id": subject["@id"]
    };

    graph.push(assertion);
  }

  fs.writeFileSync(out, JSON.stringify(graph, null, 2));
}
