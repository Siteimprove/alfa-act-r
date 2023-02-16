import { Rule } from "@siteimprove/alfa-act";
import { Hashable } from "@siteimprove/alfa-hash";
import { Document } from "@siteimprove/alfa-json-ld";
import { Set } from "@siteimprove/alfa-set";
import { Page } from "@siteimprove/alfa-web";

import * as fs from "fs";
import * as jsonld from "jsonld";

import { Context, Test } from "./context";

const AlfaVersion = JSON.parse(
  fs.readFileSync(process.env.npm_package_json ?? "", "utf8")
).dependencies["@siteimprove/alfa-rules"].replace("^", "");

export async function report<T extends Hashable, Q, S>(
  context: Context<Page, T, Q, S>,
  out: string
) {
  const graph: Array<Document> = [assertorAlfa];
  let rules = Set.empty<Rule<Page, T, Q, S>>();

  for (const test of context.outcomes) {
    if (test.kind === Test.Kind.Ignored) {
      recordIgnoredCase(graph, test);
    } else {
      // The graph is modified by side effect while the rules set is explicitly
      // updated. This is pretty hacky…
      rules = recordCase(graph, rules, test);
    }
  }

  for (const rule of rules) {
    graph.push(rule.toEARL());
  }

  const compact = await jsonld.compact(
    graph as jsonld.JsonLdDocument,
    ACTContext
  );

  fs.writeFileSync(out, JSON.stringify(compact, null, 2));
}

function recordCase<T extends Hashable, Q, S>(
  graph: Array<Document>,
  rules: Set<Rule<Page, T, Q, S>>,
  test: Test.Result<Page, T, Q, S>
): Set<Rule<Page, T, Q, S>> {
  const { input: page, outcome } = test;

  const subject = page.toEARL();

  graph.push(subject);

  const assertion = outcome.toEARL();

  assertion["earl:subject"] = {
    "@id": subject["@id"],
  };
  assertion["earl:assertedBy"] = "Alfa";

  graph.push(assertion);

  return rules.add(outcome.rule);
}

function recordIgnoredCase<I, T extends Hashable, Q, S>(
  graph: Array<Document>,
  test: Test.Ignored<I, T, Q, S>
): void {
  const subject = {
    "@context": {
      earl: "http://www.w3.org/ns/earl#",
    },
    "@id": test.url,
    source: test.url,
    "@type": ["earl:TestSubject"],
    url: test.url,
  };
  const assertion = {
    "@context": {
      earl: "http://www.w3.org/ns/earl#",
    },
    "@type": "earl:Assertion",
    "earl:subject": { "@id": test.url },
    "earl:result": {
      "@type": "earl:TestResult",
      "earl:outcome": {
        "@id": "earl:cantTell",
      },
    },
    "earl:test": test.rule.toEARL(),
  };

  graph.push(subject, assertion);
}

const assertorAlfa = {
  "@context": {
    earl: "http://www.w3.org/ns/earl#",
    doap: "http://usefulinc.com/ns/doap#",
  },
  "@type": ["earl:Assertor", "@earl:Software"],
  "@id": "Alfa",
  "doap:url": "https://alfa.siteimprove.com",
  "doap:name": "Alfa",
  "doap:release": {
    "@type": "Version",
    "doap:revision": AlfaVersion ?? "no version found",
  },
};

/**
 * The JSON-LD context used by ACT rules CG
 * {@link https://act-rules.github.io/earl-context.json}
 */
// We want a local copy of the context to avoid network connexion when
// compacting JSON-LD documents.
const ACTContext = {
  "@vocab": "http://www.w3.org/ns/earl#",
  earl: "http://www.w3.org/ns/earl#",
  WCAG: "https://www.w3.org/TR/WCAG/#",
  WCAG10: "https://www.w3.org/TR/WCAG10/#",
  WCAG2: "https://www.w3.org/TR/WCAG2/#",
  WCAG20: "https://www.w3.org/TR/WCAG20/#",
  WCAG21: "https://www.w3.org/TR/WCAG21/#",
  WCAG22: "https://www.w3.org/TR/WCAG22/#",
  WCAG30: "https://www.w3.org/TR/wcag-3.0/#",
  dct: "http://purl.org/dc/terms/",
  sch: "https://schema.org/",
  doap: "http://usefulinc.com/ns/doap#",
  foaf: "http://xmlns.com/foaf/0.1/",
  ptr: "http://www.w3.org/2009/pointers#",
  cnt: "http://www.w3.org/2011/content#",
  "http-vocab": "http://www.w3.org/2011/http#",
  WebPage: "sch:WebPage",
  url: "dct:source",
  source: "dct:source",
  redirectedTo: "dct:source",
  title: "dct:title",
  Project: "doap:Project",
  Version: "doap:Version",
  name: "doap:name",
  description: "doap:description",
  shortdesc: "doap:shortdesc",
  created: "doap:created",
  release: "doap:release",
  revision: "doap:revision",
  homepage: {
    "@id": "doap:homepage",
    "@type": "@id",
  },
  license: {
    "@id": "doap:license",
    "@type": "@id",
  },
  assertedThat: {
    "@reverse": "assertedBy",
  },
  assertions: {
    "@reverse": "subject",
  },
  assertedBy: {
    "@type": "@id",
  },
  outcome: {
    "@type": "@id",
  },
  mode: {
    "@type": "@id",
  },
  pointer: {
    "@type": "ptr:CSSSelectorPointer",
  },
  isPartOf: {
    "@id": "dct:isPartOf",
    "@type": "@id",
  },
};
