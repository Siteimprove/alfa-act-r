// const whitelist = require("./headers.json");
const whitelist = ["content-type"];

export function filterHeaders<T extends { name: string }>(
  headers: Array<T>,
): Array<T> {
  return headers.filter((header) => whitelist.includes(header.name));
}
