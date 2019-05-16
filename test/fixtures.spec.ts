import ava, { TestInterface } from "ava";
import { Rules } from "@siteimprove/alfa-wcag";
import { Context } from "./helpers/context";
import { fixture } from "./helpers/fixture";
import { manifest } from "./helpers/manifest";

const test = ava as TestInterface<Context>;

test.before("Initialise context", t => {
  t.context = { results: [] };
});

test.after("Write manifest", t => {
  manifest(t.context, "test/manifest.json");
});

test(fixture, Rules.SIA_R1, "2779a5");

test(fixture, Rules.SIA_R2, "23a2a8", {
  skip: [
    "61f3" // https://github.com/act-rules/act-rules.github.io/issues/446
  ]
});

test(fixture, Rules.SIA_R3, "3ea0c8");

test(fixture, Rules.SIA_R4, "b5c3f8");

test(fixture, Rules.SIA_R5, "bf051a");

test(fixture, Rules.SIA_R6, "5b7ae0");

test(fixture, Rules.SIA_R7, "de46e4");

test(fixture, Rules.SIA_R8, "e086e5");

test(fixture, Rules.SIA_R9, "bc659a");

test(fixture, Rules.SIA_R10, "73f2c2");

test(fixture, Rules.SIA_R11, "c487ae");

test(fixture, Rules.SIA_R12, "97a4e1");

test(fixture, Rules.SIA_R13, "cae760");

test(fixture, Rules.SIA_R14, "2ee8b8", {
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
    ]
  }
});

test(fixture, Rules.SIA_R15, "4b1c6c", {
  answers: {
    "1b96": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false
      }
    ],
    "1fb0": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ],
    "2f4e": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false
      }
    ],
    "3e23": [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ],
    aa27: [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ],
    b25f: [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ],
    f98c: [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: false
      }
    ],
    fceb: [
      {
        target: "//iframe",
        type: "boolean",
        question: "embed-equivalent-resources",
        answer: true
      }
    ]
  }
});

test(fixture, Rules.SIA_R16, "4e8ab6");

test(fixture, Rules.SIA_R17, "6cfa84");

test(fixture, Rules.SIA_R18, "5c01ea");

test(fixture, Rules.SIA_R19, "6a7281", {
  skip: [
    "77b8" // https://github.com/act-rules/act-rules.github.io/pull/464
  ]
});

test(fixture, Rules.SIA_R20, "5f99a7");

test(fixture, Rules.SIA_R21, "674b10");

test(fixture, Rules.SIA_R28, "59796f");
