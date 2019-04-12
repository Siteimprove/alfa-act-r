import test from "ava";
import { Rules } from "@siteimprove/alfa-wcag";
import { fixture } from "./helpers/fixture";

test(fixture, Rules.SIA_R1, "sc2-4-2-page-has-title");

test(fixture, Rules.SIA_R2, "sc1-1-1-image-has-name", {
  skip: [
    "f167" // https://github.com/auto-wcag/auto-wcag/issues/446
  ]
});

test(fixture, Rules.SIA_R3, "sc4-1-1-unique-id");

test(fixture, Rules.SIA_R4, "sc3-1-1-html-has-lang");

test(fixture, Rules.SIA_R5, "sc3-1-1-html-lang-valid");

test(fixture, Rules.SIA_R6, "sc3-1-1-html-xml-lang-match");

test(fixture, Rules.SIA_R7, "sc3-1-2-lang-valid");

test(fixture, Rules.SIA_R8, "sc4-1-2-form-field-has-name");

test(fixture, Rules.SIA_R9, "sc2-2-1+sc2-2-4-meta-refresh");

test(fixture, Rules.SIA_R10, "sc1-3-5-autocomplete-valid");

test(fixture, Rules.SIA_R11, "sc2-4-4+2-4-9+4-1-2-link-has-name", {
  skip: [
    "178e" // https://github.com/auto-wcag/auto-wcag/issues/473
  ]
});

test(fixture, Rules.SIA_R12, "sc4-1-2-button-has-name");

test(fixture, Rules.SIA_R13, "sc4-1-2-iframe-has-name");

test(fixture, Rules.SIA_R14, "sc2-5-3-label-content-name-mismatch");

test(fixture, Rules.SIA_R16, "sc4-1-2-role-has-required-states-and-properties");

test(fixture, Rules.SIA_R17, "sc1-3-1-aria-hidden-focus");

test(fixture, Rules.SIA_R18, "sc4-1-2-aria-state-or-property-allowed", {
  skip: [
    "850b" // https://github.com/auto-wcag/auto-wcag/issues/475
  ]
});

test(fixture, Rules.SIA_R19, "sc4-1-2-aria-state-or-property-has-valid-value");

test(fixture, Rules.SIA_R20, "sc4-1-2-aria-attr-valid");

test(fixture, Rules.SIA_R21, "sc4-1-2-role-attribute-has-valid-value", {
  skip: [
    "2a72" // https://github.com/auto-wcag/auto-wcag/issues/474
  ]
});

test(fixture, Rules.SIA_R28, "image-button-has-name");
