"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");
// jsdom 15 reports modern CSS syntax (for example color-mix()) as parse
// warnings; route them into a muted VirtualConsole to keep test output clean.
const quietConsole = new VirtualConsole();

const clientSource = fs.readFileSync(
  path.resolve(__dirname, "..", "src", "main.js"),
  "utf8"
);
const bannerMarker = clientSource.indexOf("// ── Locale-suggestion banner");
const tocMarker = clientSource.indexOf("// ── Table of contents", bannerMarker);
const bannerScript = clientSource.slice(
  clientSource.indexOf("(function ()", bannerMarker),
  tocMarker
);

function renderBanner(languages, dismissed = false) {
  const dom = new JSDOM(
    `<!doctype html>
    <html lang="zh-TW">
      <head>
        <link rel="alternate" hreflang="zh-TW" href="https://blog.errorbaker.tw/posts/tian/git-flow/">
        <link rel="alternate" hreflang="x-default" href="https://blog.errorbaker.tw/posts/tian/git-flow/">
        <link rel="alternate" hreflang="en" href="https://blog.errorbaker.tw/en/posts/tian/git-flow/">
      </head>
      <body>
        <aside id="lang-suggest" hidden>
          <div class="lang-suggest__content">
            <span class="lang-suggest__text"></span>
            <a class="lang-suggest__link" href="#"></a>
          </div>
          <button class="lang-suggest__dismiss" type="button" aria-label="關閉"></button>
        </aside>
      </body>
    </html>`,
    {
      runScripts: "outside-only",
      url: "https://blog.errorbaker.tw/posts/tian/git-flow/",
    }
  );
  const { window } = dom;
  Object.defineProperty(window.navigator, "languages", {
    configurable: true,
    value: languages,
  });
  window.document.getElementById("lang-suggest").setAttribute(
    "data-strings",
    JSON.stringify({
      en: {
        available: "This page is available in English",
        read: "Read in English",
        dismiss: "Dismiss",
      },
    })
  );
  if (dismissed) window.localStorage.setItem("langSuggestDismissed", "1");
  window.eval(bannerScript);
  return dom;
}

describe("locale suggestion client behavior", () => {
  it("offers the best published language and localizes its controls", () => {
    const dom = renderBanner(["en-US", "zh-TW"]);
    const { document, localStorage } = dom.window;
    const banner = document.getElementById("lang-suggest");
    const link = banner.querySelector(".lang-suggest__link");
    const dismiss = banner.querySelector(".lang-suggest__dismiss");

    assert.equal(banner.hidden, false);
    assert.equal(banner.lang, "en");
    assert.equal(
      banner.querySelector(".lang-suggest__text").textContent,
      "This page is available in English"
    );
    assert.equal(link.textContent, "Read in English");
    assert.equal(link.hreflang, "en");
    assert.equal(link.lang, "en");
    assert.equal(link.href, "https://blog.errorbaker.tw/en/posts/tian/git-flow/");
    assert.equal(dismiss.getAttribute("aria-label"), "Dismiss");

    dismiss.click();
    assert.equal(banner.hidden, true);
    assert.equal(localStorage.getItem("langSuggestDismissed"), "1");
  });

  it("stays hidden when the reader previously dismissed it", () => {
    const dom = renderBanner(["en-US", "zh-TW"], true);
    assert.equal(dom.window.document.getElementById("lang-suggest").hidden, true);
  });

  it("stays hidden when the current language is the reader's first choice", () => {
    const dom = renderBanner(["zh-TW", "en-US"]);
    assert.equal(dom.window.document.getElementById("lang-suggest").hidden, true);
  });
});
