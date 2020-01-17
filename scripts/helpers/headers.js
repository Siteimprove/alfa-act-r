const whitelist = require("./headers.json");

/**
 * @param {Iterable<[string, string]>} headers
 * @return {Iterable<[string, string]>}
 */
function filter(headers) {
  return [...headers].filter(([header]) => whitelist.includes(header));
}

exports.filter = filter;
