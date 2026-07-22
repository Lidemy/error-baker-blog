"use strict";

// 複製程式碼按鈕的行為測試：把打包後的 js/min.js 載入 jsdom，驗證按鈕
// 注入、複製、事件與 toast 回饋。與 test-umami-events.js 同一手法
// （既有測試多為靜態 HTML 斷言；client bundle 由 npm run js-build 產出）。

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const BUNDLE = path.resolve(__dirname, "..", "js", "min.js");

// 對齊 _includes/layouts/base.njk（#message toast、data-ui 字串）與 Prism
// 為 fenced code 產出的 <pre class="language-*"><code>…</code></pre>。
function fixture(bodyClass, withCode) {
  const code = withCode
    ? `<pre class="language-js"><code class="language-js">const x = 1;
console.log(x);</code></pre>`
    : "";
  return `<!doctype html>
<html lang="zh-TW">
<head></head>
<body class="${bodyClass}">
  <header>
    <nav aria-label="primary"><div id="nav">
      <p class="site-title"><a href="/">EB</a></p>
    </div><div id="reading-progress"></div></nav>
    <dialog id="message" role="status" aria-live="polite"
      data-ui='{"codeCopy":"複製","codeCopied":"已複製 ✓","codeCopyLabel":"複製程式碼"}'></dialog>
  </header>
  <main id="main"><article>${code}</article></main>
</body>
</html>`;
}

function loadPage({ bodyClass = "tmpl-post", withCode = true, withClipboard = true } = {}) {
  const dom = new JSDOM(fixture(bodyClass, withCode), {
    url: "https://blog.errorbaker.tw/posts/example/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
    virtualConsole: new VirtualConsole(),
  });
  const { window } = dom;
  const tracked = [];
  window.umami = { track: (name) => tracked.push(name) };
  window.ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
  const clip = { written: null };
  if (withClipboard) {
    Object.defineProperty(window.navigator, "clipboard", {
      value: {
        writeText: (t) => {
          clip.written = t;
          return Promise.resolve();
        },
      },
      configurable: true,
    });
  }
  window.eval(fs.readFileSync(BUNDLE, "utf8"));
  return { dom, window, tracked, clip };
}

function tick(ms = 30) {
  return new Promise((r) => setTimeout(r, ms));
}

describe("copy-code button (js/min.js in jsdom)", function () {
  this.timeout(5000);

  it("wraps each post code block and injects an accessible button", () => {
    const { window } = loadPage();
    const wrap = window.document.querySelector(".code-copy-wrap");
    const btn = window.document.querySelector("button.code-copy");
    assert.ok(wrap, "code block should be wrapped");
    assert.ok(wrap.querySelector("pre.language-js"), "pre should move into wrap");
    assert.equal(btn.getAttribute("type"), "button");
    assert.equal(btn.getAttribute("aria-label"), "複製程式碼");
    assert.equal(btn.textContent, "複製");
    window.close();
  });

  it("copies code text, tracks copy-code and shows the toast on click", async () => {
    const { window, tracked, clip } = loadPage();
    window.document.querySelector("button.code-copy").click();
    await tick();
    assert.equal(clip.written, "const x = 1;\nconsole.log(x);");
    assert.deepEqual(tracked, ["copy-code"]);
    const msg = window.document.getElementById("message");
    assert.equal(msg.textContent, "已複製 ✓");
    assert.ok(msg.hasAttribute("open"), "toast should open");
    const btn = window.document.querySelector("button.code-copy");
    assert.equal(btn.textContent, "已複製 ✓");
    assert.ok(btn.classList.contains("code-copy--done"));
    window.close();
  });

  it("does not run on non-post pages", () => {
    const { window } = loadPage({ bodyClass: "tmpl-home" });
    assert.equal(window.document.querySelector(".code-copy-wrap"), null);
    window.close();
  });

  it("falls back to execCommand when clipboard API is absent", async () => {
    const { window, tracked } = loadPage({ withClipboard: false });
    let execArg = null;
    window.document.execCommand = (cmd) => {
      // textarea holds the code at copy time
      const ta = window.document.querySelector("textarea");
      execArg = ta && ta.value;
      return true;
    };
    window.document.querySelector("button.code-copy").click();
    await tick();
    assert.equal(execArg, "const x = 1;\nconsole.log(x);");
    assert.deepEqual(tracked, ["copy-code"]);
    window.close();
  });
});
