# Comparing Alfa with ACT-Rules and WAI test cases

[Alfa](https://github.com/Siteimprove/alfa) is an automated accessibility checker developed by [Siteimprove](https://www.siteimprove.com/).

This repository runs Alfa against the official test cases from ACT Rules and WCAG 2 test rules.

Neither Alfa nor Siteimprove are endorsed by the [W3C](https://www.w3.org/), the [Web Accessibility Initiative](https://www.w3.org/WAI/) or the ACT rules Community group.

See a summary of the implementations reports:

- for [Alfa fully automated](./reports/summary-automated.md);
- for [Alfa semi-automated](./reports/summary-assisted.md).

## Installation

```shell
$ yarn install
$ yarn build
```

Installing Alfa packages need authentication to the Github repository for the `@siteimprove` scope.

## Usage

### Update test cases

To download the latest version of the test cases, build the project then:

```shell
$ yarn fixtures
```

To download the old test cases, use instead

```shell
$ yarn fixtures old
```

### Generate reports

To run Alfa against the test cases:

```shell
$ yarn test
```

This generates a report for both the automated and assisted implementations. Committing the report and pushing it upstream will update the implementation summary on the corresponding website.

To run test for a single implementation (often useful for debugging), use:

```shell
$ yarn [testAssisted | testAutomated]
```

Using `yarn [strictAssisted | strictAutomated]` instead will fail the tests (and generate errors) for benign mismatches (e.g. "Passed" vs "Inapplicable"). This can be useful for investigating and marking these correctly…

### Generate summaries

Once the reports have been generated, a summary of the implementation can be generated with

```shell
$ yarn summary
```

The summaries are shown at:

- for [Alfa fully automated](./reports/summary-automated.md);
- For [Alfa semi-automated](./reports/summary-assisted.md).

These summaries are mostly the same than the implementation report hosted on [WAI ACT rules implementation reports](https://www.w3.org/WAI/standards-guidelines/act/implementations/) but contain a bit more details, especially for missing stuff.

## Old test cases

In order to test the old test cases (hosted as a Github page), use

```shell
$ yarn ava "**/old*" [-- --strict]
```

this is mostly deprecated now and only the new test cases should matter.
