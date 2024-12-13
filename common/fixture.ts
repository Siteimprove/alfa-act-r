import { Array } from "@siteimprove/alfa-array";
import { Node } from "@siteimprove/alfa-dom";
import { Option } from "@siteimprove/alfa-option";
import { Question } from "@siteimprove/alfa-rules";
import { Page } from "@siteimprove/alfa-web";

/**
 * The structure of Fixture we persist,
 * Fixtures are scrapped from the ACT-R or WAI test cases and persisted.
 * Fixtures are then loaded into Alfa for proper testing.
 *
 * Some Fixtures are ignored by Alfa and recorded as such.
 */
export namespace Fixture {
  export type Outcome = "inapplicable" | "passed" | "failed" | "cantTell";

  /**
   * An actual test fixture
   */
  interface Test {
    type: "test" | "redirect";
    id: string;
    outcome: Outcome;
    page: Page.JSON;
  }

  /**
   * An ignored XML fixture
   */
  interface Ignored {
    type: "xml";
    id: string;
    url: string;
    data: string;
  }

  export type Fixture = Test | Ignored;

  /**
   * Options to pass with each rule.
   */
  export interface Options {
    // Alfa is known to not match the implementation mapping
    skip?: Array<string>;
    // The test is known to need an oracle
    manual?: Array<string>;
    allManual?: boolean;
    // Alfa is known to have a Inapplicable/Passed discrepancy with ACT-R
    lax?: Array<string>;
    // Answers for the oracle, this assume that each test case only asks
    // each question once (so, notably, only has one target).
    // For "node" answers, we provide a way to find the node in the page.
    answers?: {
      [fixture: string]: Partial<{
        [URI in keyof Question.Metadata]: Question.Metadata[URI][0] extends "node"
          ? (page: Page) => Option<Node>
          : Question.Metadata[URI][0] extends "node[]"
          ? // We could just use a Page => Array<Node>, but tests are much
            // easier to write that way…
            Array<(page: Page) => Option<Node>>
          : Question.Metadata[URI][1];
      }>;
    };
    answersWithPath?: {
      [fixture: string]: Partial<{
        [URI in keyof Question.Metadata]: {
          [subjectPath: string]: Question.Metadata[URI][0] extends "node"
            ? (page: Page) => Option<Node>
            : Question.Metadata[URI][0] extends "node[]"
            ? // We could just use a Page => Array<Node>, but tests are much
              // easier to write that way…
              Array<(page: Page) => Option<Node>>
            : Question.Metadata[URI][1];
        };
      }>;
    };
  }
}
