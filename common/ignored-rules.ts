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
  // Link is descriptive
  "aizyf1",
  // Device motion based changes to the content can be disabled
  "c249d5",
  // Attribute is not duplicated
  "e6952f",
  // Image not in the accessibility tree is decorative
  "e88epe",
  // Text content that changes automatically can be paused, stopped or hidden
  "efbfc7",
  // No keyboard shortcut uses only printable characters
  "ffbc54",
  // Image accessible name is descriptive
  "qt1vmo",
];
