import ava, { TestInterface } from "ava";
import { Rules } from "@siteimprove/alfa-rules";
import { Context } from "./helpers/context";
import { fixture } from "./helpers/fixture";
import { manifest } from "./helpers/manifest";

const test = ava as TestInterface<Context>;

test.before("Initialise context", (t) => {
  t.context = { outcomes: [] };
});

test.after("Write manifest", (t) => {
  manifest(t.context, "test/manifest.json");
});

test(fixture, Rules.get("R1"), "2779a5");

test(fixture, Rules.get("R2"), "23a2a8");

test(fixture, Rules.get("R3"), "3ea0c8");

test(fixture, Rules.get("R4"), "b5c3f8", {
  skip: [
    // Open issue, should be HTML and not XML
    "936156",
  ],
});

test(fixture, Rules.get("R5"), "bf051a");

test(fixture, Rules.get("R6"), "5b7ae0");

test(fixture, Rules.get("R7"), "de46e4");

test(fixture, Rules.get("R8"), "e086e5");

test(fixture, Rules.get("R9"), "bc659a");

test(fixture, Rules.get("R10"), "73f2c2");

test(fixture, Rules.get("R11"), "c487ae");

test(fixture, Rules.get("R12"), "97a4e1");

test(fixture, Rules.get("R13"), "cae760", {
  skip: [
    // Alfa consider all iframe, not restricting to sequential tab navigation
    // and isTabbable actually skip iframe as they redirect focus.
    "4a1aa5",
  ],
});

test.skip(fixture, Rules.get("R14"), "2ee8b8", {
  answers: {
    "0643": [
      {
        target: "//div",
        type: "boolean",
        question: "is-human-language",
        answer: true,
      },
    ],
    "924a": [
      {
        target: "//button",
        type: "boolean",
        question: "is-human-language",
        answer: true,
      },
    ],
    "87c5": [
      {
        target: "//button",
        type: "boolean",
        question: "is-human-language",
        answer: false,
      },
    ],
  },
});

test.skip(fixture, Rules.get("R15"), "4b1c6c", {
  answers: {
    f589: [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false,
      },
    ],
    "9759": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true,
      },
    ],
    "49f6": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true,
      },
    ],
    "422e": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true,
      },
    ],
    "2bf0": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true,
      },
    ],
    "2750": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true,
      },
    ],
    "175f": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false,
      },
    ],
    "13c2": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false,
      },
    ],
  },
  skip: [
    // bug in Alfa
    // ACT rule consider <iframe> in the same HTML page, Alfa only in the same document tree.
    // Thus, nested iframes are considered all together by ACT rule, not by Alfa
    "b327b8",
  ],
});

test(fixture, Rules.get("R16"), "4e8ab6");

test(fixture, Rules.get("R17"), "6cfa84");

test(fixture, Rules.get("R18"), "5c01ea", {
  skip: [
    // aria-expanded is not allowed on complementary in ARIA 1.2
    // These test cases have been removed upstream, but I'm not fetching new cases now…
    "9cae55",
    "b47bcb",
  ],
});

test(fixture, Rules.get("R19"), "6a7281", {
  skip: [
    // Alfa does not yet check ID and ID reference attributes
    "0a0ff1",
  ],
});

test(fixture, Rules.get("R20"), "5f99a7");

test(fixture, Rules.get("R21"), "674b10", {
  skip: [
    // Alfa requires that all roles be valid.
    "afc56c",
  ],
});

// R22 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R22"), "f51b46");

// R23 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R23"), "2eb176");

// R24 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R24"), "1a02b0");

// R25 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R25"), "1ea59c");

// R26 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R26"), "fd26cf");

// R27 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R27"), "eac66b");

test(fixture, Rules.get("R28"), "59796f", {
  skip: [
    // Image button have default accessible name, thus the rule should never fail
    // @see https://github.com/act-rules/act-rules.github.io/issues/1457
    "027548",
    "db01f7",
    "ecd48a",
  ],
});

// R29 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R29"), "afb423");

// R30 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R30"), "e7aa44");

// R31 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R31"), "ab4d13");

// R32 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R32"), "d7ba54");

// R33 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R33"), "ee13b5");

// R34 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R34"), "ac7dc6");

// R35 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R35"), "c3232f");

// R36 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R36"), "f196ce");

// R37 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R37"), "1ec09b");

// R38 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R38"), "c5a4ea");

// R39 always has questions in expectation, review flow not currently handled
test.skip(fixture, Rules.get("R39"), "9eb3f6", {
  answers: {
    d6c3: [
      {
        target: "//img",
        type: "boolean",
        question: "name-describes-image",
        answer: true,
      },
    ],
    c81a: [
      {
        target: "//img",
        type: "boolean",
        question: "name-describes-image",
        answer: true,
      },
    ],
    "5d41": [
      {
        target: "//input",
        type: "boolean",
        question: "name-describes-image",
        answer: false,
      },
    ],
    "4f63": [
      {
        target: "//img",
        type: "boolean",
        question: "name-describes-image",
        answer: false,
      },
    ],
  },
  skip: [
    // Alfa doesn't look into sources set out of the <img> element (sibling <source>, <scrset>)
    "3fcd49",
  ],
});

// R40 is Siteimprove rule

test.skip(fixture, Rules.get("R41"), "b20e66", {
  answers: {
    "5fa9": [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false,
      },
    ],
    d7ca: [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false,
      },
    ],
    "0b97": [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false,
      },
    ],
    c419: [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true,
      },
    ],
    bdd1: [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false,
      },
    ],
    "9120": [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true,
      },
    ],
    "7e0f": [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false,
      },
    ],
    "71e3": [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true,
      },
    ],
    "62c5": [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true,
      },
    ],
    "4aab": [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true,
      },
    ],
    "4632": [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true,
      },
    ],
    "457e": [
      {
        target: "//span",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false,
      },
    ],
    "1065": [
      {
        target: "//span",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true,
      },
    ],
  },
});

test(fixture, Rules.get("R42"), "ff89c9", {
  skip: [
    // Role from ARIA DPUB which the ACT rule explicitly ignore, but Alfa doesn't
    // @see https://github.com/act-rules/act-rules.github.io/pull/1473
    "64371f",
  ],
});

test(fixture, Rules.get("R43"), "7d6734");

test(fixture, Rules.get("R44"), "b33eff");

test(fixture, Rules.get("R45"), "a25f45");

test(fixture, Rules.get("R46"), "d0f69e", {
  skip: [
    // Alfa does not yet consider ARIA grids
    "d2fa5e",
  ],
});

test(fixture, Rules.get("R47"), "b4f0c3");

// R48 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R48"), "aaa1bf");

// R49 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R49"), "4c31df");

// R50 has questions in applicability, review flow not currently handled
test.skip(fixture, Rules.get("R50"), "80f0bf");

// R51 is Siteimprove only

// R52 is Siteimprove only

// R53 is Siteimprove only

// R54 is Siteimprove only

// R55 is Siteimprove only

// R56 is Siteimprove only

// R57 is Siteimprove only

// R58 is not implemented yet

// R59 is Siteimprove only

// R60 is Siteimprove only

// R61 is Siteimprove only

// R62 is not implemented yet

test(fixture, Rules.get("R63"), "8fc3b6");

test(fixture, Rules.get("R64"), "ffd0e9", {
  skip: [
    // Alfa default to other step when finding an aria-labelledby with existing but empty IDref
    // @see https://github.com/Siteimprove/alfa/issues/389
    "37e8ba",
    "ae7bea",
  ],
});

// R65 is not implemented yet

// R66 is not implemented yet

// R67 is Siteimprove only

test(fixture, Rules.get("R68"), "bc4a75", {
  skip: [
    // https://github.com/Siteimprove/alfa/pull/418
    "10d9a0",
    // Investigate
    "519aae",
  ],
});

test(fixture, Rules.get("R69"), "afw4f7", {
  skip: [
    // Alfa does not yet account for `text-shadow`
    "3805f1",

    // Alfa intentionally diverges on these cases
    // -> Alfa assumes that non-human language text is marked as presentational
    "2f71bb",

    // Alfa does not yet ignore disabled widget labels
    "78bb66",
    "448c66",

    // Alfa does not yet disregard impossible foreground/background combinations
    "55f4c4",
  ],
  manual: ["599d91", "455f4c"],
});

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

// R81 has questions in expectation, review flow not currently handled
test.skip(fixture, Rules.get("R81"), "fd3a94");

// R82 always has questions in expectation, review flow not currently handled
test.skip(fixture, Rules.get("R82"), "36b590");

test(fixture, Rules.get("R83"), "59br37", {
  skip: [
    // Alfa doesn't check the media query yet
    "c0dbe9",

    // Investigate
    "dc1edd",
    "ff1278",
  ],
});

test(fixture, Rules.get("R84"), "0ssw9k", {
  skip: [
    // Alfa does not yet consider empty elements invisible
    "363aef",

    // Alfa intentionally diverges on these cases
    // -> Alfa does not consider the exact layout when determining scrollability
    "86c515",
  ],
});

// R85 is Siteimprove only

test(fixture, Rules.get("R86"), "46ca7f");
