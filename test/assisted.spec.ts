import { Hex, RGB } from "@siteimprove/alfa-css";
import { Element, Node } from "@siteimprove/alfa-dom";
import path from "node:path";
import url from "node:url";

import type { TestFn } from "ava";
import ava from "ava";

import { Hashable } from "@siteimprove/alfa-hash";
import { None, Option } from "@siteimprove/alfa-option";
import { experimentalRules, Question, Rules } from "@siteimprove/alfa-rules";
import { Page } from "@siteimprove/alfa-web";

import type { Context } from "./helpers/context.js";
import { fixture as factory } from "./helpers/fixture.js";
import { report } from "./helpers/report.js";

const fixture = factory("fixtures", true);
const test = ava as TestFn<Context<Page, Hashable, Question.Metadata, unknown>>;

// TODO: This should be replaced with import.meta.dirname once we switch to Node 22
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function hex(col: string): RGB {
  const color = Hex.of(parseInt(`${col}ff`, 16));
  return RGB.of(color.red, color.green, color.blue, color.alpha);
}

function nodeWithPath(path?: string): (page: Page) => Option<Node> {
  return (page) =>
    path === undefined
      ? None
      : page.document
          .inclusiveDescendants()
          .find((node) => node.path() === path);
}

function first(element: string): (page: Page) => Option<Node> {
  return nodeWithPath(`/html[1]/body[1]/${element}[1]`);
}

const none = Option.empty;

function elementWithId(id: string): (page: Page) => Option<Node> {
  return (page) =>
    page.document
      .inclusiveDescendants()
      .filter(Element.isElement)
      .find(Element.hasId(id));
}

test.before("Initialise context", (t) => {
  t.context = { outcomes: [] };
});

test.after("Write report", (t) => {
  report(
    t.context,
    path.join(__dirname, "..", "reports", "alfa-assisted-report.json"),
  );
});

test("2779a5", (t) => fixture(t, Rules.get("R1")));

test("23a2a8", (t) =>
  fixture(t, Rules.get("R2"), {
    lax: [
      // Alfa intentionally ignores <img> elements that do not have a role of img
      // in order to ignore presentational images.
      "06ccd1",
      "3978fa",
      "736f30",
      "e5347a",
    ],
  }));

// The rule has been deprecated upstream
// test("3ea0c8", (t) => fixture(t, Rules.get("R3")));

test("b5c3f8", (t) => fixture(t, Rules.get("R4")));

test("bf051a", (t) => fixture(t, Rules.get("R5")));

// The rule has been deprecated upstream
// test("5b7ae0", (t) => fixture(t, Rules.get("R6")));

test("de46e4", (t) => fixture(t, Rules.get("R7")));

test("e086e5", (t) => fixture(t, experimentalRules.ER8));

test("bc659a", (t) => fixture(t, Rules.get("R9")));

test("73f2c2", (t) => fixture(t, Rules.get("R10")));

test("c487ae", (t) => fixture(t, Rules.get("R11")));

test("97a4e1", (t) => fixture(t, Rules.get("R12")));

test("cae760", (t) => fixture(t, Rules.get("R13")));

test("2ee8b8", (t) =>
  fixture(t, Rules.get("R14"), {
    skip: [
      // The text 'X' is considered as non-text content by the rule, not by Alfa
      // https://github.com/Siteimprove/alfa/issues/926
      "91a7e7",
      // the text is rendered as icon (non-text) due to the Material Icons fonts
      // but Alfa ignores it
      // https://github.com/Siteimprove/alfa/issues/1015
      "200f91",
      // Alfa discards hyphen instead of replacing it by space.
      // https://github.com/Siteimprove/alfa/issues/1558
      "3889b4",
    ],
  }));

test("4b1c6c", (t) =>
  fixture(t, Rules.get("R15"), {
    answers: {
      "1e31a1": { "reference-equivalent-resources": true },
      "3e4fb4": { "reference-equivalent-resources": false },
      "4490a0": { "reference-equivalent-resources": true },
      "4f46ed": { "reference-equivalent-resources": true },
      "84c7a3": { "reference-equivalent-resources": false },
      "8d7ac7": { "reference-equivalent-resources": true },
      d7c06c: { "reference-equivalent-resources": false },
      d7dce5: { "reference-equivalent-resources": false },
      e4f6fd: { "reference-equivalent-resources": true },
    },
  }));

test("4e8ab6", (t) => fixture(t, Rules.get("R16")));

test("6cfa84", (t) =>
  fixture(t, Rules.get("R17"), {
    skip: [
      // Alfa does not consider whether an element redirects focus or not
      "ea3fa4",
    ],
  }));

test("5c01ea", (t) => fixture(t, Rules.get("R18")));

// R19 corresponds to two separate rules upstream.
// The second rule has a fairly more focused Applicability which causes some
// Inapplicable/Passed differences.
test("6a7281", (t) => fixture(t, Rules.get("R19")));
test("in6db8", (t) =>
  fixture(t, Rules.get("R19"), {
    lax: [
      // R19 applies to all aria-attribute, while the ACT rules focused on `aria-control`
      // on some roles.
      "694c17" /* not a role requiring aria-control */,
      "08c6c4" /* not an expanded combobox */,
    ],
  }));

test("5f99a7", (t) => fixture(t, Rules.get("R20")));

// R21 is Siteimprove only

test("f51b46", (t) =>
  fixture(t, Rules.get("R22"), {
    answers: {
      "2fc026": {
        "is-video-streaming": false,
        "has-audio": false,
      },
      "5965ad": {
        "is-video-streaming": false,
        "has-audio": true,
        "has-captions": false,
      },
      "8a4a8d": {
        "is-video-streaming": false,
        "has-audio": true,
        // The captions do not have the same content has the audio content (mouse/computer)
        "has-captions": false,
      },
      "938b90": {
        "is-video-streaming": false,
        "has-audio": true,
        "has-captions": true,
      },
      "9941dc": {
        "is-video-streaming": false,
        "has-audio": true,
        "has-captions": true,
      },
      f7b0cb: {
        "is-video-streaming": false,
        "has-audio": true,
        "has-captions": false,
      },
      fecfd9: {
        "is-video-streaming": false,
        "has-audio": true,
        "has-captions": false,
      },
    },
  }));

test("2eb176", (t) =>
  fixture(t, Rules.get("R23"), {
    answers: {
      b30b78: {
        "is-audio-streaming": false,
        "is-playing": false,
        transcript: none,
        // The transcript is incorrect (Moon/cheese)
        "transcript-link": none,
      },
      "2973eb": {
        "is-audio-streaming": false,
        "is-playing": false,
        // The transcript is incorrect (Moon/cheese)
        transcript: none,
        "transcript-link": none,
      },
      "424c7d": {
        "is-audio-streaming": false,
        transcript: none,
        "transcript-link": first("a"),
      },
      "376f8d": {
        "is-audio-streaming": false,
        "is-playing": false,
        transcript: none,
        "transcript-link": none,
      },
      "40424b": {
        "is-audio-streaming": false,
        transcript: none,
        // The transcript is incorrect (Moon/cheese)
        "transcript-link": none,
      },
      cc4a44: {
        "is-audio-streaming": false,
        "is-playing": false,
        transcript: none,
        "transcript-link": first("a"),
      },
      c68096: {
        "is-audio-streaming": false,
        "is-playing": false,
        transcript: first("p"),
      },
      e12d00: {
        "is-audio-streaming": false,
        "is-playing": false,
        transcript: first("p"),
      },
      e85d6f: {
        "is-audio-streaming": false,
        "is-playing": false,
        transcript: none,
        "transcript-link": none,
      },
    },
  }));

test("1a02b0", (t) =>
  fixture(t, Rules.get("R24"), {
    answers: {
      "2b8c15": {
        "is-video-streaming": false,
        "has-audio": true,
        transcript: none,
        "transcript-link": first("a"),
      },
      "516864": {
        "is-video-streaming": false,
        "has-audio": true,
        transcript: none,
        // The transcript is incorrect (rabbit/dog)
        "transcript-link": none,
      },
      "5e5762": {
        "is-video-streaming": false,
        "has-audio": true,
        transcript: first("p"),
      },
      d72727: {
        "is-video-streaming": false,
        "has-audio": true,
        // The transcript is incorrect (rabbit/dog)
        transcript: none,
        "transcript-link": none,
      },
    },
  }));

test("1ea59c", (t) =>
  fixture(t, Rules.get("R25"), {
    answers: {
      "1ad085": {
        "is-video-streaming": false,
        "has-audio": true,
        // There is no description
        "has-description": false,
      },
      "270b3e": {
        "is-video-streaming": false,
        "has-audio": true,
        // The description is incorrect (rabbit/dog)
        "has-description": false,
      },
      "290a4b": {
        "is-video-streaming": false,
        "has-audio": true,
        // The description is incorrect (rabbit/dog)
        "has-description": false,
      },
      "632d76": {
        "is-video-streaming": false,
        "has-audio": true,
        "has-description": true,
      },
      "66631c": {
        "is-video-streaming": false,
        "has-audio": true,
        "has-description": true,
      },
      de54bf: { "is-video-streaming": false, "has-audio": false },
    },
  }));

test("fd26cf", (t) =>
  fixture(t, Rules.get("R26"), {
    answers: {
      "35a1c0": {
        "is-video-streaming": false,
        "has-audio": false,
        label: first("p"),
        // The transcript is incorrect (missing second sentence)
        "text-alternative": none,
      },
      "498798": {
        "is-video-streaming": false,
        "has-audio": false,
        label: none,
        "text-alternative": first("p"),
      },
      "714f23": {
        "is-video-streaming": false,
        "has-audio": true,
      },
      "971120": {
        "is-video-streaming": false,
        "has-audio": false,
        label: first("p"),
        "text-alternative": first("p"),
      },
      dfbf7a: {
        "is-video-streaming": false,
        "has-audio": false,
        label: none,
        "text-alternative": first("p"),
      },
      fc22f3: {
        "is-video-streaming": false,
        "has-audio": false,
        label: none,
        "text-alternative": none,
      },
    },
  }));

test("eac66b", (t) =>
  fixture(t, Rules.get("R27"), {
    answers: {
      "07d25d": {
        "is-video-streaming": false,
        "has-audio": true,
        label: none,
        "text-alternative": none,
        "has-captions": true,
      },
      "3fe6f1": {
        "is-video-streaming": false,
        "has-audio": true,
        label: first("p"),
        "text-alternative": first("p"),
        "has-captions": false,
      },
      "58b2a2": {
        "is-video-streaming": false,
        "has-audio": true,
        label: first("p"),
        // Transcript is incorrect (missing second sentence)
        "text-alternative": none,
        "has-captions": false,
      },
      abf5aa: { "is-video-streaming": false, "has-audio": false },
      e6ea12: {
        "is-video-streaming": false,
        "has-audio": true,
        label: none,
        "text-alternative": none,
        "has-captions": false,
      },
    },
  }));

test("59796f", (t) => fixture(t, Rules.get("R28")));

test("afb423", (t) =>
  fixture(t, Rules.get("R29"), {
    answers: {
      "014b50": {
        "is-audio-streaming": false,
        "is-playing": false,
        label: nodeWithPath("/html[1]/body[1]/p[2]"),
        "text-alternative": first("p"),
      },
      "03879f": {
        "is-audio-streaming": false,
        "is-playing": false,
        label: none,
        "text-alternative": first("p"),
      },
      "4628b5": {
        "is-audio-streaming": false,
        "is-playing": false,
        label: nodeWithPath("/html[1]/body[1]/p[2]"),
        // The transcript is incomplete (stops after two sentences)
        "text-alternative": none,
      },
      "6ecc06": {
        "is-audio-streaming": false,
        "is-playing": false,
        "play-button": none,
      },
      "71fb3f": {
        "is-audio-streaming": false,
        "is-playing": false,
        label: none,
        "text-alternative": first("p"),
      },
      "7cfc9c": {
        "is-audio-streaming": false,
        "is-playing": false,
        label: nodeWithPath("/html[1]/body[1]/p[2]"),
        "text-alternative": first("p"),
      },
    },
  }));

test("e7aa44", (t) =>
  fixture(t, Rules.get("R30"), {
    answers: {
      "12db69": {
        "is-audio-streaming": false,
        label: none,
        "text-alternative": none,
        transcript: first("p"),
      },
      "47d0f4": {
        "is-audio-streaming": false,
        "is-playing": false,
        label: nodeWithPath("/html[1]/body[1]/p[2]"),
        "text-alternative": first("p"),
        transcript: none,
        "transcript-link": none,
      },
      "53d912": {
        "is-audio-streaming": false,
        label: nodeWithPath("/html[1]/body[1]/p[2]"),
        "text-alternative": first("p"),
        transcript: none,
        "transcript-link": none,
      },
      bf7577: {
        "is-audio-streaming": false,
        "is-playing": false,
        "play-button": none,
      },
      c79ee0: {
        "is-audio-streaming": false,
        "is-playing": false,
        label: none,
        "text-alternative": none,
        transcript: first("p"),
      },
      f709c0: {
        "is-audio-streaming": false,
        "is-playing": false,
        label: none,
        "text-alternative": none,
        // The transcript is incorrect (Moon/North Pole)
        transcript: none,
        "transcript-link": none,
      },
    },
  }));

test("ab4d13", (t) =>
  fixture(t, Rules.get("R31"), {
    answers: {
      "1c42cb": {
        "is-video-streaming": false,
        "has-audio": true,
        label: none,
        "text-alternative": first("p"),
      },
      "35c11f": {
        "is-video-streaming": false,
        "has-audio": true,
        label: nodeWithPath("/html[1]/body[1]/p[2]"),
        "text-alternative": first("p"),
      },
      "9b10e2": {
        "is-video-streaming": false,
        "has-audio": true,
        label: first("p"),
        "text-alternative": first("p"),
      },
      b920fb: {
        "is-video-streaming": false,
        "has-audio": true,
        label: first("p"),
        "text-alternative": first("p"),
      },
      dd95b9: { "is-video-streaming": false, "has-audio": false },
      f83b8a: {
        "is-video-streaming": false,
        "has-audio": true,
        label: first("p"),
        // Missing second sentence
        "text-alternative": none,
      },
    },
  }));

test("d7ba54", (t) =>
  fixture(t, Rules.get("R32"), {
    answers: {
      "404977": {
        "is-video-streaming": false,
        "has-audio": false,
        "has-audio-track": true,
      },
      "448fb0": {
        "is-video-streaming": false,
        "has-audio": false,
        "has-audio-track": false,
      },
      d8d541: { "is-video-streaming": false, "has-audio": true },
      f63c1f: {
        "is-video-streaming": false,
        "has-audio": false,
        // Incorrect description (rabbit/dog)
        "has-audio-track": false,
      },
    },
  }));

test("ee13b5", (t) =>
  fixture(t, Rules.get("R33"), {
    answers: {
      "2b46ca": {
        "is-video-streaming": false,
        "has-audio": false,
        transcript: none,
        "transcript-link": none,
      },
      "2b68ac": {
        "is-video-streaming": false,
        "has-audio": false,
        transcript: first("p"),
      },
      "631539": { "is-video-streaming": false, "has-audio": true },
      "9c862c": {
        "is-video-streaming": false,
        "has-audio": false,
        transcript: none,
        // Transcript is incorrect (rabbit/dog)
        "transcript-link": none,
      },
      b1661f: {
        "is-video-streaming": false,
        "has-audio": false,
        // Transcript is incorrect (rabbit/dog)
        transcript: none,
        "transcript-link": none,
      },
      db4c3c: {
        "is-video-streaming": false,
        "has-audio": false,
        transcript: first("p"),
      },
      e3ab0a: {
        "is-video-streaming": false,
        "has-audio": false,
        transcript: none,
        "transcript-link": first("a"),
      },
    },
  }));

// R34 has been deprecated

test("c3232f", (t) =>
  fixture(t, Rules.get("R35"), {
    answers: {
      "0e99dc": {
        "is-video-streaming": false,
        "has-audio": false,
        transcript: none,
        "transcript-link": none,
        label: none,
        "text-alternative": none,
        "has-audio-track": false,
      },
      "350dd8": {
        "is-video-streaming": false,
        "has-audio": false,
        transcript: none,
        // Transcript is incorrect (rabbit/dog)
        "transcript-link": none,
        label: none,
        "text-alternative": none,
        "has-audio-track": false,
      },
      "8f95a1": {
        "is-video-streaming": false,
        "has-audio": false,
        transcript: none,
        "transcript-link": none,
        label: first("p"),
        "text-alternative": first("p"),
        "has-audio-track": false,
      },
      b35c88: {
        "is-video-streaming": false,
        "has-audio": false,
        transcript: none,
        "transcript-link": none,
        label: none,
        "text-alternative": none,
        // Audio description is incorrect (rabbit/dog)
        "has-audio-track": false,
      },
      b7bd83: {
        "is-video-streaming": false,
        "has-audio": false,
        transcript: none,
        "transcript-link": none,
        label: none,
        "text-alternative": none,
        "has-audio-track": true,
      },
      d4a4db: { "is-video-streaming": false, "has-audio": true },
      d6101c: {
        "is-video-streaming": false,
        "has-audio": false,
        transcript: none,
        "transcript-link": none,
        label: none,
        "text-alternative": first("p"),
        "has-audio-track": false,
      },
      dac9ee: {
        "is-video-streaming": false,
        "has-audio": false,
        transcript: first("p"),
        label: none,
        "text-alternative": none,
        "has-audio-track": false,
      },
    },
  }));

// R36 has been deprecated

test("1ec09b", (t) =>
  fixture(t, Rules.get("R37"), {
    answers: {
      "04667b": {
        "is-video-streaming": false,
        "has-audio": true,
        "has-description": false,
        "text-alternative": none,
        label: none,
      },
      "0ec33a": {
        "is-video-streaming": false,
        "has-audio": true,
        // The Audio description is incorrect (rabbit/dog)
        "has-description": false,
        "text-alternative": none,
        label: none,
      },
      "5a6e2a": {
        "is-video-streaming": false,
        "has-audio": true,
        "has-description": false,
        "text-alternative": first("p"),
        label: first("p"),
      },
      "91f1a8": {
        "is-video-streaming": false,
        "has-audio": true,
        "has-description": true,
        "text-alternative": none,
        label: none,
      },
      a4a496: {
        "is-video-streaming": false,
        "has-audio": true,
        "has-description": false,
        "text-alternative": none,
        label: none,
      },
      be53b8: { "is-video-streaming": false, "has-audio": false },
    },
  }));

test("c5a4ea", (t) =>
  fixture(t, Rules.get("R38"), {
    answers: {
      "00ff74": {
        "is-video-streaming": false,
        "has-audio": true,
        transcript: none,
        // Transcript is incorrect (rabbit/dog)
        "transcript-link": none,
        "has-description": false,
        "text-alternative": none,
        label: none,
      },
      "12dbd2": { "is-video-streaming": false, "has-audio": false },
      "5dbfe0": {
        "is-video-streaming": false,
        "has-audio": true,
        transcript: none,
        "transcript-link": none,
        "has-description": true,
        "text-alternative": none,
        label: none,
      },
      "73cdf1": {
        "is-video-streaming": false,
        "has-audio": true,
        transcript: none,
        "transcript-link": first("a"),
        "has-description": false,
        "text-alternative": none,
        label: none,
      },
      "813ea7": {
        "is-video-streaming": false,
        "has-audio": true,
        transcript: none,
        "transcript-link": none,
        "has-description": false,
        // Content is incomplete (missing second sentence)
        "text-alternative": none,
        label: first("p"),
      },
      "96b29b": {
        "is-video-streaming": false,
        "has-audio": true,
        transcript: none,
        "transcript-link": none,
        "has-description": false,
        "text-alternative": none,
        label: none,
      },
      adb7c3: {
        "is-video-streaming": false,
        "has-audio": true,
        transcript: none,
        "transcript-link": none,
        "has-description": false,
        "text-alternative": first("p"),
        label: first("p"),
      },
      d8b1b2: {
        "is-video-streaming": false,
        "has-audio": true,
        transcript: none,
        "transcript-link": none,
        // Description is incorrect (rabbit/dog)
        "has-description": false,
        "text-alternative": none,
        label: none,
      },
    },
  }));

// R39 has been deprecated upstream

// R40 is Siteimprove rule

test("b20e66", (t) =>
  fixture(t, Rules.get("R41"), {
    answers: {
      "01b3fc": { "reference-equivalent-resources": true },
      "1e15dd": { "reference-equivalent-resources": true },
      "2cd6ce": { "reference-equivalent-resources": false },
      "35dc57": { "reference-equivalent-resources": true },
      "675f10": { "reference-equivalent-resources": true },
      "7babd7": { "reference-equivalent-resources": true },
      "812cd2": { "reference-equivalent-resources": false },
      "8557f3": { "reference-equivalent-resources": false },
      "918293": { "reference-equivalent-resources": false },
      "9b6335": { "reference-equivalent-resources": false },
      a98dc5: { "reference-equivalent-resources": true },
      b52fce: { "reference-equivalent-resources": false },
      ee0f09: { "reference-equivalent-resources": true },
    },
  }));

test("ff89c9", (t) =>
  fixture(t, Rules.get("R42"), {
    lax: [
      // Alfa does consider elements whose role is implicit or explicit=implicit
      "29e934",
      "e61001",
    ],
  }));

test("7d6734", (t) => fixture(t, Rules.get("R43")));

test("b33eff", (t) => fixture(t, Rules.get("R44")));

test("a25f45", (t) => fixture(t, Rules.get("R45")));

test("d0f69e", (t) =>
  fixture(t, Rules.get("R46"), {
    skip: [
      // Alfa does not yet consider ARIA grids
      // https://github.com/act-rules/act-rules.github.io/pull/1971
      "08a84b",
    ],
    lax: [
      // Alfa does not consider ARIA tables
      // https://github.com/act-rules/act-rules.github.io/pull/1971
      "5dcc5b",
    ],
  }));

test("b4f0c3", (t) =>
  fixture(t, Rules.get("R47"), {
    lax: [
      // ACT rules is not clear in its definition
      // https://github.com/act-rules/act-rules.github.io/issues/1982
      "ee8640",
    ],
  }));

test("aaa1bf", (t) =>
  fixture(t, Rules.get("R48"), {
    answers: {
      "089083": {
        "is-above-duration-threshold": true,
        "is-below-audio-duration-threshold": false,
      },
      "68300c": {
        // The full audio last more than 3s, only 3s are autoplayed.
        "is-above-duration-threshold": true,
        "is-below-audio-duration-threshold": true,
      },
      "9847ba": {
        "has-audio": true,
        "is-above-duration-threshold": true,
        "is-below-audio-duration-threshold": false,
      },
      b57759: { "has-audio": false },
      c05a91: {
        "has-audio": true,
        // The full video last more than 3s, only 3s are autoplayed.
        "is-above-duration-threshold": true,
        "is-below-audio-duration-threshold": true,
      },
    },
  }));

test("4c31df", (t) =>
  fixture(t, Rules.get("R49"), {
    answers: {
      "0faddf": { "has-audio": true, "is-above-duration-threshold": true },
      "26698c": {
        "has-audio": true,
        "is-above-duration-threshold": true,
        "audio-control-mechanism": nodeWithPath(
          "/html[1]/body[1]/div[1]/div[1]/button[1]",
        ),
      },
      "74bb4f": {
        "is-above-duration-threshold": true,
        "audio-control-mechanism": none,
      },
      bc00f7: {
        "has-audio": true,
        "is-above-duration-threshold": true,
        "audio-control-mechanism": nodeWithPath(
          "/html[1]/body[1]/div[1]/div[1]/button[1]",
        ),
      },
      c55751: {
        "has-audio": true,
        "is-above-duration-threshold": true,
        "audio-control-mechanism": nodeWithPath(
          "/html[1]/body[1]/div[1]/div[1]/button[1]",
        ),
      },
      dd78cd: {
        "has-audio": true,
        "is-above-duration-threshold": true,
        "audio-control-mechanism": nodeWithPath(
          "/html[1]/body[1]/div[1]/div[1]/button[1]",
        ),
      },
      e50022: {
        "has-audio": true,
        "is-above-duration-threshold": true,
        "audio-control-mechanism": none,
      },
      ee7ad9: { "is-above-duration-threshold": true },
    },
  }));

test("80f0bf", (t) =>
  fixture(t, Rules.get("R50"), {
    answers: {
      "515d43": {
        "has-audio": true,
        "is-above-duration-threshold": true,
        "is-below-audio-duration-threshold": false,
        "audio-control-mechanism": none,
      },
      "54e307": {
        "is-above-duration-threshold": true,
        "is-below-audio-duration-threshold": false,
      },
      "77699c": {
        "has-audio": true,
        "is-above-duration-threshold": true,
        "is-below-audio-duration-threshold": false,
        "audio-control-mechanism": nodeWithPath(
          "/html[1]/body[1]/div[1]/div[1]/button[1]",
        ),
      },
      b62f05: {
        "has-audio": true,
        // The full video last more than 3s, only 3s are autoplayed.
        "is-above-duration-threshold": true,
        "is-below-audio-duration-threshold": true,
        "audio-control-mechanism": none,
      },
      bf4d12: { "has-audio": false },
      d92431: {
        "is-above-duration-threshold": true,
        "is-below-audio-duration-threshold": false,
        "audio-control-mechanism": none,
      },
    },
  }));

// R51 is Siteimprove only

// R52 is Siteimprove only

// R53 is Siteimprove only

// R54 is Siteimprove only

// R55 is Siteimprove only

// R56 is Siteimprove only

// R57 is Siteimprove only

// R58 is not implemented yet
// test("cf77f2", t => fixture(t, Rules.get("R58")));

// R59 is Siteimprove only

// R60 is Siteimprove only

// R61 is Siteimprove only

// Not yet merged in ACT rules
test.skip("be4d0c", (t) => fixture(t, Rules.get("R62")));

test("8fc3b6", (t) =>
  fixture(t, Rules.get("R63"), {
    lax: [
      // Alfa does not check the presence of an explicit role
      "6d6a37",
    ],
  }));

test("ffd0e9", (t) => fixture(t, Rules.get("R64")));

test("oj04fd", (t) =>
  fixture(t, Rules.get("R65"), {
    answers: {
      "7ac2f2": { "has-focus-indicator": false },
      f228e7: { "has-focus-indicator": true },
    },
    answersWithPath: {
      c80b3c: {
        "has-focus-indicator": {
          "/html[1]/body[1]/a[1]": true,
          "/html[1]/body[1]/a[2]": true,
          "/html[1]/body[1]/a[3]": true,
        },
      },
      "1ee18e": {
        "has-focus-indicator": {
          "/html[1]/body[1]/a[1]": true,
          "/html[1]/body[1]/a[2]": true,
          "/html[1]/body[1]/a[3]": true,
        },
      },
    },
  }));

// This image is used in several test cases.
// Only selecting some colors of the image, including the brightest and
// the darkest.
const blackHoleSunColors = [
  hex("0a0605"),
  hex("fbf9d2"),
  hex("a52001"),
  hex("fbae2c"),
];

test("09o5cg", (t) =>
  fixture(t, Rules.get("R66"), {
    answers: {
      "2eeb7d": { "background-colors": blackHoleSunColors },
      f32863: {
        // In this case, the text is not above the brightest parts of the image.
        "background-colors": [hex("9c1a00"), hex("4a0800"), hex("c64e00")],
      },
    },
    skip: [
      // Alfa assumes that non-human language text is marked as presentational
      // https://github.com/Siteimprove/alfa/issues/1166
      "e778ed",
      "c96cd5",

      // Alfa does not yet disregard impossible foreground/background combinations
      "09a8df",
    ],
  }));

// R67 is Siteimprove only

test("bc4a75", (t) =>
  fixture(t, Rules.get("R68"), {
    skip: [
      // Alfa accepts children that are not "required owned element" as this
      // is a common case and unclear what ARIA really mean
      // https://github.com/act-rules/act-rules.github.io/issues/1426
      "4af645",
      "6120d9",
    ],
  }));

test("afw4f7", (t) =>
  fixture(t, Rules.get("R69"), {
    skip: [
      // Alfa intentionally diverges on these cases
      // -> Alfa assumes that non-human language text is marked as presentational
      // https://github.com/Siteimprove/alfa/issues/1166
      "12198b",
      "d477f6",

      // Alfa does not yet disregard impossible foreground/background combinations
      "92452d",
    ],
    answers: {
      "951c28": { "background-colors": [hex("aaaaaa")] },
      "9939c7": { "background-colors": blackHoleSunColors },
      "7004f1": { "background-colors": [hex("979797"), hex("686868")] },
      e5c024: {
        // In this case, the text is not above the brightest parts of the image.
        "background-colors": [hex("9c1a00"), hex("4a0800"), hex("c64e00")],
      },
    },
  }));

// R70 is Siteimprove only

// R71 is Siteimprove only

// R72 is Siteimprove only

// R73 is Siteimprove only

// R74 is Siteimprove only

// R75 is Siteimprove only

// R76 is Siteimprove only

// R77 is Siteimprove only

// R78 is Siteimprove only

// R79 is Siteimprove only

// R80 is Siteimprove only

test("fd3a94", (t) =>
  fixture(t, Rules.get("R81"), {
    answers: {
      "10c991": { "reference-equivalent-resources": true },
      "1a4d92": { "reference-equivalent-resources": false },
      "1c14f0": { "reference-equivalent-resources": false },
      "2f044c": { "reference-equivalent-resources": false },
      "55d8b9": { "reference-equivalent-resources": false },
      "70f41b": { "reference-equivalent-resources": false },
      "75e59a": { "reference-equivalent-resources": true },
      "80824c": { "reference-equivalent-resources": true },
      "8d6fa9": { "reference-equivalent-resources": false },
      c16600: { "reference-equivalent-resources": true },
      c35667: { "reference-equivalent-resources": false },
      ce860d: { "reference-equivalent-resources": true },
      e0ec0a: { "reference-equivalent-resources": true },
      e9979a: { "reference-equivalent-resources": false },
      fd8682: { "reference-equivalent-resources": false },
    },
    skip: [
      // ACT Rules example is incorrect
      // https://github.com/act-rules/act-rules.github.io/issues/2175
      "709a75",
      // Alfa does not have an exception for "ambiguous to users in general"
      "8d6fa9",
      // Alfa does not consider `<div>` in the link context
      // https://github.com/Siteimprove/alfa/issues/767
      "e9979a",
    ],
    lax: [
      // Alfa does not consider `<div>` in the link context
      // https://github.com/Siteimprove/alfa/issues/767
      "3efafe",
    ],
  }));

test("36b590", (t) =>
  fixture(t, experimentalRules.R82, {
    answers: {
      "5aaae1": {
        "error-indicators": [elementWithId("error")],
        "error-indicator-identifying-form-field": elementWithId("error"),
        "error-indicator-describing-resolution": elementWithId("error"),
      },
      "9bb340": {
        // Both input fields are sharing the same error indicator
        "error-indicators": [elementWithId("error")],
        "error-indicator-identifying-form-field": none,
        "error-indicator-describing-resolution": none,
      },
      af38c1: {
        "error-indicators": [elementWithId("error")],
        "error-indicator-identifying-form-field": elementWithId("error"),
        "error-indicator-describing-resolution": none,
      },
      ca8775: {
        // All four fields are sharing the same error indicator
        "error-indicators": [elementWithId("error")],
        "error-indicator-identifying-form-field": none,
        "error-indicator-describing-resolution": elementWithId("error"),
      },
      de054f: {
        "error-indicators": [elementWithId("error")],
        "error-indicator-identifying-form-field": elementWithId("error"),
        "error-indicator-describing-resolution": elementWithId("error"),
      },
      e2891d: { "error-indicators": [] },
      e311ea: {
        "error-indicators": [elementWithId("error")],
        "error-indicator-identifying-form-field": elementWithId("error"),
        "error-indicator-describing-resolution": elementWithId("error"),
      },
    },
    answersWithPath: {
      "98d2f0": {
        "error-indicators": {
          "/html[1]/body[1]/form[1]/fieldset[1]/input[1]": [
            elementWithId("error"),
          ],
          "/html[1]/body[1]/form[1]/fieldset[1]/input[2]": [],
          "/html[1]/body[1]/form[1]/fieldset[2]/label[1]/input[1]": [
            elementWithId("error"),
          ],
          "/html[1]/body[1]/form[1]/fieldset[2]/label[2]/input[1]": [
            elementWithId("error"),
          ],
        },
        "error-indicator-identifying-form-field": {
          "/html[1]/body[1]/form[1]/fieldset[1]/input[1]":
            elementWithId("error"),
          "/html[1]/body[1]/form[1]/fieldset[2]/label[1]/input[1]":
            elementWithId("error"),
          "/html[1]/body[1]/form[1]/fieldset[2]/label[2]/input[1]":
            elementWithId("error"),
        },

        "error-indicator-describing-resolution": {
          "/html[1]/body[1]/form[1]/fieldset[1]/input[1]":
            elementWithId("error"),
          "/html[1]/body[1]/form[1]/fieldset[2]/label[1]/input[1]":
            elementWithId("error"),
          "/html[1]/body[1]/form[1]/fieldset[2]/label[2]/input[1]":
            elementWithId("error"),
        },
      },
    },
  }));

test("59br37", (t) =>
  fixture(t, Rules.get("R83"), {
    skip: [
      // Alfa assumes that the text scale can be configured by the user, which
      // would cause text clipping for this case.
      "155c46",

      // Alfa assumes that inline heights are controlled via JavaScript.
      "146ced",
      "a735e7",
      "c051af",

      // Alfa does not test the cases at the specified media query.
      "892465",
    ],
  }));

test("0ssw9k", (t) =>
  fixture(t, Rules.get("R84"), {
    skip: [
      // Alfa intentionally diverges on these cases
      // -> Alfa does not consider the exact layout when determining scrollability
      // https://github.com/Siteimprove/alfa/issues/183
      "b35c89",
      // Alfa assumes that any element with dimensions is visible, without looking
      // at content.
      "2ead59",
    ],
    lax: [
      // Alfa does not consider the exact layout when determining scrollability
      // so elements that are big enough are incorrectly deemed scrollable
      // https://github.com/Siteimprove/alfa/issues/183
      "4f3837",
      "977af1",
    ],
  }));

// R85 is Siteimprove only

test("46ca7f", (t) => fixture(t, Rules.get("R86")));

// Not merged upstream
test.skip("8a213c", (t) => fixture(t, Rules.get("R87")));

// Not implemented, not merged upstream
// test.skip("nqzcj8", t => fixture(t, Rules.get("R88")));

// R89 not implemented

test("307n5z", (t) => fixture(t, Rules.get("R90")));

test("24afc2", (t) => fixture(t, Rules.get("R91")));

test("9e45ec", (t) => fixture(t, Rules.get("R92")));

test("78fd32", (t) =>
  fixture(t, Rules.get("R93"), {
    skip: [
      // Alfa does not have a layout system and does not detect that the text
      // is in a wide scrolling element; instead it considers that any element
      // with a role of paragraph is a block of text.
      "61778d",
    ],
  }));

test("m6b1q3", (t) => fixture(t, Rules.get("R94")));

test("akn7bn", (t) =>
  fixture(t, Rules.get("R95"), {
    skip: [
      // The 1×1 iframe is visible, its content isn't.
      // Alfa does consider the descendant of visible 1×1 elements as visible.
      "90818c",
      // Alfa does not handle inert attribute
      // https://github.com/Siteimprove/alfa/issues/1140
      "475939",
      // Alfa doesn't handle iframe made inert by an open modal
      // https://github.com/Siteimprove/alfa/issues/1140#issuecomment-1807872577
      "08cfc1",
      "88d384",
    ],
  }));

test("bisz58", (t) => fixture(t, Rules.get("R96")));

// R97 is not implemented yet (part of R58)
// test("3e12e1", t => fixture(t, Rules.get("R97")));

// R98 is not implemented yet (part of R58)
// test("047fe0", t => fixture(t, Rules.get("R98")));

// R99 is not implemented yet (part of R58)
// test("b40fd1", t => fixture(t, Rules.get("R99")));

// R100 is not implemented yet (part of R58)
// test("ye5d6e", t => fixture(t, Rules.get("R100")));

// R101 is not implemented and not merged in ACT rules
// test("r18umj", t => fixture(t, Rules.get("R101")));

// R102 is not implemented and not merged in ACT rules
// test("kh5ids", t => fixture(t, Rules.get("R101")));

// R103 is SI only

// R104 is SI only

// R105 is SI only

// R106 is SI only

// R107 is SI only

// R108 is SI only

test("ucwvc8", (t) =>
  fixture(t, experimentalRules.R109, {
    answers: {
      "0dc883": { "document-language": "fr" },
      "185b49": { "document-language": "en" },
      "58e65a": { "document-language": "en" },
      "722fd3": { "document-language": "en" },
      cf6190: { "document-language": "en" },
      d7c89f: { "document-language": "en" },
      dcad97: { "document-language": "nl" },
      e32447: { "document-language": "en" },
      eb42cf: { "document-language": "nl" },
      f522a6: { "document-language": "en" },
    },
    lax: [
      // This page could be either in two languages one of them matches `lang`,
      // ACT rules makes it Inapplicable, but Alfa accepts it.
      "0dc883",
    ],
  }));

test("674b10", (t) => fixture(t, Rules.get("R110")));

// Not yet merged in ACT rules
test.skip("gi8qkf", (t) => fixture(t, Rules.get("R111")));

// R112 is not implemented yet

// Not yet merged in ACT rules
test.skip("5awcwe", (t) => fixture(t, Rules.get("R113")));

test("c4a8a4", (t) =>
  fixture(t, experimentalRules.R114, {
    answers: {
      "086645": { "is-title-descriptive": true },
      "097c44": { "is-title-descriptive": false },
      "4656d1": { "is-title-descriptive": true },
      "7ef35f": { "is-title-descriptive": false },
      "9f1a76": { "is-title-descriptive": false },
      cb36ba: { "is-title-descriptive": true },
    },
  }));

test("b49b2e", (t) =>
  fixture(t, experimentalRules.R115, {
    answers: {
      "15c774": { "is-heading-descriptive": false },
      "2953e2": { "is-heading-descriptive": true },
      "36c0f7": { "is-heading-descriptive": true },
      "4f2e4c": { "is-heading-descriptive": false },
      "797a7b": { "is-heading-descriptive": false },
      "7a0738": { "is-heading-descriptive": true },
      "7bb445": { "is-heading-descriptive": true },
      d39623: { "is-heading-descriptive": true },
      ecc4ce: { "is-heading-descriptive": true },
      fef97a: { "is-heading-descriptive": false },
    },
  }));

test("2t702h", (t) => fixture(t, Rules.get("R116")));
