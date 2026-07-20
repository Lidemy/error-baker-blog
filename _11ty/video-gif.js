/**
 * Copyright (c) 2021 Google Inc
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

const { promisify } = require("util");
const { join, dirname } = require("path");
const fs = require("fs");
const shell = require("any-shell-escape");
const exec = promisify(require("child_process").exec);
const pathToFfmpeg = require("ffmpeg-static");

// 內容欄寬 608px，×2（retina）＝ 1216；取 srcset 既有級距 1280 對齊。
// 全解析度輸出（如 2768px 寬的螢幕錄影）壓不小，縮到版面實際需要的寬度
// 才能拿到約 80–90% 的體積縮減。
const MAX_WIDTH = 1280;

// 同一個 GIF 會被多個頁面引用（例如 i18n 的四個語言版本）。Eleventy 的
// transform 逐頁並行執行，若不去重，同一個輸出檔會有多個 ffmpeg 行程
// 同時寫入（-y 互相覆蓋）。以輸出路徑為鍵快取 in-flight promise，
// 讓每個 GIF 每次建置最多轉檔一次。
const inFlight = new Map();

exports.gif2mp4 = function (filename) {
  const dest = mp4Name(filename);
  if (!inFlight.has(dest)) {
    inFlight.set(
      dest,
      convert(filename, dest).catch((e) => {
        // 失敗不留快取，讓下一個引用頁重試並回報一樣的錯誤。
        inFlight.delete(dest);
        throw e;
      })
    );
  }
  return inFlight.get(dest);
};

async function convert(filename, dest) {
  const outputFile = join("_site", dest);
  // 舊碼在這裡檢查的是 `dest`（一個以 / 開頭的 URL 路徑，等於檔案系統
  // 根目錄），永遠不存在，導致每一頁、每次建置都重新轉檔。改查實際輸出檔。
  if (fs.existsSync(outputFile)) {
    return dest;
  }
  // 優先讀 source tree：`_site/` 的複本由 passthrough copy 產生，與 HTML
  // transform 並行執行，讀它可能撞到半寫入的檔案（同 img-dim.js 的做法）。
  const sourceFile = "." + filename;
  const inputFile = fs.existsSync(sourceFile)
    ? sourceFile
    : join("_site", filename);
  // passthrough copy 可能還沒建立輸出目錄，先確保存在。
  fs.mkdirSync(dirname(outputFile), { recursive: true });
  const command = shell([
    pathToFfmpeg,
    // See https://engineering.giphy.com/how-to-make-gifs-with-ffmpeg/
    "-y",
    "-v",
    "error",
    "-i",
    inputFile,
    "-filter_complex",
    // yuv420p 要求偶數寬高：2021 年 huli 停用 gif2mp4 的原因正是
    // 874x615（奇數高）的 GIF 讓 libx264 以
    // "height not divisible by 2" 失敗。scale 表達式同時
    // (1) 把寬度上限鎖在 MAX_WIDTH、(2) 保證寬高皆為偶數（-2 = 依比例
    // 自動算出最接近的偶數高）。
    `[0:v] fps=15,scale='trunc(min(iw,${MAX_WIDTH})/2)*2':-2`,
    "-vsync",
    0,
    "-f",
    "mp4",
    "-pix_fmt",
    "yuv420p",
    outputFile,
  ]);
  try {
    await exec(command);
  } catch (e) {
    throw new Error(`Failed executing ${command} with ${e.stderr}`);
  }
  return dest;
}

function mp4Name(filename) {
  return filename.replace(/\.\w+$/, (_) => ".mp4");
}
