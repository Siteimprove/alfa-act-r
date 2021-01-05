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

test(fixture, Rules.get("R2"), "23a2a8", {
  lax: [
    // Alfa intentionally ignores <img> elements that do not have a role of img
    // in order to ignore presentational images.
    "5c5409",
    "3e791a",
    "3986eb",
    "01839a",
  ],
});

test(fixture, Rules.get("R3"), "3ea0c8");

test(fixture, Rules.get("R4"), "b5c3f8", {
  skip: [
    // Open issue, should be HTML and not XML
    "936156",
  ],
});

test(fixture, Rules.get("R5"), "bf051a");

test(fixture, Rules.get("R6"), "5b7ae0");

test(fixture, Rules.get("R7"), "de46e4", {
  skip: [
    // Alfa doesn't ignore fully invisible text
    // @see https://github.com/Siteimprove/alfa/issues/623
    "1cf916",
  ],
});

test(fixture, Rules.get("R8"), "e086e5");

test(fixture, Rules.get("R9"), "bc659a", {
  lax: [
    // Due to the nature of the examples, we do get a "304 Not Modified" response with empty body
    // when trying to fetch it (instant redirect…)
    // Thus, we can't really test it with this framework since our GET is going to be redirected every single time.
    "0ccdca",
    "da63d6",
  ],
});

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

test(fixture, Rules.get("R14"), "2ee8b8", {
  manual: ["4a03b2", "83f0a2", "99b880", "a10b38", "f484cc"],
});

test(fixture, Rules.get("R15"), "4b1c6c", {
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
});

test(fixture, Rules.get("R16"), "4e8ab6", {
  lax: [
    // Alfa voluntarily considers elements whose implicit and explicit roles are the same
    "cc955b",
  ],
});

test(fixture, Rules.get("R17"), "6cfa84");

test(fixture, Rules.get("R18"), "5c01ea");

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
    // https://github.com/act-rules/act-rules.github.io/issues/1457
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

// R39 always has questions in each expectation, review flow not currently handled
test.skip(fixture, Rules.get("R39"), "9eb3f6", {
  skip: [
    // Alfa doesn't look into sources set out of the <img> element (sibling <source>, <scrset>)
    "3fcd49",
  ],
});

// R40 is Siteimprove rule

test(fixture, Rules.get("R41"), "b20e66", {
  skip: [
    // Problem with using text element to give name in SVG? Investigate.
    "ad30f3",
  ],
  manual: [
    "159d2a",
    "17248e",
    "2115df",
    "39e44d",
    "3d43c8",
    "75dbc7",
    "badef6",
    "c11dc7",
    "ce3767",
    "e61946",
    "ee8a59",
    "f3c9e8",
  ],
  lax: [
    // Problem with using text element to give name in SVG? Investigate.
    "58adab",
    // Looks like there is a problem with links in iframes and shadow tree. Weird. Comeback after
    // https://github.com/Siteimprove/alfa/issues/420
    "b95036",
    "d1cc3c",
  ],
});

test(fixture, Rules.get("R42"), "ff89c9", {
  lax: [
    // Alfa does consider elements whose role is implicit or explicit=implicit
    "997565",
    "5a9eba",
  ],
});

test(fixture, Rules.get("R43"), "7d6734");

test(fixture, Rules.get("R44"), "b33eff");

test(fixture, Rules.get("R45"), "a25f45", {
  lax: [
    // Alfa does not consider content out of page as invisible
    // @see https://github.com/Siteimprove/alfa/issues/519
    "6a4d43",
  ],
});

test(fixture, Rules.get("R46"), "d0f69e", {
  skip: [
    // Alfa does not yet consider ARIA grids
    "d2fa5e",
  ],
  lax: [
    // Alfa does not consider ARIA tables
    "30ecbb",
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

test.skip(fixture, Rules.get("R62"), "be4d0c");

test(fixture, Rules.get("R63"), "8fc3b6", {
  lax: [
    // Alfa does not look at the MIME type of embedded content
    // https://github.com/Siteimprove/alfa/issues/522
    "e0af01",
  ],
});

test(fixture, Rules.get("R64"), "ffd0e9");

test(fixture, Rules.get("R65"), "oj04fd", {
  manual: ["31b4ec", "32e6a0"],
});

// R66 is not implemented yet

// R67 is Siteimprove only

test(fixture, Rules.get("R68"), "bc4a75", {
  skip: [
    // Investigate
    "519aae",
  ],
  lax: [
    // Alfa intentionally applies to elements whose role is implicit
    "8ff0b1",
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
  lax: [
    // Alfa does not consider off screen text as invisible
    // https://github.com/Siteimprove/alfa/issues/519
    "97803e",
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
test(fixture, Rules.get("R81"), "fd3a94", {
  skip: [
    // Problem with using text element to give name in SVG? Investigate.
    "a3c812",
  ],
  manual: [
    "062e21",
    "11abbc",
    "3cece5",
    "7ee3df",
    "84e058",
    "8aa46a",
    "ae6e0e",
    "d1d5bf",
    "d9b934",
    "e45c4f",
  ],
});

// R82 always has questions in expectation, review flow not currently handled
test.skip(fixture, Rules.get("R82"), "36b590");

test(fixture, Rules.get("R83"), "59br37", {
  skip: [
    // Alfa doesn't check the media query yet
    "c0dbe9",

    // Alfa doesn't see the innermost ancestor handling the overflow
    // @see https://github.com/Siteimprove/alfa/issues/622
    "ff1278",

    // Investigate
    "dc1edd",
  ],
});

test(fixture, Rules.get("R84"), "0ssw9k", {
  skip: [
    // Alfa intentionally diverges on these cases
    // -> Alfa does not consider the exact layout when determining scrollability
    // https://github.com/Siteimprove/alfa/issues/183
    "86c515",
  ],
  lax: [
    // Alfa does not consider the exact layout when determining scrollability
    // so elements that are big enough are incorrectly deemed scrollable
    // https://github.com/Siteimprove/alfa/issues/183
    "30bc26",
  ],
});

// R85 is Siteimprove only

test(fixture, Rules.get("R86"), "46ca7f");

// not merged upstream yet
test.skip(fixture, Rules.get("R87"), "8a213c");

// not implemented, not merged upstream yet
// test.skip(fixture, Rules.get("R88"), "nqzcj8");

// R89 not written yet

test(fixture, Rules.get("R90"), "307n5z");

test(fixture, Rules.get("R91"), "24afc2", {
  skip: [
    // Alfa doesn't consider top: -999em as invisible
    "ebc223",
  ],
});

test(fixture, Rules.get("R92"), "9e45ec", {
  skip: [
    // Alfa doesn't consider top: -999em as invisible
    "221c82",
  ],
});

test(fixture, Rules.get("R93"), "78fd32", {
  skip: [
    // Alfa doesn't consider top: -999em as invisible
    "716ddf",
  ],
});

test(fixture, Rules.get("R94"), "m6b1q3");
