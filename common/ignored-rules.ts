// Rules for which we do not have an implementation, do not plan to have one,
// and therefore do not need to fetch test cases.
export const ignoredRules = [
  // HTML images contain no text
  "0va7u6",
  // Link in context is descriptive
  "5effbb",
  // Device motion based changes to the content can also be created from the user interface
  "7677a9",
  // Focusable element has no keyboard trap
  "80af7b",
  // Content has alternative for visual reference
  "9bd38c",
  // Focusable element has no keyboard trap via standard navigation
  "a1b64e",
  // Link is descriptive
  "aizyf1",
  // Heading is descriptive
  // "b49b2e",
  // Device motion based changes to the content can be disabled
  "c249d5",
  // HTML page title is descriptive
  // "c4a8a4",
  // Form field label is descriptive
  "cc0f0a",
  // Attribute is not duplicated
  "e6952f",
  // Image not in the accessibility tree is decorative
  "e88epe",
  // Focusable element has no keyboard trap via non-standard navigation
  "ebe86a",
  // Text content that changes automatically can be paused, stopped or hidden
  "efbfc7",
  // No keyboard shortcut uses only printable characters
  "ffbc54",
  // HTML element language subtag matches language
  "off6ek",
  // Image accessible name is descriptive
  "qt1vmo",
];
