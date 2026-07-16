"use strict";

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");

// Source order is part of the cascade. Keep this list explicit so component
// files remain build-only inputs and the browser still receives one stylesheet.
const CSS_FILES = Object.freeze([
  "css/main.css",
  "css/components/lang-suggest.css",
  "css/components/header-nav.css",
]);

function readCssBundle() {
  return CSS_FILES.map((relativePath) =>
    fs.readFileSync(path.join(PROJECT_ROOT, relativePath), "utf8")
  ).join("\n");
}

module.exports = {
  CSS_FILES,
  readCssBundle,
};
