#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "_site");

// Keep this deliberately narrow: a typo must never turn a build cleanup into a
// recursive delete outside Eleventy's generated output directory.
if (path.dirname(outputDir) !== projectRoot || path.basename(outputDir) !== "_site") {
  throw new Error(`Refusing to clean unexpected output directory: ${outputDir}`);
}

fs.rmSync(outputDir, { recursive: true, force: true });
