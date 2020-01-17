import * as fs from "fs";

import { List } from "@siteimprove/alfa-json-ld";

import { Context } from "./context";

export function manifest(context: Context, out: string) {
  const graph: List = [];

  for (const outcome of context.outcomes) {
    graph.push(outcome.toEARL());
  }

  fs.writeFileSync(out, JSON.stringify(graph, null, 2));
}
