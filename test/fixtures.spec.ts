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
    "b53f" // https://github.com/act-rules/act-rules.github.io/issues/446
  ]
});

test(fixture, Rules.SIA_R3, "3ea0c8");

test(fixture, Rules.SIA_R4, "b5c3f8");

test(fixture, Rules.SIA_R5, "bf051a", {
  skip: [
    "490c" // https://github.com/act-rules/act-rules.github.io/pull/477
  ]
});

test(fixture, Rules.SIA_R6, "5b7ae0");

test(fixture, Rules.SIA_R7, "de46e4", {
  skip: [
    "a4ed" // https://github.com/act-rules/act-rules.github.io/pull/477
  ]
});

test(fixture, Rules.SIA_R8, "e086e5");

test(fixture, Rules.SIA_R9, "bc659a");

test(fixture, Rules.SIA_R10, "73f2c2");

test(fixture, Rules.SIA_R11, "c487ae", {
  skip: [
    "f306" // https://github.com/act-rules/act-rules.github.io/issues/473
  ]
});

test(fixture, Rules.SIA_R12, "97a4e1");

test(fixture, Rules.SIA_R13, "cae760");

test(fixture, Rules.SIA_R14, "2ee8b8", {
  skip: [
    "2ada" // https://github.com/act-rules/act-rules.github.io/pull/452
  ]
});

test(fixture, Rules.SIA_R16, "4e8ab6");

test(fixture, Rules.SIA_R17, "6cfa84");

test(fixture, Rules.SIA_R18, "5c01ea", {
  skip: [
    "9dff" // https://github.com/act-rules/act-rules.github.io/issues/475
  ]
});

test(fixture, Rules.SIA_R19, "6a7281", {
  skip: [
    "b9fd" // https://github.com/act-rules/act-rules.github.io/pull/464
  ]
});

test(fixture, Rules.SIA_R20, "5f99a7");

test(fixture, Rules.SIA_R21, "674b10", {
  skip: [
    "799c", // https://github.com/act-rules/act-rules.github.io/issues/474
    "1c07" // https://github.com/act-rules/act-rules.github.io/pull/430
  ]
});

test(fixture, Rules.SIA_R28, "59796f");
