"use strict";

// 前端錯誤 beacon 的測試，分兩部分：
// 1) functions/error-log.js handler：直接以假的 Netlify event 呼叫，驗證
//    方法檢查、輸入驗證/截斷、回 204、且絕不把輸入反射回 body。
// 2) 客戶端 beacon：把打包後的 js/min.js 載入 jsdom，stub sendBeacon，
//    觸發假的 error / unhandledrejection，驗證送出的 payload、去重與上限。
//    （手法同 test-umami-events.js / test-copy-code.js。）

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const handlerMod = require("../functions/error-log.js");
const BUNDLE = path.resolve(__dirname, "..", "js", "min.js");

function post(body) {
  return { httpMethod: "POST", body: typeof body === "string" ? body : JSON.stringify(body) };
}

describe("error-log Netlify function handler", function () {
  it("rejects non-POST with 405 and no body", async () => {
    const res = await handlerMod.handler({ httpMethod: "GET" });
    assert.equal(res.statusCode, 405);
    assert.equal(res.body, "");
  });

  it("returns 204 with an empty body on a valid report (no reflection)", async () => {
    const payload = { message: "boom", source: "https://x/a.js", line: 4, col: 2, path: "/posts/x/" };
    const res = await handlerMod.handler(post(payload));
    assert.equal(res.statusCode, 204);
    assert.equal(res.body, "");
    // The handler must never echo attacker-controlled input back.
    assert.ok(!res.body.includes("boom"));
  });

  it("acknowledges malformed JSON and missing message with 204", async () => {
    const bad = await handlerMod.handler(post("{not json"));
    assert.equal(bad.statusCode, 204);
    const noMsg = await handlerMod.handler(post({ source: "x.js" }));
    assert.equal(noMsg.statusCode, 204);
  });

  it("truncates over-long fields and coerces numeric fields", () => {
    const rec = handlerMod.sanitize({
      message: "m".repeat(9000),
      stack: "s".repeat(9000),
      ua: "u".repeat(9000),
      line: "17",
      col: -5,
    });
    assert.equal(rec.message.length, handlerMod.LIMITS.message);
    assert.equal(rec.stack.length, handlerMod.LIMITS.stack);
    assert.equal(rec.ua.length, handlerMod.LIMITS.ua);
    assert.equal(rec.line, 17);
    assert.equal(rec.col, 0); // negative coerced to 0
    assert.ok(typeof rec.ts === "string");
  });
});

// ── client beacon (js/min.js in jsdom) ──────────────────────────────────

function loadPage() {
  const dom = new JSDOM(
    `<!doctype html><html lang="zh-TW"><head></head><body class="tmpl-home">
    <header><nav aria-label="primary"><div id="nav">
      <p class="site-title"><a href="/">EB</a></p></div>
      <div id="reading-progress"></div></nav>
    <dialog id="message" data-ui="{}"></dialog></header>
    <main id="main"></main></body></html>`,
    {
      url: "https://blog.errorbaker.tw/posts/example/",
      runScripts: "outside-only",
      pretendToBeVisual: true,
      virtualConsole: new VirtualConsole(),
    }
  );
  const { window } = dom;
  const beacons = [];
  // jsdom 15's Blob has no .text(); shim Blob to capture the raw string parts
  // so we can assert on the JSON the client actually serialized.
  window.Blob = class {
    constructor(parts, opts) {
      this._text = (parts || []).join("");
      this.type = (opts && opts.type) || "";
    }
  };
  // sendBeacon must exist BEFORE the bundle runs (the beacon block early-returns
  // when it is absent). Capture the JSON body of each call.
  window.navigator.sendBeacon = function (url, blob) {
    beacons.push({ url: url, body: blob && blob._text });
    return true;
  };
  window.ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
  window.eval(fs.readFileSync(BUNDLE, "utf8"));
  return { dom, window, beacons };
}

function fireError(window, opts) {
  const ev = new window.ErrorEvent("error", opts);
  window.dispatchEvent(ev);
}

function beaconJson(beacon) {
  return JSON.parse(beacon.body);
}

describe("client error beacon (js/min.js in jsdom)", function () {
  this.timeout(5000);

  it("beacons an uncaught error to the error-log endpoint with sanitized fields", async () => {
    const { window, beacons } = loadPage();
    fireError(window, {
      message: "ReferenceError: x is not defined",
      filename: "https://blog.errorbaker.tw/js/min.js",
      lineno: 12,
      colno: 5,
      error: new window.Error("ReferenceError: x is not defined"),
    });
    assert.equal(beacons.length, 1);
    assert.ok(beacons[0].url.endsWith("/.netlify/functions/error-log"));
    const body = beaconJson(beacons[0]);
    assert.equal(body.message, "ReferenceError: x is not defined");
    assert.equal(body.line, 12);
    assert.equal(body.col, 5);
    assert.equal(body.path, "/posts/example/");
    assert.ok(typeof body.ua === "string");
    window.close();
  });

  it('ignores cross-origin "Script error."', () => {
    const { window, beacons } = loadPage();
    fireError(window, { message: "Script error.", filename: "", lineno: 0, colno: 0 });
    assert.equal(beacons.length, 0);
    window.close();
  });

  it("dedupes identical errors within a session", () => {
    const { window, beacons } = loadPage();
    const opts = {
      message: "TypeError: boom",
      filename: "a.js",
      lineno: 3,
      colno: 1,
      error: new window.Error("TypeError: boom"),
    };
    fireError(window, opts);
    fireError(window, opts);
    fireError(window, opts);
    assert.equal(beacons.length, 1);
    window.close();
  });

  it("caps reports at 5 per pageview", () => {
    const { window, beacons } = loadPage();
    for (let i = 0; i < 8; i++) {
      fireError(window, {
        message: "Err " + i,
        filename: "a.js",
        lineno: i,
        colno: 1,
        error: new window.Error("Err " + i),
      });
    }
    assert.equal(beacons.length, 5);
    window.close();
  });

  it("beacons unhandled promise rejections", async () => {
    const { window, beacons } = loadPage();
    const ev = new window.Event("unhandledrejection");
    ev.reason = new window.Error("promise blew up");
    window.dispatchEvent(ev);
    assert.equal(beacons.length, 1);
    const body = beaconJson(beacons[0]);
    assert.ok(body.message.indexOf("Unhandled rejection: promise blew up") === 0);
    window.close();
  });
});
