const whitelist = require("./headers.json");

function filter(headers) {
  return headers.filter((header) => whitelist.includes(header.name));
}

exports.filter = filter;
