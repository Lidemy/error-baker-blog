"use strict";

// Umami 北極星事件的行為測試：把打包後的 js/min.js 直接載入 jsdom，
// 以 stub 的 window.umami 驗證各事件在對應互動時觸發、且絕不重複。
// 這是第一個執行 client bundle 的測試（既有測試皆為靜態 HTML 斷言）；
// bundle 由 `npm run js-build` 產出，`npm run build` 會先於 mocha 執行它。

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const BUNDLE = path.resolve(__dirname, "..", "js", "min.js");

// 最小化的頁面骨架：只保留 main.js 會查詢的元素（結構對齊
// _includes/layouts/base.njk 與 post.njk）。
function fixture(bodyClass) {
  return `<!doctype html>
<html lang="en">
<head></head>
<body class="${bodyClass}">
  <header>
    <nav aria-label="primary">
      <div id="nav">
        <p class="site-title"><a href="/">ErrorBaker</a></p>
        <details class="lang-switch"><ul>
          <li><a class="lang-switch__item" href="#ja" hreflang="ja" lang="ja">日本語</a></li>
        </ul></details>
      </div>
      <div id="reading-progress" aria-hidden="true"></div>
    </nav>
    <dialog id="message" data-ui="{}"></dialog>
  </header>
  <main id="main"><article>
    <button class="post-share__button" type="button" on-click="share"
      data-share-url="https://blog.errorbaker.tw/posts/example/"></button>
  </article></main>
  <div class="reader-tools" hidden>
    <button id="back-to-top" type="button" hidden on-click="backToTop"></button>
  </div>
  <footer><a id="rss" href="#feed"></a></footer>
</body>
</html>`;
}

// runScripts: "outside-only" + 手動 eval bundle：DOM 先就緒（main.js 在
// module top-level 就會讀取 #message 的 data-ui），且我們能在執行前佈好
// umami stub 與 ResizeObserver/幾何 polyfill。
function loadPage({ bodyClass = "tmpl-post", withUmami = true } = {}) {
  const dom = new JSDOM(fixture(bodyClass), {
    url: "https://blog.errorbaker.tw/posts/example/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
    virtualConsole: new VirtualConsole(),
  });
  const { window } = dom;
  const calls = [];
  if (withUmami) {
    window.umami = {
      track: (name, data) => calls.push({ name, data }),
    };
  }
  // jsdom 的版面幾何皆為 0，補上足夠的幾何讓閱讀進度可以算到 100%：
  // bottom = scrollTop + footer.top(0)，percent = scrollTop / (bottom - winHeight)。
  const hooks = { resizeCallback: null };
  window.ResizeObserver = class {
    constructor(callback) {
      hooks.resizeCallback = callback;
    }
    observe() {}
    disconnect() {}
  };
  // jsdom 15 沒有 document.scrollingElement；polyfill 成 <html> 並固定
  // scrollTop，讓 updateProgress 一進來就算到 100%。
  Object.defineProperty(window.document, "scrollingElement", {
    value: window.document.documentElement,
    configurable: true,
  });
  Object.defineProperty(window.document.scrollingElement, "scrollTop", {
    value: 100000,
    configurable: true,
  });
  window.eval(fs.readFileSync(BUNDLE, "utf8"));
  return { dom, window, calls, hooks };
}

function nextFrames(window, ms = 80) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("umami north-star events (js/min.js in jsdom)", function () {
  this.timeout(5000);

  it("fires read-25/50/75/100 once each on post pages", async () => {
    const { window, calls, hooks } = loadPage();
    assert.ok(hooks.resizeCallback, "reading-progress block should observe body");
    hooks.resizeCallback(); // sets bottom/winHeight and schedules updateProgress
    await nextFrames(window);
    const reads = calls.filter((c) => c.name.startsWith("read-")).map((c) => c.name);
    assert.deepEqual(reads, ["read-25", "read-50", "read-75", "read-100"]);
    // rAF 迴圈在 scroll 後會持續跑 3 秒；再等幾個 frame 驗證不重複計數。
    await nextFrames(window);
    assert.equal(calls.filter((c) => c.name.startsWith("read-")).length, 4);
    window.close();
  });

  it("does not fire read-depth events on non-post pages", async () => {
    const { window, calls, hooks } = loadPage({ bodyClass: "tmpl-home" });
    hooks.resizeCallback();
    await nextFrames(window);
    assert.equal(calls.filter((c) => c.name.startsWith("read-")).length, 0);
    window.close();
  });

  it("tracks share when the share button is clicked", () => {
    const { window, calls } = loadPage();
    window.document.querySelector(".post-share__button").click();
    assert.equal(calls.filter((c) => c.name === "share").length, 1);
    window.close();
  });

  it("tracks lang-switch with the target language", () => {
    const { window, calls } = loadPage();
    window.document.querySelector("a.lang-switch__item").click();
    // JSON round-trip：事件 data 物件建立於 jsdom realm，
    // 其 prototype 與 Node 端不同，strict deepEqual 會誤判。
    assert.deepEqual(
      JSON.parse(JSON.stringify(calls.filter((c) => c.name === "lang-switch"))),
      [{ name: "lang-switch", data: { lang: "ja" } }]
    );
    window.close();
  });

  it("tracks feed-click on the footer feed link", () => {
    const { window, calls } = loadPage();
    window.document.getElementById("rss").click();
    assert.deepEqual(
      calls.filter((c) => c.name === "feed-click").map((c) => c.name),
      ["feed-click"]
    );
    window.close();
  });

  it("never throws when window.umami is absent (script blocked)", async () => {
    const { window, hooks } = loadPage({ withUmami: false });
    hooks.resizeCallback();
    await nextFrames(window);
    // 任一互動都不得因缺少 umami 而丟例外。
    window.document.querySelector(".post-share__button").click();
    window.document.querySelector("a.lang-switch__item").click();
    window.document.getElementById("rss").click();
    window.close();
  });
});
