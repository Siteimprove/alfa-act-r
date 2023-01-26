import * as act from "@siteimprove/alfa-act";
import { Future } from "@siteimprove/alfa-future";
import { Hashable } from "@siteimprove/alfa-hash";
import { None, Option } from "@siteimprove/alfa-option";
import { Question } from "@siteimprove/alfa-rules";
import { Page } from "@siteimprove/alfa-web";
import { ExecutionContext } from "ava/entrypoints/main";
import { Context } from "./context";

function wrapper<ANSWER>(answer: ANSWER): Future<Option<ANSWER>> {
  return Future.now(Option.of(answer));
}

const dontKnow = Future.now(None);

export function oracle<I, T extends Hashable, S>(
  answers: Partial<{
    [URI in keyof Question.Metadata]: Question.Metadata[URI][1];
  }>,
  t: ExecutionContext<Context<Page, T, Question.Metadata, S>>,
  testId: string
): act.Oracle<I, T, Question.Metadata, S> {
  return (_, question) => {
    // Check if we do have an answer for this question.
    if (answers[question.uri] === undefined) {
      t.log(`${testId} is asking ${question.uri} for ${question.subject}`);
      return dontKnow;
    }

    // * We use a switch with no default case to ensure exhaustive matching at
    //   the type level. This also fails type checking if a Question.Type is
    //   not used by any question.
    // * We can't pre-compute `wrapper` or even `answers[question.uri]` because
    //   we first need to narrow by question type to ensure the answer has the
    //   expected type.
    // * Thanks to the initial test, we know that answers[question.uri] exists.
    switch (question.type) {
      case "boolean":
        return wrapper(answers[question.uri]!);

      case "node":
        return wrapper(answers[question.uri]!);

      case "node[]":
        return wrapper(answers[question.uri]!);

      case "color[]":
        return wrapper(answers[question.uri]!);

      case "string":
        return wrapper(answers[question.uri]!);

      case "string[]":
        return wrapper(answers[question.uri]!);
    }
  };
}
