import { Hashable } from "@siteimprove/alfa-hash";

import * as path from "path";

import ava, { TestFn } from "ava";

import { Question, Rules } from "@siteimprove/alfa-rules";
import { Page } from "@siteimprove/alfa-web";

import { Context } from "./helpers/context";
import { fixture as factory } from "./helpers/fixture";
import { report } from "./helpers/report";

const fixture = factory("old_fixtures");
const test = ava as TestFn<Context<Page, Hashable, Question.Metadata, unknown>>;

test.before("Initialise context", (t) => {
  t.context = { outcomes: [] };
});

test.after("Write report", (t) => {
  report(
    t.context,
    path.join(__dirname, "..", "reports", "alfa-report-old-test-cases.json")
  );
});

test("2779a5", (t) => fixture(t, Rules.get("R1")));

test("23a2a8", (t) =>
  fixture(t, Rules.get("R2"), {
    lax: [
      // Alfa intentionally ignores <img> elements that do not have a role of img
      // in order to ignore presentational images.
      "5c5409",
      "3e791a",
      "3986eb",
      "01839a",
    ],
  }));

test("3ea0c8", (t) => fixture(t, Rules.get("R3")));

test("b5c3f8", (t) =>
  fixture(t, Rules.get("R4"), {
    skip: [
      // Open issue, should be HTML and not XML
      "936156",
    ],
  }));

test("bf051a", (t) => fixture(t, Rules.get("R5")));

test("5b7ae0", (t) => fixture(t, Rules.get("R6")));

test("de46e4", (t) => fixture(t, Rules.get("R7")));

test("e086e5", (t) => fixture(t, Rules.get("R8")));

test("bc659a", (t) =>
  fixture(t, Rules.get("R9"), {
    lax: [
      // These cases can't currently be tested due to instant redirects.
      "0ccdca",
      "d15d71",
    ],
  }));

test("73f2c2", (t) => fixture(t, Rules.get("R10")));

test("c487ae", (t) => fixture(t, Rules.get("R11")));

test("97a4e1", (t) => fixture(t, Rules.get("R12")));

test("cae760", (t) =>
  fixture(t, Rules.get("R13"), {
    skip: [
      // Alfa consider all iframe, not restricting to sequential tab navigation
      // and isTabbable actually skip iframe as they redirect focus.
      "4a1aa5",
    ],
  }));

test("2ee8b8", (t) =>
  fixture(t, Rules.get("R14"), {
    skip: [
      // The text 'X' is considered as non-text content by the rule, not by Alfa
      "a10b38",
      // the text is rendered as icon (non-text) due to the Material Icons fonts
      // but Alfa ignores it
      "f484cc",
    ],
  }));

test("4b1c6c", (t) =>
  fixture(t, Rules.get("R15"), {
    manual: [
      "2117bf",
      "451ee6",
      "60a5c4",
      "6d2e33",
      "71c7ed",
      "b327b8",
      "d992b2",
      "dcea4b",
      "dcfbcd",
    ],
  }));

test("4e8ab6", (t) =>
  fixture(t, Rules.get("R16"), {
    skip: [
      // `combobox` only requires `aria-expanded` in the latest draft of ARIA.
      "a37a51",
      "cbd158",
    ],
  }));

test("6cfa84", (t) =>
  fixture(t, Rules.get("R17"), {
    skip: [
      // Alfa does not consider whether an element redirects focus or not
      "294bef",
    ],
  }));

test("5c01ea", (t) => fixture(t, Rules.get("R18")));

test("6a7281", (t) =>
  fixture(t, Rules.get("R19"), {
    skip: [
      // Alfa does not yet check ID and ID reference attributes
      "0a0ff1",
    ],
  }));

test("5f99a7", (t) => fixture(t, Rules.get("R20")));

test("674b10", (t) =>
  fixture(t, Rules.get("R21"), {
    skip: [
      // Alfa requires that all roles be valid.
      "b4705a",
    ],
  }));

// R22 has questions in applicability, review flow not currently handled
test.skip("f51b46", (t) => fixture(t, Rules.get("R22")));

// R23 has questions in applicability, review flow not currently handled
test.skip("2eb176", (t) => fixture(t, Rules.get("R23")));

// R24 has questions in applicability, review flow not currently handled
test.skip("1a02b0", (t) => fixture(t, Rules.get("R24")));

// R25 has questions in applicability, review flow not currently handled
test.skip("1ea59c", (t) => fixture(t, Rules.get("R25")));

// R26 has questions in applicability, review flow not currently handled
test.skip("fd26cf", (t) => fixture(t, Rules.get("R26")));

// R27 has questions in applicability, review flow not currently handled
test.skip("eac66b", (t) => fixture(t, Rules.get("R27")));

test("59796f", (t) => fixture(t, Rules.get("R28")));

// R29 has questions in applicability, review flow not currently handled
test.skip("afb423", (t) => fixture(t, Rules.get("R29")));

// R30 has questions in applicability, review flow not currently handled
test.skip("e7aa44", (t) => fixture(t, Rules.get("R30")));

// R31 has questions in applicability, review flow not currently handled
test.skip("ab4d13", (t) => fixture(t, Rules.get("R31")));

// R32 has questions in applicability, review flow not currently handled
test.skip("d7ba54", (t) => fixture(t, Rules.get("R32")));

// R33 has questions in applicability, review flow not currently handled
test.skip("ee13b5", (t) => fixture(t, Rules.get("R33")));

// R34 has been deprecated

// R35 has questions in applicability, review flow not currently handled
test.skip("c3232f", (t) => fixture(t, Rules.get("R35")));

// R36 has been deprecated

// R37 has questions in applicability, review flow not currently handled
test.skip("1ec09b", (t) => fixture(t, Rules.get("R37")));

// R38 has questions in applicability, review flow not currently handled
test.skip("c5a4ea", (t) => fixture(t, Rules.get("R38")));

// R39 always has questions in each expectation, review flow not currently handled
test.skip("9eb3f6", (t) =>
  fixture(t, Rules.get("R39"), {
    skip: [
      // Alfa doesn't look into sources set out of the <img> element (sibling <source>, <scrset>)
      "3fcd49",
    ],
  }));

// R40 is Siteimprove rule

test("b20e66", (t) =>
  fixture(t, Rules.get("R41"), {
    manual: [
      "159d2a",
      "17248e",
      "2115df",
      "39e44d",
      "3d43c8",
      "75dbc7",
      "ad30f3",
      "badef6",
      "c11dc7",
      "ce3767",
      "e61946",
      "ee8a59",
      "f3c9e8",
    ],
  }));

test("ff89c9", (t) =>
  fixture(t, Rules.get("R42"), {
    lax: [
      // Alfa does consider elements whose role is implicit or explicit=implicit
      "997565",
      "5a9eba",
    ],
  }));

test("7d6734", (t) => fixture(t, Rules.get("R43")));

test("b33eff", (t) => fixture(t, Rules.get("R44")));

test("a25f45", (t) => fixture(t, Rules.get("R45")));

test("d0f69e", (t) =>
  fixture(t, Rules.get("R46"), {
    skip: [
      // Alfa does not yet consider ARIA grids
      "d2fa5e",
    ],
    lax: [
      // Alfa does not consider ARIA tables
      "30ecbb",
    ],
  }));

test("b4f0c3", (t) =>
  fixture(t, Rules.get("R47"), {
    lax: [
      // https://github.com/Siteimprove/sanshikan/issues/219
      // https://github.com/act-rules/act-rules.github.io/pull/1835
      "4b58ab",
      "deb43e",
    ],
  }));

// R48 has questions in applicability, review flow not currently handled
test.skip("aaa1bf", (t) => fixture(t, Rules.get("R48")));

// R49 has questions in applicability, review flow not currently handled
test.skip("4c31df", (t) => fixture(t, Rules.get("R49")));

// R50 has questions in applicability, review flow not currently handled
test.skip("80f0bf", (t) => fixture(t, Rules.get("R50")));

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
      // Alfa does not look at the MIME type of embedded content
      // https://github.com/Siteimprove/alfa/issues/522
      "e0af01",
    ],
  }));

test("ffd0e9", (t) => fixture(t, Rules.get("R64")));

test("oj04fd", (t) =>
  fixture(t, Rules.get("R65"), {
    manual: ["31b4ec", "32e6a0"],
  }));

test("09o5cg", (t) =>
  fixture(t, Rules.get("R66"), {
    manual: ["90eef0", "bbaefc", "357b41"],
    skip: [
      // Alfa assumes that non-human language text is marked as presentational
      "25f0d3",
      // Alfa does not yet disregard impossible foreground/background combinations
      "0627ba",
    ],
  }));

// R67 is Siteimprove only

test("bc4a75", (t) =>
  fixture(t, Rules.get("R68"), {
    skip: [
      // Alfa accepts children that are not "required owned element" as this
      // is a common case and unclear what ARIA really mean
      // https://github.com/act-rules/act-rules.github.io/issues/1426
      "77c1ef",
    ],
    lax: [
      // Alfa intentionally applies to elements whose role is implicit
      "8ff0b1",
    ],
  }));

test("afw4f7", (t) =>
  fixture(t, Rules.get("R69"), {
    skip: [
      // Alfa intentionally diverges on these cases
      // -> Alfa assumes that non-human language text is marked as presentational
      "2f71bb",

      // Alfa does not yet disregard impossible foreground/background combinations
      "55f4c4",
    ],
    manual: ["3805f1", "455f4c", "599d91", "97803e"],
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

// R81 has questions in expectation, review flow not currently handled
test("fd3a94", (t) =>
  fixture(t, Rules.get("R81"), {
    lax: [
      // https://github.com/Siteimprove/alfa/issues/767
      "8bfeb5",
    ],
    manual: [
      "062e21",
      "11abbc",
      "2814b9",
      "2b877f",
      "2e0157",
      "3cece5",
      "8aa46a",
      "a3c812",
      "ae6e0e",
      "d9b934",
      "e45c4f",
      "ff6a1b",
    ],
  }));

// R82 always has questions in expectation, review flow not currently handled
// R82 is experimental
// test.skip("36b590", (t) => fixture(t, Rules.get("R82")));

test("59br37", (t) =>
  fixture(t, Rules.get("R83"), {
    skip: [
      // Alfa assumes that the text scale can be configured by the user, which
      // would cause text clipping for this case.
      "74d207",

      // Alfa assumes that inline heights are controlled via JavaScript.
      "202900",
      "765e61",
      "f4c86d",

      // Alfa does not test the cases at the specified media query.
      "c0dbe9",

      // Alfa does not consider the exact layout of the page.
      // https://github.com/Siteimprove/alfa/issues/183
      "dc1edd",
    ],
  }));

test("0ssw9k", (t) =>
  fixture(t, Rules.get("R84"), {
    skip: [
      // Alfa intentionally diverges on these cases
      // -> Alfa does not consider the exact layout when determining scrollability
      // https://github.com/Siteimprove/alfa/issues/183
      "a7b9ec",
      // Alfa assumes that any element with dimensions is visible, without looking
      // at content.
      "363aef",
    ],
    lax: [
      // Alfa does not consider the exact layout when determining scrollability
      // so elements that are big enough are incorrectly deemed scrollable
      // https://github.com/Siteimprove/alfa/issues/183
      "30bc26",
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

test("24afc2", (t) =>
  fixture(t, Rules.get("R91"), {
    skip: [
      // Alfa doesn't consider top: -999em as invisible
      "ebc223",
    ],
    lax: [
      // Alfa has adopted newer version of rule, targeting the text nodes
      "0ebc06",
      "246908",
      "6a5454",
      "e71c86",
    ],
  }));

test("9e45ec", (t) =>
  fixture(t, Rules.get("R92"), {
    skip: [
      // Alfa doesn't consider top: -999em as invisible
      "221c82",
    ],
    lax: [
      // Alfa has adopted newer version of rule, targeting the text nodes
      "2375f3",
      "830e93",
      "b7abd6",
      "c6fe3c",
    ],
  }));

test("78fd32", (t) =>
  fixture(t, Rules.get("R93"), {
    skip: [
      // Alfa does not consider `top: -999em` as offscreen.
      "6df14f",
      // Alfa does not have a layout system and does not detect that the text
      // is in a wide scrolling element; instead it considers that any element
      // with a role of paragraph is a block of text.
      "2e016f",
    ],
    lax: [
      // Alfa has adopted newer version of rule, targeting the text nodes
      "1c518b",
      "328a55",
      "69271b",
      "fa1c3f",
    ],
  }));

test("m6b1q3", (t) => fixture(t, Rules.get("R94")));

test("akn7bn", (t) =>
  fixture(t, Rules.get("R95"), {
    skip: [
      // The 1×1 iframe is visible, its content isn't.
      // Alfa does consider the descendant of visible 1×1 elements as visible.
      "fab3ad",
    ],
  }));

// Not merged upstream
test("bisz58", (t) =>
  fixture(t, Rules.get("R96"), {
    lax: [
      // These cases can't currently be tested due to instant redirects.
      "17033b",
      "f52fc0",
    ],
  }));

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

// R109 always has questions in expectation, review flow not currently handled
// R109 is experimental
// test.skip("ucwvc8", (t) => fixture(t, Rules.get("R109")));
