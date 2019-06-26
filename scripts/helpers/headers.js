const whitelist = require("./headers.json");

function filter(headers) {
  for (const header in headers) {
    if (!whitelist.includes(header)) {
      delete headers[header];
    }
  }
}

exports.filter = filter;
