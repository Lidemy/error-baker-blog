"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");

// 單一媒體檔案的體積預算：1MB。
// 超過這條線的圖片會直接拖垮讀者的載入體驗（尤其是行動網路）。
const BUDGET_BYTES = 1024 * 1024;

// 現存超標檔案的豁免清單（相對於 repo 根目錄、使用 / 分隔）。
// 這些是歷史遺留的肥檔，正由並行 PR 重新壓縮處理中。
// 請「不要」把新檔案加進來——新圖片請先壓縮到 1MB 以下再提交。
const ALLOWLIST = new Set([
  "img/authors/simon198-avatar.jpg",
  "img/posts/benben/15-raycast-101/15-wrapped.gif",
  "img/posts/clay/next-seo/5.png",
  "img/posts/ruofan/animation-2.gif",
  "img/posts/ruofan/event.gif",
  "img/posts/ruofan/next-login.gif",
  "img/posts/ruofan/observe.gif",
  "img/posts/ruofan/postgres.png",
  "img/posts/ruofan/quill-1.png",
]);

const ROOT = path.join(__dirname, "..");
const IMG_DIR = path.join(ROOT, "img");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function toRelative(fullPath) {
  return path.relative(ROOT, fullPath).split(path.sep).join("/");
}

function formatMB(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

describe("媒體體積預算（img/）", () => {
  const oversized = walk(IMG_DIR)
    .map((fullPath) => ({
      relPath: toRelative(fullPath),
      size: fs.statSync(fullPath).size,
    }))
    .filter((file) => file.size > BUDGET_BYTES);

  it(`未豁免的檔案不得超過 ${formatMB(BUDGET_BYTES)}`, () => {
    const offenders = oversized.filter((file) => !ALLOWLIST.has(file.relPath));

    const message = [
      `發現 ${offenders.length} 個超過 ${formatMB(BUDGET_BYTES)} 的媒體檔案：`,
      ...offenders.map((file) => `  - ${file.relPath}（${formatMB(file.size)}）`),
      "",
      "請先壓縮再提交，建議工具：",
      "  - GIF：轉成 MP4/WebM，或用 gifsicle -O3 --lossy 壓縮",
      "  - PNG/JPG：用 squoosh.app、ImageOptim 或轉成 WebP",
      "若確有不可壓縮的例外，請在 test/test-media-budget.js 的 ALLOWLIST 說明並豁免。",
    ].join("\n");

    assert.equal(offenders.length, 0, message);
  });

  it("豁免清單中已瘦身的檔案不會造成失敗（僅提示清理）", () => {
    const oversizedPaths = new Set(oversized.map((file) => file.relPath));
    const slimmed = [...ALLOWLIST].filter(
      (relPath) =>
        !oversizedPaths.has(relPath) && fs.existsSync(path.join(ROOT, relPath))
    );
    const removed = [...ALLOWLIST].filter(
      (relPath) => !fs.existsSync(path.join(ROOT, relPath))
    );

    for (const relPath of slimmed) {
      console.log(
        `      提示：${relPath} 已低於預算，可從 ALLOWLIST 移除（不影響測試結果）。`
      );
    }
    for (const relPath of removed) {
      console.log(
        `      提示：${relPath} 已不存在，可從 ALLOWLIST 移除（不影響測試結果）。`
      );
    }
    // 刻意不 assert：豁免檔案被並行 PR 壓縮或移除時，這裡只提醒、不擋人。
  });
});
