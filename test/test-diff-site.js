"use strict";

const assert = require("assert").strict;
const {
  normUrl,
  normText,
  maskTimestamps,
  canonicalJsonLd,
} = require("../scripts/diff-site.js");

describe("diff-site 正規化（SEO 比對的消音合約）", () => {
  it("normUrl 剝除 ?hash= 與 ?v= 快取參數", () => {
    assert.equal(
      normUrl("/js/min.js?hash=deadbeef0123"),
      "/js/min.js"
    );
    assert.equal(normUrl("/css/x.css?v=0a1b2c"), "/css/x.css");
    assert.equal(
      normUrl("/page/?q=keep"),
      "/page/?q=keep",
      "非快取查詢字串必須保留"
    );
  });

  it("normText 收斂空白但保留內容", () => {
    assert.equal(normText("  a\n  b\t c  "), "a b c");
  });

  it("maskTimestamps 遮蔽各種 W3C datetime 變體", () => {
    assert.equal(maskTimestamps("2026-05-16T00:00:00Z"), "<ts>");
    assert.equal(maskTimestamps("2026-05-16T00:00:00+08:00"), "<ts>");
    assert.equal(maskTimestamps("2026-05-16"), "<ts>");
    assert.equal(
      maskTimestamps("updated 2026-05-16T08:00:00.123Z ok"),
      "updated <ts> ok"
    );
  });

  it("canonicalJsonLd 排序鍵值，使鍵序差異不產生假警報", () => {
    const a = canonicalJsonLd('{"b":1,"a":{"d":2,"c":3}}');
    const b = canonicalJsonLd('{"a":{"c":3,"d":2},"b":1}');
    assert.equal(a, b);
  });

  it("canonicalJsonLd 對壞掉的 JSON 退回收斂空白的原文", () => {
    assert.equal(canonicalJsonLd("not { json"), "not { json");
  });
});
