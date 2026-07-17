/**
 * Guard for `npm run test:site`: the mocha suite reads built pages from
 * _site/, so running it against a missing or empty output directory fails
 * with dozens of confusing ENOENT assertions. Fail fast with the actual
 * remedy instead. (Deliberately not a `pretest` build: `npm run build`
 * already ends by running the tests, so a build-in-pretest would recurse.)
 */
"use strict";

const fs = require("fs");
const path = require("path");

const marker = path.join(__dirname, "..", "_site", "index.html");

if (!fs.existsSync(marker)) {
  console.error(
    "test:site reads the production build from _site/, which is missing.\n" +
      "Run `npm run build` first (it rebuilds _site/ and then runs the tests)."
  );
  process.exit(1);
}
