---
title: 好玩 && 好用的 console log 技巧
date: 2021-12-12
tags: [Front-end, JavaScript]
author: Xiang
layout: layouts/post.njk
image:
---

<!-- summary -->

你知道 console.log 還有其他好玩的功用嗎？

<!-- summary -->
<!-- more -->

## 前言

在我們 JS 的開發歷程當中，最熟悉不過的語法 `console.log`，伴隨著我們每天的 debug 的生活。
從還在學習程式的第一天起，導師 Huli 就傳授給我們前端開發最強大的技能：「 console.log 加爆 」！
好用程度之高，從學習 JS 的第一天起，一直到現在工作上面的開發，無時無刻都可以來一段 console.log。

原本以為 console.log 已經無敵好用的我，無意之間認識到了，原來 console 不是只有 `log` 這個厲害的用法而已。下面就來介紹一些不同情境下能夠幫助我們更好 debug 的 console 技巧。

## 印出資料的各種技巧

我們最簡易印出資料的方式，就是直接在 console.log 裡面放入我們想印出的變數：

```js
let a = "apple";
console.log(a);

// apple
```

但是當我們一份檔案裡面有很多 console.log 時，可能不容易判斷印出來的資料是哪裡的資料，所以我們可能會利用搭配字串的方式來標注目前正在呈現哪一個變數：

```js
var a = 1;
function fn() {
  console.log("第一個 a:", a);
  var a = 5;
  console.log("第二個 a:", a);
  a++;
  var a;
  fn2();
  console.log("第三個 a:", a);
  function fn2() {
    console.log("第四個 a:", a);
    a = 20;
    b = 100;
  }
}
fn();
console.log("第五個 a:", a);
a = 10;
console.log("第六個 a:", a);
console.log("第一個 b:", b);

// 第一個 a: undefined
// 第二個 a: 5
// 第四個 a: 6
// 第三個 a: 20
// 第五個 a: 1
// 第六個 a: 10
// 第一個 b: 100
```

如果我們想印的樣子是 `變數： 值` 的形式，可以用類似 ES6 解構的語法：

```js
let a = "apple";
let b = "banana";

console.log({ a });
console.log({ b });

// {a: 'apple'}
// {b: 'banana'}
```

好，現在特別的要來了！

## console 特殊用法

☞ 當我們可能想要判斷某種狀況下才要印出資料，可以使用 console.assert：

- 傳入的第一個參數為 false 時，會印出傳入的第二個參數

```js
// 判斷當 number 不為偶數時，印出錯誤訊息

let errMsg = "the number is not even";
let number = 3;
console.assert(number % 2 === 0, { number, errMsg });

// Assertion failed: {number: 3, errMsg: "the number is not even"}
```

☞ 當我們想給 console 加上計數功能時，可以透過 console.count()：

- 只要參數的數值不變，每被呼叫一次，就會 count++
- 當參數的數值有改變，count 就會重新計算

```js
let a;
function doConsole() {
  console.count(a);
}

a = "apple";
doConsole(a);
doConsole(a);
doConsole(a);

// ａ 的值改變後
a = "banana";
doConsole(a);
doConsole(a);

// apple: 1
// apple: 2
// apple: 3
// banana: 1
// banana: 2
```

除了改變數值以外，也可以透過 console.countReset 將數值歸零：

```js
let a = "apple";
console.count(a);
console.count(a);
console.countReset(a);
console.count(a);

// apple: 1
// apple: 2
// apple: 1
```

☞ 當我們要印出的東西是有層級關係的，我們可以使用 console.group：

```js
console.group("Lidemy 鋰學院");
console.log("Lidemy 鋰學院的老師 Huli");
console.group("Lidemy 鋰學院的第一期課程");
console.log("第一期課程的第一個 學員");
console.log("第一期課程的第二個 學員");
console.groupEnd("Lidemy 鋰學院的第一期課程");
console.group("Lidemy 鋰學院的第二期課程");
console.log("第二期課程的第一個 學員");
console.log("第二期課程的第二個 學員");
console.groupEnd("Lidemy 鋰學院的第二期課程");
console.groupEnd("Lidemy 鋰學院");
```

![](http://blog.errorbaker.tw/img/posts/xiang/console-log-1.png)

☞ 當我們要印出折疊隱藏的內容時，可以使用 console.groupCollapsed：

```js
console.groupCollapsed("折疊隱藏的彩蛋");
console.log("為什麼一個功能改了又改");
console.log("當我許願池膩！");
```

![](http://blog.errorbaker.tw/img/posts/xiang/console-log-2.png)

展開以後，可以看到藏在底下的彩蛋！
![](http://blog.errorbaker.tw/img/posts/xiang/console-log-3.png)

☞ 當我們要印出物件型態的資料時，可以使用 console.table：

```js
let obj = {
  食物: "西瓜",
  工具: "牙刷",
};

console.table(obj);
```

![](http://blog.errorbaker.tw/img/posts/xiang/console-log-4.png)

```js
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

var family = {};

family.mother = new Person("Jane", "Smith");
family.father = new Person("John", "Smith");
family.daughter = new Person("Emily", "Smith");

console.table(family);
```

![](http://blog.errorbaker.tw/img/posts/xiang/console-log-5.png)

☞ 上面提到過 console 能幫我們計數，但其實他還可以幫我們計時，我們可以使用 console.time：

```js
console.time("timer");

for (let i = 0; i < 100; i++) {
  // do something
}

console.timeEnd("timer");
```

瀏覽器會幫我們紀錄從 console.time 執行到 console.timeEnd 所經過的時間

![](http://blog.errorbaker.tw/img/posts/xiang/console-log-6.png)

☞ 如果我們想看看 function 被呼叫的順序，或者誰執行了這個 function，可以使用 console.trace：

```js
function a() {
  console.trace();
}
function b() {
  a();
}
function c() {
  b();
}
b();
c();
```

![](http://blog.errorbaker.tw/img/posts/xiang/console-log-7.png)

☞ 當我們想要更清楚分類印出的資訊時，可以使用 info、warn、error：

```js
console.info("我是 info");
console.warn("我是 warn");
console.error("我是 error");
```

![](http://blog.errorbaker.tw/img/posts/xiang/console-log-8.png)

☞ 當我們想要把印出的文字加上 style 時，可以這麼做：

```js
let a = "apple";
console.log(
  "%c a = %s",
  "color:red; font-size: 35px; background-color: yellow",
  a
);
```

可以搭配的設定：

- %s: for string
- %i or %d: for integers
- %f: for float numbers
- %o: for DOM element
- %O: for JS object
- %c : for adding styles to your log

![](http://blog.errorbaker.tw/img/posts/xiang/console-log-9.png)

## 結語

文章中提到了一些 console 的特殊用法，有時候能幫助我們在 debug 時更清楚的呈現出資料，或者在 devtool console 隱藏一些有趣的彩蛋。
以後開發的時候，除了「console.log 加爆！」以外，還有更多 console 組合技可以一起搭配使用囉。
