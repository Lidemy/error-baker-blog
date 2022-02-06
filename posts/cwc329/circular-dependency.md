---
title: 淺談工作上遇到的 Circular Dependency
date: 2022-01-30
tags: [JavaScript, 'circular dependency', eslint]
author: cwc329
layout: layouts/post.njk
---

<!-- summary -->

公司專案除了導入 monorepo，同時也導入更多的 eslint rules，其中有一條 no-cycle，一加入就全部紅通通。
除了 eslint，團隊現在逐步導入 unit test，也因為 circular dependency 而有問題。
用這一篇文章簡單紀錄一下。

<!-- summary -->


# Circular Dependency

## 什麼是 Circular Dependency？
circular dependency 簡單說就是在程式中，有兩個以賞的模組相互引用，導致依賴鍊變成環狀。
舉個例子來說，假設有 A、B 兩個模組，兩者相互依賴就會變成下面這樣的圖。

![](/img/posts/cwc329/circular-dependency/1.png)

又或者是多個模組形成一個依賴圈。

![](/img/posts/cwc329/circular-dependency/2.png)

這樣就會形成 circular dependency，知道定義之後還需要知道這會造成什麼問題呢？
這邊是個簡單的例子，可以暫時忽略為何會引入沒有使用的函式，
現在有四個檔案，內容分別為：
constant.js
```js
const h = 'hello';
const w = 'world';
module.exports = {
    h, w
}
```
hello.js
```js
const { h } = require('./constant');
const { world } = require('./world');

function hello() {
    console.log(h);
}
hello();
module.exports = { hello }
```
world.js
```js
const { w } = require('./constant');
const { hello } = require('./hello');

function world() {
    console.log(w);
}
world();
module.exports = { world }
```
main.js
```js
const { world } = require('./world')

world();
```
四個檔案的依賴關係會像這樣
![](/img/posts/cwc329/circular-dependency/3.png)

在 main.js 裡面我只想要用到 `world`，而我也預期應該不會出現 world 以外的字出現，
```js
world
world
```
但是當我執行 main.js 的時候會發現輸出如下

```js

hello
world
world

```

會多一個 hello 的輸出，這是因為在 world.js 裡面引用了 hello.js，所以會多一個輸出。
而如果我只想要使用 `hello`，但是因為 circular dependency，我還是會輸出預期外的 world。
這是 circular dependency 最主要的問題，會造成非預期的 side effects。


## Circular Dependency 的影響

像是公司專案中 redis 模組和 mysql 模組就有 circular dependency 的問題，即便只需要從 mysql 拿資料，還是會啟動 redis 連線。
這在 app 中會造成無謂或者預期外的行為，使得之後要除錯會有困難。

另外比較大的影響是在 unit test。
unit test 時會依照需求 mock 一些 function call，例如在測試 controller 的時候，如果有呼叫到 model 都會 mock，因為 unit test 時不需要（也無法）真的連到資料庫拿資料。
但是因為專案有 circular dependency，會有即便 mock 了依舊會執行到連線的 code，甚至連 redis 連線也開啟，導致在 CI/CD pipeline 中無法順利讓虛擬機關閉而阻塞流程。

## Circular Dependency 的解決方法

在我們的專案中，這些 circular dependency 幾乎都是因為當初檔案位置沒有妥善規劃。
我們首先 trace code，先釐清原先模組切分以及產生 circular dependency 的依賴鍊在哪裡。
接著我們先依照模組切分改寫 import 的寫法，在同一個模組內的檔案，會直接指到要 import 的檔案。
每個模組都建立 index.ts 檔案作為 export 的出口，其他模組要引用都是指到 index.ts 而不是實際所在的檔案。

而在釐清模組的同時，我們同時也將常出現的各個模組的一些底層實作分拆出去另外變成一個模組，也對整個 code base 做一次大重構。

重構之後，接著就是訂定相關的 coding 規範，讓大家遵守不要再犯同樣的錯誤。
