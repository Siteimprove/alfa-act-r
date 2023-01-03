# Comparing Alfa with ACT-Rules and WAI test cases

[Alfa](https://github.com/Siteimprove/alfa) is an automated accessibility checker developed by [Siteimprove](https://www.siteimprove.com/). 

This repository runs Alfa against the official test cases from ACT Rules and WCAG 2 test rules.

Because the ACT-R Community Group is in the process of moving its website from self-hosted (`"old"`) to the WAI website (`"new"`), we currently track two sets of test cases. 

Neither Alfa nor Siteimprove are endorsed by the [W3C](https://www.w3.org/), the [Web Accessibility Initiative](https://www.w3.org/WAI/) or the ACT rules Community group.

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
$ yarn fixtures [old | new]
```

If non argument is provided, both will be downloaded.

### Generate report

To run Alfa against the test cases:

```shell
$ yarn test
```

This generates a report for the set of test cases. Committing the report and pushing it upstream will update the implementation report on the corresponding website.

Using `yarn strict` instead of `yarn test` will fail the tests (and generate errors) for benign mismatches (e.g. "Passed" vs "Inapplicable"). This can be useful for investigating and marking these correctly…

In order to test the old test cases, use

```shell
$ yarn ava "**/old*" [-- --strict]
```

this is mostly deprecated now and only the new test cases should matter.