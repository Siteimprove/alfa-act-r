import url from "node:url";
import path from "node:path";

import ava from "ava";
import type { TestFn } from "ava";

import { Hashable } from "@siteimprove/alfa-hash";
import { experimentalRules, Question, Rules } from "@siteimprove/alfa-rules";
import { Page } from "@siteimprove/alfa-web";

import type { Context } from "./helpers/context.js";
import { fixture as factory } from "./helpers/fixture.js";
import { report } from "./helpers/report.js";

const fixture = factory("fixtures");
const test = ava as TestFn<Context<Page, Hashable, Question.Metadata, unknown>>;

// TODO: This should be replaced with import.meta.dirname once we switch to Node 22
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.before("Initialise context", (t) => {
  t.context = { outcomes: [] };
});

test.after("Write report", (t) => {
  report(
    t.context,
    path.join(__dirname, "..", "reports", "alfa-automated-report.json"),
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
    manual: [
      "1e31a1",
      "3e4fb4",
      "4490a0",
      "4f46ed",
      "84c7a3",
      "8d7ac7",
      "d7c06c",
      "d7dce5",
      "e4f6fd",
    ],
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
test.skip("9eb3f6", (t) => fixture(t, Rules.get("R39")));

// R40 is Siteimprove rule

test("b20e66", (t) =>
  fixture(t, Rules.get("R41"), {
    manual: [
      "01b3fc",
      "1e15dd",
      "2cd6ce",
      "35dc57",
      "675f10",
      "7babd7",
      "812cd2",
      "8557f3",
      "918293",
      "9b6335",
      "a98dc5",
      "b52fce",
      "ee0f09",
    ],
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
      "a56128",
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
      // Alfa does not check the presence of an explicit role
      "6d6a37",
    ],
  }));

test("ffd0e9", (t) => fixture(t, Rules.get("R64")));

test("oj04fd", (t) =>
  fixture(t, Rules.get("R65"), {
    manual: ["1ee18e", "7ac2f2", "c80b3c", "f228e7"],
  }));

test("09o5cg", (t) =>
  fixture(t, Rules.get("R66"), {
    manual: ["2eeb7d", "f32863"],
    skip: [
      // Alfa assumes that non-human language text is marked as presentational
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
    lax: [
      // Alfa intentionally applies to elements whose role is implicit
      "d6a643",
    ],
  }));

test("afw4f7", (t) =>
  fixture(t, Rules.get("R69"), {
    skip: [
      // Alfa intentionally diverges on these cases
      // -> Alfa assumes that non-human language text is marked as presentational
      "12198b",
      "d477f6",

      // Alfa does not yet disregard impossible foreground/background combinations
      "92452d",
    ],
    manual: ["7004f1", "951c28", "9939c7", "e5c024"],
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
    manual: [
      "10c991",
      "1a4d92",
      "1c14f0",
      "2f044c",
      "55d8b9",
      "70f41b",
      "75e59a",
      "80824c",
      "8d6fa9",
      "c16600",
      "c35667",
      "ce860d",
      "e0ec0a",
      "e9979a",
      "fd8682",
    ],
    lax: [
      // Alfa does not consider `<div>` in the link context
      // https://github.com/Siteimprove/alfa/issues/767
      "3efafe",
    ],
    skip: [
      // ACT Rules example is incorrect
      // https://github.com/act-rules/act-rules.github.io/issues/2175
      "709a75",
    ],
  }));

// R82 always has questions in expectation, review flow not currently handled
test.skip("36b590", (t) => fixture(t, experimentalRules.R82));

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

      // Alfa does not consider the exact layout of the page.
      // https://github.com/Siteimprove/alfa/issues/183
      "26a642",
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
    manual: [
      "0dc883",
      "185b49",
      "58e65a",
      "722fd3",
      "cf6190",
      "d7c89f",
      "dcad97",
      "e32447",
      "eb42cf",
      "f522a6",
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
    manual: ["086645", "097c44", "4656d1", "7ef35f", "9f1a76", "cb36ba"],
  }));

test("b49b2e", (t) =>
  fixture(t, experimentalRules.R115, {
    manual: [
      "15c774",
      "2953e2",
      "36c0f7",
      "4f2e4c",
      "797a7b",
      "7a0738",
      "7bb445",
      "d39623",
      "ecc4ce",
      "fef97a",
    ],
  }));

test("2t702h", (t) => fixture(t, Rules.get("R116")));
