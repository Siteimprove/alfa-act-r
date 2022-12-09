"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = void 0;
const whitelist = require("./headers.json");
function filter(headers) {
    return headers.filter((header) => whitelist.includes(header.name));
}
exports.filter = filter;
//# sourceMappingURL=headers.js.map