"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./es/side-effect.min.js");
} else {
  module.exports = require("./es/side-effect.js");
}
