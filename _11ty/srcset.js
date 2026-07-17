/**
 * Copyright (c) 2020 Google Inc
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const { promisify } = require("util");
const fsSync = require("fs");
const exists = promisify(require("fs").exists);
const sharp = require("sharp");

/**
 * Generates sensible sizes for each image for use in a srcset.
 */

const defaultWidths = [1920, 1280, 640, 320];

const extension = {
  jpeg: "jpg",
  webp: "webp",
  avif: "avif",
};

const quality = {
  avif: 40,
  default: 60,
};
const resizeCache = new Map();

module.exports = async function srcset(filename, format, widths = defaultWidths) {
  if (
    !Array.isArray(widths) ||
    widths.length === 0 ||
    widths.some((width) => !Number.isInteger(width) || width <= 0)
  ) {
    throw new Error(
      "srcset widths must be a non-empty array of positive integers"
    );
  }
  const sourceUrl = filename.split(/[?#]/, 1)[0];
  const names = await Promise.all(
    widths.map((w) => resize(sourceUrl, w, format))
  );
  return {
    srcset: names.map((n, i) => `${n} ${widths[i]}w`).join(", "),
    fallback: names[0],
  };
};

async function resize(filename, width, format) {
  const key = `${filename}\0${width}\0${format}`;
  if (!resizeCache.has(key)) {
    resizeCache.set(key, resizeOnce(filename, width, format));
  }
  return resizeCache.get(key);
}

async function resizeOnce(filename, width, format) {
  const out = sizedName(filename, width, format);
  // Read from the source tree when possible: the `_site/` copy is written by
  // passthrough copy concurrently with transforms and may be incomplete.
  const inputPath = sourceFilePath(filename);
  const outputPath = filePath(out);
  if (await exists(outputPath)) {
    return out;
  }
  await sharp(inputPath)
    .rotate() // Manifest rotation from metadata
    .resize(width)
    [format]({
      quality: quality[format] || quality.default,
      reductionEffort: 6,
    })
    .toFile(outputPath);

  return out;
}

function filePath(urlPath) {
  const pathWithoutQuery = urlPath.split(/[?#]/, 1)[0];
  try {
    return "_site" + decodeURIComponent(pathWithoutQuery);
  } catch (e) {
    throw new Error(`Invalid URL encoding in local image "${urlPath}"`);
  }
}

function sourceFilePath(urlPath) {
  const sitePath = filePath(urlPath);
  const sourcePath = sitePath.replace(/^_site/, ".");
  return fsSync.existsSync(sourcePath) ? sourcePath : sitePath;
}

function sizedName(filename, width, format) {
  const ext = extension[format];
  if (!ext) {
    throw new Error(`Unknown format ${format}`);
  }
  return filename.replace(/\.\w+$/, (_) => "-" + width + "w" + "." + ext);
}
