# Comparing Alfa with ACT-Rules and WAI test cases

This repository runs Alfa against the official test cases from ACT Rules and WCAG 2 test rules.

Because the ACT-R Community Group is in the process of moving its website from self-hosted (`"act-r"`) to the W3C website (`"w3c"`), we currently track two sets of test cases. 

## Installation

```shell
$ yarn install
$ yarn build
```

Installing Alfa packages need authentication to the Github repository for the `@siteimprove` scope.

## Usage

### Update test cases

To download the latest version of the test cases:

```shell
$ yarn fixtures [act-r | w3c]
```

If non argument is provided, both will be downloaded.

### Generate report

To run Alfa against the test cases:

```shell
$ yarn test ["**/act-r*" | "**/w3c*"]
```

If no argument is provided, both will be tested. The selection is done automatically by `ava` (the testing library) using glob patterns… 

This generates a report for each set of test cases. Committing the report and pushing it upstream will update the implementation report on the corresponding website.

Using `yarn strict` instead of `yarn test` will fail the tests (and generate errors) for benign mismatches (e.g. "Passed" vs "Inapplicable"). This can be useful for investigating and marking these correctly…