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
    type: "test";
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

  // TODO for semi-automated cases.
  interface FixtureAnswer {
    // target: string;
    // type: "boolean";
    // question: string;
    // answer: boolean;
  }

  /**
   * Options to pass with each rule.
   */
  export interface Options {
    // Alfa is known to not match the implementation mapping
    skip?: Array<string>;
    // The test is known to need an oracle
    manual?: Array<string>;
    // Alfa is known to have a Inapplicable/Passed discrepancy with ACT-R
    lax?: Array<string>;
    answers?: {
      [fixture: string]: Array<FixtureAnswer>;
    };
  }
}
