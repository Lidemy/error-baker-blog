"use strict";

const assert = require("assert").strict;
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
});
