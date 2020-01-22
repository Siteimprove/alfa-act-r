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
    "6efce7" // https://github.com/act-rules/act-rules.github.io/issues/446
  ]
});

test(fixture, Rules.get("R3"), "3ea0c8");

test(fixture, Rules.get("R4"), "b5c3f8", {
  skip: [
    "936156" // Open issue, should be HTML
  ]
});

test(fixture, Rules.get("R5"), "bf051a", {
  skip: [
    "373a" // https://github.com/act-rules/act-rules.github.io/pull/934
  ]
});

test(fixture, Rules.get("R6"), "5b7ae0");

test(fixture, Rules.get("R7"), "de46e4");

test(fixture, Rules.get("R8"), "e086e5");

test(fixture, Rules.get("R9"), "bc659a");

test(fixture, Rules.get("R10"), "73f2c2", {
  skip: [
    "1e955a", // Open issue, has widget role and so is applicable
    "cd5127" // Alfa does not yet consider off-screened elements as hidden
  ]
});

test(fixture, Rules.get("R11"), "c487ae");

test(fixture, Rules.get("R12"), "97a4e1", {
  skip: [
    "25bc5e" // Open issue, summary is not button per https://w3c.github.io/html-aam/#el-summary
  ]
});

test(fixture, Rules.get("R13"), "cae760");

test.skip(fixture, Rules.get("R14"), "2ee8b8", {
  skip: [
    "87c5" // https://github.com/act-rules/act-rules.github.io/pull/452
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
    "7bda65", // Open issue, does not need to be in accessibility tree

    // Alfa intentionally diverges on these cases
    "232ffb",
    "cc955b"
  ]
});

test(fixture, Rules.get("R17"), "6cfa84");

test(fixture, Rules.get("R18"), "5c01ea");

test(fixture, Rules.get("R19"), "6a7281", {
  skip: [
    "0a0ff1" // Alfa does not yet check ID and ID reference attributes
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

test.skip(fixture, Rules.get("R44"), "b33eff");

test(fixture, Rules.get("R47"), "b4f0c3");
