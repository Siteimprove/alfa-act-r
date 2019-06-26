import * as fs from "fs";

import { toJSON } from "@siteimprove/alfa-act";
import { List } from "@siteimprove/alfa-json-ld";

import { Context } from "./context";

export function manifest(context: Context, out: string) {
  const graph: List = [];

  for (const { aspects, result } of context.results) {
    graph.push(...toJSON([result], aspects));
  }

  const seen = new Set<string>();

  for (let i = 0, n = graph.length; i < n; i++) {
    const node = graph[i];

    if (node !== null && typeof node === "object") {
      const id = node["@id"];

      if (id !== undefined && typeof id === "string") {
        if (seen.has(id)) {
          graph.splice(i, 1);
          i--;
          n--;
        } else {
          seen.add(id);
        }
      }
    }
  }

  fs.writeFileSync(out, JSON.stringify(graph, null, "  "));
}
