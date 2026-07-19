"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");
// jsdom 15 reports modern CSS syntax (for example color-mix()) as parse
// warnings; route them into a muted VirtualConsole to keep test output clean.
const quietConsole = new VirtualConsole();
const metadata = require("../_data/metadata.json");

const SITE_ROOT = path.resolve(__dirname, "..", "_site");

function documentFor(relative) {
  const filename = path.join(SITE_ROOT, relative);
  assert.ok(fs.existsSync(filename), `Missing build output: ${filename}`);
  return new JSDOM(fs.readFileSync(filename, "utf8"), { virtualConsole: quietConsole }).window.document;
}

describe("archive page", () => {
  // Only the zh-TW archive exists today; localized archives are open issue
  // #229 and must not be asserted here until that ships.
  let doc;

  before(() => {
    doc = documentFor("archive/index.html");
  });

  it("lists dated posts", () => {
    const dates = [...doc.querySelectorAll(".archive-date")].map((node) =>
      node.textContent.trim()
    );
    assert.ok(dates.length >= 80, `only ${dates.length} archive rows`);
    for (const date of dates) {
      assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("orders posts newest first", () => {
    const dates = [...doc.querySelectorAll(".archive-date")].map((node) =>
      node.textContent.trim()
    );
    const sorted = [...dates].sort().reverse();
    assert.deepEqual(dates, sorted);
  });
});

describe("llms.txt", () => {
  it("describes the site for AI crawlers", () => {
    const filename = path.join(SITE_ROOT, "llms.txt");
    assert.ok(fs.existsSync(filename));
    const body = fs.readFileSync(filename, "utf8");
    assert.ok(body.trim().length > 0);
    assert.ok(body.includes(metadata.url));
  });
});

describe("status dialog", () => {
  it("ships the localized toast dialog on every page type", () => {
    for (const page of ["index.html", "posts/tian/git-flow/index.html"]) {
      const dialog = documentFor(page).getElementById("message");
      assert.ok(dialog, `${page}: missing #message dialog`);
      assert.equal(dialog.getAttribute("role"), "status");
      assert.equal(dialog.getAttribute("aria-live"), "polite");
      assert.ok(dialog.getAttribute("data-ui").length > 0);
    }
  });
});
