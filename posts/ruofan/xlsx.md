---
title: 用 sheetJS 匯出 excel
description: "用 SheetJS 匯出 Excel：透過簡潔的程式碼把資料轉成 xlsx 檔下載，並從原始碼觀察 SheetJS 背後如何組出 worksheet 與 workbook，適合有前端匯出報表需求的人。"
date: 2022-05-22
tags: [Frontend]
author: ruofan
layout: layouts/post.njk
---

<!-- summary -->

Hi 大家好！ 近期確診，不適的症狀蠻嚴重的，深刻感受到健康的重要！
這篇文章會帶大家看如何透過 sheetJS 將資料匯出成 excel 格式。

<!-- summary -->

<!-- more -->

#### sheetJS 解決了哪些問題 ?

透過下方的程式碼得知，sheetJS 讓我們可以用簡潔的程式碼匯出 excel。

```javascript
<script setup>
import { utils, writeFileXLSX } from 'xlsx'
import { reactive, watch } from '@vue/composition-api'

const xlsx = reactive({
  sheets: [...your data]
})

function onExport() {
  /* make the worksheet */
  const fieldsWS = utils.json_to_sheet(xlsx.sheets)
  /* add to workbook */
  const wb = utils.book_new()
  utils.book_append_sheet(wb, fieldsWS, 'sheets')
  /* generate an XLSX file */
  writeFileXLSX(wb, 'sheets.xlsx')
}
</script>

<template>
  <v-btn color="primary" @click="onExport">匯出 excel</v-btn>
</template>
```

並且在許多平台上都可以正常匯出，下方是 [SAUCE LABS](https://app.saucelabs.com/open_sauce/user/sheetjs/tests/vdc) 列出的支援度。

![](/img/posts/ruofan/saucelabs.svg)
圖片來源： [saucelabs](https://app.saucelabs.com/open_sauce/user/sheetjs/tests/vdc)

#### 從 [source code](https://github.com/SheetJS/sheetjs/blob/b7d3eae3b7a02de1d03f0e627140c616443e40b0/bits/90_utils.js#L252) 來觀察 sheetJS 背後的實作

```javascript
function onExport() {
  /* make the worksheet */
  const fieldsWS = utils.json_to_sheet(xlsx.sheets)
  /* add to workbook */
  const wb = utils.book_new()
  utils.book_append_sheet(wb, fieldsWS, 'sheets')
  /* generate an XLSX file */
  writeFileXLSX(wb, 'sheets.xlsx')
}
```

- [json_to_sheet](https://github.com/SheetJS/sheetjs/blob/b7d3eae3b7a02de1d03f0e627140c616443e40b0/bits/90_utils.js#L252) 透過 [sheet_add_json Fn](https://github.com/SheetJS/sheetjs/blob/b7d3eae3b7a02de1d03f0e627140c616443e40b0/bits/90_utils.js#L192) 實作
  傳入的資料格式是 `array of objects`， xlsx 欄位的順序透過 `Object.keys` 來排序
  ```javascript
  function json_to_sheet(js/*:Array<any>*/, opts)/*:Worksheet*/ { return sheet_add_json(null, js, opts); }
  ```

- [writeFileXLSX](https://github.com/SheetJS/sheetjs/blob/b7d3eae3b7a02de1d03f0e627140c616443e40b0/bits/98_exports.js#L12) 透過 [writeFileSyncXLSX](https://github.com/SheetJS/sheetjs/blob/b7d3eae3b7a02de1d03f0e627140c616443e40b0/bits/88_write.js#L188) 實作
  在 [writeSyncXLSX Fn](https://github.com/SheetJS/sheetjs/blob/b7d3eae3b7a02de1d03f0e627140c616443e40b0/bits/88_write.js#L112) 中使用的 [s2ab Fn](https://github.com/SheetJS/sheetjs/blob/b7d3eae3b7a02de1d03f0e627140c616443e40b0/bits/05_buf.js#L32) 這邊的實作使用到了 `new ArrayBuffer` ，稍微研究了一下。
  ```javascript
  function s2ab(s/*:string*/)/*:any*/ {
	if(typeof ArrayBuffer === 'undefined') return s2a(s);
	var buf = new ArrayBuffer(s.length), view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
  }
  ```

下方是來自 [mdn](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 的介紹
> The ArrayBuffer is a data type that is used to represent a generic, fixed-length binary data buffer.
>you create a typed array view or a DataView which represents the buffer in a specific format, and use that to read and write the contents of the buffer.

固定大小的原始二進制資料緩衝，讓存取資料更有效率。
透過閱讀原始碼，認識到了平常沒有機會接觸到的資料型態！


### 小結
實作的過程，蠻快速的。比較大的收穫是在閱讀原始碼的過程，整體來說非常有趣！
在閱讀文章時如果有遇到什麼問題，或是有什麼建議，都歡迎留言告訴我，謝謝。😃

## 參考資料

- [Document | JavaScript typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)
- [Document | arraybuffer-binary-arrays](https://javascript.info/arraybuffer-binary-arrays)
- [Document | sheetjs](https://docs.sheetjs.com/)
