"use strict";

const assert = require("assert").strict;
const { JSDOM, VirtualConsole } = require("jsdom");
// jsdom 15 reports modern CSS syntax (for example color-mix()) as parse
// warnings; route them into a muted VirtualConsole to keep test output clean.
const quietConsole = new VirtualConsole();
const imagePlugin = require("../_11ty/img-dim.js");

function getTransform() {
  let transform;
  imagePlugin.configFunction({
    addTransform(name, fn) {
      if (name === "imgDim") transform = fn;
    },
  });
  assert.ok(transform, "imgDim transform was not registered");
  return transform;
}

describe("image build pipeline", () => {
  const transform = getTransform();

  it("ignores data URIs instead of treating them as filesystem paths", async () => {
    const html = '<!doctype html><img alt="pixel" src="data:image/png;base64,AA==">';
    const output = await transform(html, "_site/data-uri/index.html");
    assert.match(output, /data:image\/png;base64,AA==/);
  });

  it("fails the build for a missing local image", async () => {
    await assert.rejects(
      () =>
        transform(
          '<!doctype html><img alt="missing" src="/img/definitely-missing.png">',
          "_site/missing-image/index.html"
        ),
      /Cannot read local image.*definitely-missing\.png/
    );
  });

  it("uses a compact responsive pipeline for local avatars", async () => {
    const output = await transform(
      '<!doctype html><img class="avatar avatar-large" alt="" src="/img/authors/tian.jpg">',
      "_site/avatar-test/index.html"
    );
    const doc = new JSDOM(output, { virtualConsole: quietConsole }).window.document;
    const image = doc.querySelector("picture > img.avatar");
    assert.ok(image, "Expected the local avatar to be wrapped in a picture");
    assert.match(image.getAttribute("width"), /^\d+$/);
    assert.match(image.getAttribute("height"), /^\d+$/);
    assert.equal(image.getAttribute("loading"), "lazy");
    assert.equal(image.getAttribute("decoding"), "async");
    assert.equal(image.getAttribute("style"), null);
    assert.equal(image.getAttribute("src"), "/img/authors/tian-320w.jpg");

    const sources = [...image.closest("picture").querySelectorAll("source")];
    assert.equal(sources.length, 1);
    assert.equal(sources[0].getAttribute("type"), "image/webp");
    assert.equal(sources[0].getAttribute("srcset"), "/img/authors/tian-320w.webp 320w");
    assert.equal(sources[0].getAttribute("sizes"), "64px");
  });

  it("converts GIFs to <video> — including odd-height GIFs that broke the 2021 build", async function () {
    // react.gif 是 874x615（奇數高）：正是 2021 年讓 ffmpeg 以
    // "height not divisible by 2" 失敗、導致 gif2mp4 被整個停用的檔案。
    // 用它當 fixture，確保 scale 濾鏡修正不會回歸。
    this.timeout(30000);
    const output = await transform(
      '<!doctype html><p><img alt="React demo" src="/img/posts/clay/react.gif"></p>',
      "_site/gif-test/index.html"
    );
    const doc = new JSDOM(output, { virtualConsole: quietConsole }).window.document;
    assert.equal(doc.querySelector("img"), null, "The <img> should be replaced");
    const video = doc.querySelector("video");
    assert.ok(video, "Expected the GIF to be swapped for a <video>");
    assert.equal(video.getAttribute("src"), "/img/posts/clay/react.mp4");
    assert.equal(video.getAttribute("width"), "874");
    assert.equal(video.getAttribute("height"), "615");
    for (const attr of ["autoplay", "muted", "loop", "playsinline"]) {
      assert.ok(video.hasAttribute(attr), `Expected ${attr} on the <video>`);
    }
    assert.equal(video.getAttribute("aria-label"), "React demo");
    assert.equal(video.getAttribute("alt"), null);

    const fs = require("fs");
    const mp4 = "_site/img/posts/clay/react.mp4";
    assert.ok(fs.existsSync(mp4), `Expected ${mp4} to be written`);
    assert.ok(fs.statSync(mp4).size > 0, `Expected ${mp4} to be non-empty`);
  });

  it("caps small local avatars at 96px without downsizing larger avatars", async () => {
    const output = await transform(
      '<!doctype html><img class="avatar avatar-small" alt="" src="/img/authors/tian.jpg">',
      "_site/small-avatar-test/index.html"
    );
    const doc = new JSDOM(output, { virtualConsole: quietConsole }).window.document;
    const image = doc.querySelector("picture > img.avatar-small");
    assert.ok(image, "Expected the small avatar to be wrapped in a picture");
    assert.equal(image.getAttribute("src"), "/img/authors/tian-96w.jpg");

    const sources = [...image.closest("picture").querySelectorAll("source")];
    assert.equal(sources.length, 1);
    assert.equal(sources[0].getAttribute("type"), "image/webp");
    assert.equal(sources[0].getAttribute("srcset"), "/img/authors/tian-96w.webp 96w");
    assert.equal(sources[0].getAttribute("sizes"), "22px");
  });
});
