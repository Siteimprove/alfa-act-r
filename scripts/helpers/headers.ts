const whitelist = require("./headers.json");

export function filter<T extends { name: string }>(
  headers: Array<T>
): Array<T> {
  return headers.filter((header) => whitelist.includes(header.name));
}
