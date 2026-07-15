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

const { JSDOM } = require("jsdom");
const { promisify } = require("util");
const sizeOf = promisify(require("image-size"));
const blurryPlaceholder = require("./blurry-placeholder");
const srcset = require("./srcset");
const path = require("path");
const fs = require("fs");
const { gif2mp4 } = require("./video-gif");
const AVATAR_WIDTH = 320;
const SMALL_AVATAR_WIDTH = 96;
const AVATAR_CLASSES = ["avatar", "avatar-small", "avatar-large"];

/**
 * Sets `width` and `height` on each image and generates responsive sources.
 * Content images receive a blurry placeholder and the full width set; small
 * avatars use a compact, fixed-width path to avoid oversized repeated markup.
 * Note, that the static `sizes` string would need to change for a different
 * blog layout.
 */

const processImage = async (img, outputPath) => {
  let src = img.getAttribute("src");
  if (!src) {
    throw new Error(`[img-dim] Image in ${outputPath} is missing a src attribute`);
  }
  // Only local file URLs can be inspected at build time. In particular, do not
  // mistake a data URI for a path under `_site/` (which previously caused an
  // ENAMETOOLONG warning while still allowing the build to pass).
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(src)) {
    return;
  }
  if (/^\.+\//.test(src)) {
    // resolve relative URL
    src =
      "/" +
      path.relative("./_site/", path.resolve(path.dirname(outputPath), src));
    if (path.sep == "\\") {
      src = src.replace(/\\/g, "/");
    }
  }
  let dimensions;
  try {
    dimensions = await sizeOf(localFilePath(src));
  } catch (e) {
    throw new Error(
      `[img-dim] Cannot read local image "${src}" referenced by ${outputPath}: ${e.message}`
    );
  }
  if (!img.getAttribute("width")) {
    img.setAttribute("width", dimensions.width);
    img.setAttribute("height", dimensions.height);
  }
  if (dimensions.type == "svg") {
    return;
  }
  if (dimensions.type == "gif") {
    // note: disable gif2mp4 by huli
    return
    const videoSrc = await gif2mp4(src);
    const video = img.ownerDocument.createElement(
      /AMP/i.test(img.tagName) ? "amp-video" : "video"
    );
    [...img.attributes].map(({ name, value }) => {
      video.setAttribute(name, value);
    });
    video.src = videoSrc;
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("loop", "");
    if (!video.getAttribute("aria-label")) {
      video.setAttribute("aria-label", img.getAttribute("alt"));
      video.removeAttribute("alt");
    }
    img.parentElement.replaceChild(video, img);
    return;
  }
  if (img.tagName == "IMG") {
    const isAvatar = AVATAR_CLASSES.some((className) =>
      img.classList.contains(className)
    );
    const isSmallAvatar = img.classList.contains("avatar-small");
    img.setAttribute("decoding", "async");
    img.setAttribute("loading", "lazy");
    if (!isAvatar) {
      img.setAttribute(
        "style",
        `background-size:cover;` +
          `background-image:url("${await blurryPlaceholder(localUrlPath(src))}")`
      );
    }
    const doc = img.ownerDocument;
    const picture = doc.createElement("picture");
    const webp = doc.createElement("source");
    webp.setAttribute("type", "image/webp");
    let fallback;
    let jpeg;
    if (isAvatar) {
      const avatarWidth = isSmallAvatar ? SMALL_AVATAR_WIDTH : AVATAR_WIDTH;
      const avatarSizes = isSmallAvatar ? "22px" : "64px";
      await setSrcset(webp, src, "webp", [avatarWidth], avatarSizes);
      fallback = (await srcset(src, "jpeg", [avatarWidth])).fallback;
    } else {
      await setSrcset(webp, src, "webp");
      jpeg = doc.createElement("source");
      fallback = await setSrcset(jpeg, src, "jpeg");
      jpeg.setAttribute("type", "image/jpeg");
    }
    picture.appendChild(webp);
    if (jpeg) picture.appendChild(jpeg);
    img.parentElement.replaceChild(picture, img);
    picture.appendChild(img);
    img.setAttribute("src", fallback);
  } else if (!img.getAttribute("srcset")) {
    const fallback = await setSrcset(img, src, "jpeg");
    img.setAttribute("src", fallback);
  }
};

/** Return a URL path without a query string or fragment. */
function localUrlPath(src) {
  return src.split(/[?#]/, 1)[0];
}

/**
 * Map a local URL path to a readable file. Prefer the source tree: the
 * `_site/` copy is produced by passthrough copy, which runs concurrently with
 * HTML transforms, so reading it can hit a half-written file.
 */
function localFilePath(src) {
  let decoded;
  try {
    decoded = decodeURIComponent(localUrlPath(src));
  } catch (e) {
    throw new Error(`[img-dim] Invalid URL encoding in local image "${src}"`);
  }
  const sourcePath = "." + (decoded.startsWith("/") ? decoded : "/" + decoded);
  if (fs.existsSync(sourcePath)) {
    assertExactCase(sourcePath, src);
    return sourcePath;
  }
  return "_site/" + decoded;
}

const dirEntriesCache = new Map();

/**
 * Fail on filename-case mismatches that a case-insensitive filesystem
 * (macOS/Windows) would silently tolerate but case-sensitive Linux CI
 * rejects with ENOENT.
 */
function assertExactCase(filePath, src) {
  let dir = ".";
  for (const segment of filePath.split("/").filter((s) => s && s !== ".")) {
    let entries = dirEntriesCache.get(dir);
    if (!entries) {
      entries = fs.readdirSync(dir);
      dirEntriesCache.set(dir, entries);
    }
    if (!entries.includes(segment)) {
      const actual = entries.find(
        (e) => e.toLowerCase() === segment.toLowerCase()
      );
      throw new Error(
        `[img-dim] Filename case mismatch for local image "${src}": ` +
          `referenced as "${segment}" but the file on disk is "${actual}". ` +
          `This passes on case-insensitive filesystems but fails on Linux CI.`
      );
    }
    dir += "/" + segment;
  }
}

async function setSrcset(img, src, format, widths, sizes) {
  const setInfo = await srcset(src, format, widths);
  img.setAttribute("srcset", setInfo.srcset);
  img.setAttribute(
    "sizes",
    sizes ||
      (img.getAttribute("align")
        ? "(max-width: 608px) 50vw, 187px"
        : "(max-width: 608px) 100vw, 608px")
  );
  return setInfo.fallback;
}

const dimImages = async (rawContent, outputPath) => {
  let content = rawContent;

  if (outputPath && outputPath.endsWith(".html")) {
    const dom = new JSDOM(content);
    const images = [...dom.window.document.querySelectorAll("img,amp-img")];

    if (images.length > 0) {
      await Promise.all(images.map((i) => processImage(i, outputPath)));
      content = dom.serialize();
    }
  }

  return content;
};

module.exports = {
  initArguments: {},
  configFunction: async (eleventyConfig, pluginOptions = {}) => {
    eleventyConfig.addTransform("imgDim", dimImages);
  },
};
