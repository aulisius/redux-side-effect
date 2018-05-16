"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/side-effect.min.js");
} else {
  module.exports = require("./cjs/side-effect.js");
}
