---
title: 儲存資料到 firestore 前，需要注意哪些事？
description: "儲存資料到 Firestore 前要注意什麼？從官方每次 transaction 最多 500 筆寫入的限制出發，用實際情境說明容易踩到的坑，並分享在開發上可行的資料結構設計與解決方法。"
date: 2022-04-16
tags: [Backend]
author: ruofan
layout: layouts/post.njk
---

<!-- summary -->

Hi 大家好。 前陣子在開發微服務的時候，對於儲存的資料結構有一些小小的心得。這篇文章主要會帶大家看 firestore 使用上的限制，在開發上有哪些解決方法給大家參考。

<!-- summary -->
<!-- more -->

首先帶大家來看在 [官方文件上](https://firebase.google.com/docs/firestore/quotas) 關於寫入資料的使用限制。

> Maximum number of writes that can be passed to a Commit operation or performed in a transaction
> ☞ 500

這個限制是指在寫入的時候 每一次的 transaction 最多只能有 500 筆。

#### 什麼樣的情境會產生一次寫入的 document 會超過 500 筆呢？

範例情境: 在設計上把每一天每五分鐘的資料存成一個 document。

這樣的資料結構設計存在一個很大的問題，那就是如果讀取一個月的資料量的讀取成本會爆高 ... 。

> 假設先不論成本的情境下，要如何解決一次寫入超過 500 筆的問題呢？

可以使用批次寫入，設定一個批次寫入的數量完成後先 commit ，再接續寫入後續的資料。

下方是範例程式碼：

```javascript
  static async waitForPromiseChunkToBeResolved(promiseChunk) {
    return Promise.all(promiseChunk).then(
      (resolvedChunkResults) => resolvedChunkResults
    );
  }

  static async promiseAllInBatches(promises) {
    const promisesBatches = chunk(promises, CHUNK_INTERVAL);
    let result;
    for (const promises of promisesBatches) {
      result = await this.waitForPromiseChunkToBeResolved(promises);
    }
    return result;
  }
```

讀取成本爆高當然是不 ok 的，假設直接不使用 sub collection 把全部資料都放在同一個 document ! 這樣讀取成本總該大幅降低了吧 ... ?

但這樣的設計很可能會面臨另一個問題，接著帶大家看一下 [官方文件上](https://firebase.google.com/docs/firestore/quotas) 上關於 document 儲存容量上的使用限制。

> Maximum size for a document
> ☞  1 MiB (1,048,576 bytes)

這個限制是指，如果想要讓資料在擴充時是有彈性的，就不應該把所有資料都只放在一個 document !
在儲存資料結構的設計上，可以適當的搭配 sub collection 以及 nest document 權衡成本與資料擴充的彈性。

以下是範例資料結構：

```javascript
collection
	document
		sub collection
			document
				data (data type - map)
```

## 小結

這次的開發體驗著實地體會到了在設計資料結構之前了解搭配使用的資料庫系統上限制的重要。
在閱讀文章時如果有遇到什麼問題，或是有什麼建議，都歡迎留言告訴我，謝謝。😃

## 參考資料

- [Document | Usage and limits for Firestore](https://firebase.google.com/docs/firestore/quotas)
- [Blog | Decrease read costs of Firestore using Firestore Data Bundles](https://dev.to/moga/decrease-read-costs-of-firestore-using-firestore-data-bundles-30e9)
