import ava, { TestInterface } from "ava";
import { Rules } from "@siteimprove/alfa-rules";
import { Context } from "./helpers/context";
import { fixture } from "./helpers/fixture";
import { manifest } from "./helpers/manifest";

const test = ava as TestInterface<Context>;

test.before("Initialise context", t => {
  t.context = { outcomes: [] };
});

test.after("Write manifest", t => {
  manifest(t.context, "test/manifest.json");
});

test(fixture, Rules.get("R1"), "2779a5");

test(fixture, Rules.get("R2"), "23a2a8", {
  skip: [
    // Alfa intentionally diverges on these cases
    // -> Presentational <img> elements are not applicable
    "cf095f",
    "383c36",
    "329274"
  ]
});

test(fixture, Rules.get("R3"), "3ea0c8");

test(fixture, Rules.get("R4"), "b5c3f8", {
  skip: [
    // Open issue, should be HTML and not XML
    "936156"
  ]
});

test(fixture, Rules.get("R5"), "bf051a", {
  skip: [
    // https://github.com/act-rules/act-rules.github.io/pull/934
    "373a"
  ]
});

test(fixture, Rules.get("R6"), "5b7ae0");

test(fixture, Rules.get("R7"), "de46e4");

test(fixture, Rules.get("R8"), "e086e5");

test(fixture, Rules.get("R9"), "bc659a");

test(fixture, Rules.get("R10"), "73f2c2", {
  skip: [
    // Open issue, has widget role and so is applicable
    "1e955a",

    // Alfa does not yet consider off-screened elements as hidden
    "cd5127"
  ]
});

test(fixture, Rules.get("R11"), "c487ae");

test(fixture, Rules.get("R12"), "97a4e1", {
  skip: [
    // Open issue, summary is not button per https://w3c.github.io/html-aam/#el-summary
    "25bc5e"
  ]
});

test(fixture, Rules.get("R13"), "cae760", {
  skip: [
    // https://github.com/act-rules/act-rules.github.io/issues/1170
    "d4947f"
  ]
});

test.skip(fixture, Rules.get("R14"), "2ee8b8", {
  skip: [
    // https://github.com/act-rules/act-rules.github.io/pull/452
    "87c5"
  ],
  answers: {
    "0643": [
      {
        target: "//div",
        type: "boolean",
        question: "is-human-language",
        answer: true
      }
    ],
    "924a": [
      {
        target: "//button",
        type: "boolean",
        question: "is-human-language",
        answer: true
      }
    ],
    "87c5": [
      {
        target: "//button",
        type: "boolean",
        question: "is-human-language",
        answer: false
      }
    ]
  }
});

test.skip(fixture, Rules.get("R15"), "4b1c6c", {
  answers: {
    f589: [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false
      }
    ],
    "9759": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ],
    "49f6": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ],
    "422e": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ],
    "2bf0": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ],
    "2750": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ],
    "175f": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false
      }
    ],
    "13c2": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false
      }
    ]
  }
});

test(fixture, Rules.get("R16"), "4e8ab6", {
  skip: [
    // Open issue, does not need to be in accessibility tree
    "7bda65",

    // Alfa intentionally diverges on these cases
    // -> R16 is also applicable to native elements with implicit semantics
    "232ffb",
    "cc955b",
    // -> `combobox` only requires `aria-controls` when expanded
    "2940fd",
    "e6b6fc"
  ]
});

test(fixture, Rules.get("R17"), "6cfa84");

test(fixture, Rules.get("R18"), "5c01ea");

test(fixture, Rules.get("R19"), "6a7281", {
  skip: [
    // Alfa does not yet check ID and ID reference attributes
    "0a0ff1"
  ]
});

test(fixture, Rules.get("R20"), "5f99a7");

test(fixture, Rules.get("R21"), "674b10");

test(fixture, Rules.get("R28"), "59796f");

test.skip(fixture, Rules.get("R39"), "9eb3f6", {
  answers: {
    d6c3: [
      {
        target: "//img",
        type: "boolean",
        question: "name-describes-image",
        answer: true
      }
    ],
    c81a: [
      {
        target: "//img",
        type: "boolean",
        question: "name-describes-image",
        answer: true
      }
    ],
    "5d41": [
      {
        target: "//input",
        type: "boolean",
        question: "name-describes-image",
        answer: false
      }
    ],
    "4f63": [
      {
        target: "//img",
        type: "boolean",
        question: "name-describes-image",
        answer: false
      }
    ]
  }
});

test.skip(fixture, Rules.get("R41"), "b20e66", {
  answers: {
    "5fa9": [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false
      }
    ],
    d7ca: [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false
      }
    ],
    "0b97": [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false
      }
    ],
    c419: [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ],
    bdd1: [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false
      }
    ],
    "9120": [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ],
    "7e0f": [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false
      }
    ],
    "71e3": [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ],
    "62c5": [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ],
    "4aab": [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ],
    "4632": [
      {
        target: "//a",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ],
    "457e": [
      {
        target: "//span",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false
      }
    ],
    "1065": [
      {
        target: "//span",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ]
  }
});

test(fixture, Rules.get("R42"), "ff89c9", {
  skip: [
    // https://github.com/Siteimprove/alfa/issues/173
    "fadda3",
    "46205c",

    // Alfa intentionally diverges on these cases
    "997565",
    "5a9eba"
  ]
});

test(fixture, Rules.get("R43"), "7d6734", {
  skip: [
    // Need to investigate these cases
    "f9ea1e",
    "33c47e"
  ]
});

test(fixture, Rules.get("R44"), "b33eff");

test(fixture, Rules.get("R47"), "b4f0c3");

test(fixture, Rules.get("R64"), "ffd0e9");

// test.only(fixture, Rules.get("R69"), "afw4f7", {
//   skip: [
//     // https://github.com/act-rules/act-rules.github.io/issues/1168
//     "a7c03f",

//     // Alfa does not yet account for `text-shadow`
//     "3805f1",

//     // Alfa does not yet consider off-screened elements as hidden
//     "97803e",

//     // Alfa intentionally diverges on these cases
//     // -> Alfa assumes that non-human language text is marked as presentational
//     "2f71bb"
//   ]
// });
