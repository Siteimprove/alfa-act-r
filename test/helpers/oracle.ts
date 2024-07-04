import * as act from "@siteimprove/alfa-act";
import { Array } from "@siteimprove/alfa-array";
import { Node } from "@siteimprove/alfa-dom";
import { Future } from "@siteimprove/alfa-future";
import { Hashable } from "@siteimprove/alfa-hash";
import { None, Option } from "@siteimprove/alfa-option";
import { Group, Question } from "@siteimprove/alfa-rules";
import { Page } from "@siteimprove/alfa-web";
import type { ExecutionContext } from "ava";

import type { Context } from "./context.js";

function wrapper<ANSWER>(answer: ANSWER): Future<Option<ANSWER>> {
  return Future.now(Option.of(answer));
}

const dontKnow = Future.now(None);

export function oracle<I, T extends Hashable, S>(
  answers: Partial<{
    [URI in keyof Question.Metadata]: Question.Metadata[URI][0] extends "node"
      ? (page: Page) => Option<Node>
      : Question.Metadata[URI][0] extends "node[]"
      ? // We could just use a Page => Array<Node>, but tests are much
        // easier to write that way…
        Array<(page: Page) => Option<Node>>
      : Question.Metadata[URI][1];
  }>,
  t: ExecutionContext<Context<Page, T, Question.Metadata, S>>,
  url: string,
  used: Array<keyof Question.Metadata>,
  page: Page
): act.Oracle<I, T, Question.Metadata, S> {
  return (_, question) => {
    // Check if we do have an answer for this question.
    if (answers[question.uri] === undefined) {
      t.log(
        `${url} is asking ${question.uri} for ${subjectToString(
          question.subject
        )}`
      );
      return dontKnow;
    }

    used.push(question.uri);

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
        return wrapper(answers[question.uri]!(page));

      case "node[]":
        return wrapper(Array.collect(answers[question.uri]!, (fn) => fn(page)));

      case "color[]":
        return wrapper(answers[question.uri]!);

      case "string":
        return wrapper(answers[question.uri]!);
    }
  };
}

export function oracleWithPaths<I, T extends Hashable, S>(
  answers: Partial<{
    [URI in keyof Question.Metadata]: {
      [subjectPath: string]: Question.Metadata[URI][0] extends "node"
        ? (page: Page) => Option<Node>
        : Question.Metadata[URI][0] extends "node[]"
        ? // We could just use a Page => Array<Node>, but tests are much
          // easier to write that way…
          Array<(page: Page) => Option<Node>>
        : Question.Metadata[URI][1];
    };
  }>,
  t: ExecutionContext<Context<Page, T, Question.Metadata, S>>,
  url: string,
  used: Array<keyof Question.Metadata>,
  page: Page
): act.Oracle<I, T, Question.Metadata, S> {
  return (_, question) => {
    if (!Node.isNode(question.subject) && !Node.isNode(question.context)) {
      t.log(
        `${url} is asking ${question.uri} for ${subjectToString(
          question.subject
        )} which is not a node`
      );
      return dontKnow;
    }

    used.push(question.uri);

    // We prefer using subject path as it is normally more precise, but default
    // to context path otherwise.
    const path = Node.isNode(question.subject)
      ? question.subject.path()
      : // The assertion is guarded by the previous if
        (question.context as any as Node).path();

    // Check if we do have an answer for this question.
    if (answers[question.uri]?.[path] === undefined) {
      t.log(
        `${url} is asking ${question.uri} for ${subjectToString(
          question.subject
        )}`
      );
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
        return wrapper(answers[question.uri]![path]);

      case "node":
        return wrapper(answers[question.uri]![path](page));

      case "node[]":
        return wrapper(
          Array.collect(answers[question.uri]![path], (fn) => fn(page))
        );

      case "color[]":
        return wrapper(answers[question.uri]![path]);

      case "string":
        return wrapper(answers[question.uri]![path]);
    }
  };
}

function subjectToString(subject: unknown): string {
  if (Node.isNode(subject)) {
    return subject.path();
  }

  if (Group.isGroup(subject) && subject.size > 0) {
    const subjects = [...subject];
    if (Node.isNode(subjects[0])) {
      return `${(subjects as Array<Node>).map((node) => node.path())}`;
    }
  }

  return "Unknown subject type";
}
