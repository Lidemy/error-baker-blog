---
title: 介紹 WeakMap
date: 2021-11-12
tags: [JavaScript, weap-map]
author: Umer
layout: layouts/post.njk
---

<!-- summary -->
<!-- 本文介紹ES6 新增的物件－－ WeakMap object -->
<!-- summary -->
<!-- more -->

## 什麼是 WeakMap object

WeakMap object 是一個 ES6 新增的物件，是一個由 key/value 組成的物件，其中 key 屬於**弱引用（weak reference）**，並且必須是物件形式（object）。

## 弱引用

弱引用在程式設計中是用來做垃圾回收機制（釋放記憶體空間）用的，一個對象若只被弱引用所引用，則被認為是不可訪問（或弱可訪問）的，並因此可能在任何時刻被回收。

JavaScript 本身具有自動的垃圾回收機制，但在某些情況下還是會發生記憶體洩漏（memory leak）的問題。

當程式不再使用到記憶體，卻沒有將該記憶體清空，就會發生記憶體洩漏。當不被用到的記憶體越來越多，就會出現程式變慢、卡頓、高延遲之類的問題，嚴重的話程式就會崩潰。

一些記憶體洩漏的情況有以下：

1. 使用全域變數，但在用完後沒有設置為 null

	JavaScript 的全域變數是由根節點(根據執行環境不同，可能是 window 或 global)引用的，因此它們在應用程式的整個生命週期中都不會被垃圾回收，除非有再設置為 null。在建立太多全域變數或是用全域變數來儲存大量資料......等情況，就會發生記憶體洩漏。

2. 閉包
	在函式中回傳另一個函式，
	```js
	function parent(){
		var count = 0
		return function (){console.log('count'+count)}
	}
	```
	在執行 `parent()` 之後，因為還有另一個函式在使用`count`，所以記憶體不會被清空。

3. Event listeners
	使用了 Event listener 但沒有把它移除掉，使用到的 callback 不會被回收記憶體

4. 其他情況

	使用到 `setTimeout`, `setInterval`，或是 Cache 沒有定期清理，DOM 元素被移除，多處引用......等，也有可能發生記憶體洩漏。

	具體例子可以參考這篇文章，[Causes of Memory Leaks in JavaScript and How to Avoid Them](https://www.ditdot.hr/en/causes-of-memory-leaks-in-javascript-and-how-to-avoid-them#timers)。

## WeakMap 的用法
```js
const wm = new WeakMap()

wm.delete(key)
// 移除 key 的關聯對象(value)

wm.get(key)
// 取得 key 的關聯對象(value)

wm.has(key)
// 返回 key 是否有關聯對象(value)的 boolean

wm.set(key, value)
// 設置 key 的關聯對象(value)並返回 key/value

```
## Map VS WeakMap
Map 是 ES6 新加入的資料結構，大體來說跟 Object 很像，但多了一些內建功能。Map 對於物件的引用是**強引用**，即使物件設定了 null 並且沒有其他引用存在時，也不會被JavaScript 的垃圾回收機制做記憶體回收，造成記憶體洩漏。

相反的，如果是使用 WeakMap，因為 WeakMap 的引用是**弱引用**，被它引用的物件在設定了 null 並且沒有其他引用存在時，就可以在某一時刻被JavaScript 的垃圾回收機制做記憶體回收。

簡單的重現兩者的差別，這邊直接用開發者工具示範，更嚴謹的方法可以使用 nodeJS 的 `node --expose-gc` 參數來偵測記憶體的使用狀況。

![](https://i.imgur.com/xr6ZXzR.png)


從圖片結果中可以看到，`Map()` 引用的物件在設定為 null 之後，也沒有被回收記憶體， `WeakMap()` 引用的物件在設定為 null 之後，則有被回收記憶體。

## 有和沒有 WeakMap 的差別

如同前面所說，WeakMap 方便用來減少記憶體的洩漏，或者是不想每次都手動（設定為 null）回收記憶體的時候，就可以透過 `WeakMap.prototype.delete(key)`或是把被它引用的物件設定為 null 並且沒有其他引用存在時，讓該物件被自動回收。

[節錄 ECMAScript6 的說明](https://262.ecma-international.org/6.0/#sec-weakmap-objects)

> WeakMap and WeakSets are intended to provide mechanisms for dynamically associating state with an object in a manner that does not “leak” memory resources...

使用場合之一，
```js
let wm = new WeakMap();

wm.set(document.querySelector(".title"), { click: 0 });

document.querySelector(".title").addEventListener(
  "click",
  function () {
    let data = myWeakmap.get(document.querySelector(".title"));
    data.click++;
  }
);

document.getElementById("logo").remove();
```
上面例子的 DOM 節點作為 WeakMap 的 key，在這個節點被移除的時候，所對應的 value (`{ click: 0 }`)也會被清除。

如果上面的例子沒有使用 WeakMap 的話，並且忘記手動做`logoData = null` 的動作的話，記憶體就不會被回收，如下。
```js
let data = {click: 0};

document.querySelector(".title").addEventListener(
  "click",
  function () {
    data.click++;
  }
);

document.querySelector(".title").remove();
```


## 總結

WeakMap 適合在映射(mapping) key(object) 和 value 並且這個 object 會在未來某一時間消失的時候使用，讓被使用到的記憶體可以自動回收而不會洩漏。

需要注意的是，WeakMap 弱引用的只是 key(object)，而不是 value，value 依然是正常引用。
![](https://i.imgur.com/GJvGLm9.png)

## 相關資料
[你不知道的 WeakMap](https://juejin.cn/post/6844904169417998349#heading-17)
[Mdn WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
[Mdn Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
[阮一峰 ECMAScript 6 (ES6) 标准入门教程 第三版](https://www.bookstack.cn/read/es6-3rd/spilt.4.docs-set-map.md#8pz2kf)
[从JS中的内存管理说起 —— JS中的弱引用](https://juejin.cn/post/6854573215549751310)
[JavaScript常見的記憶體洩漏](https://www.gushiciku.cn/pl/pncE/zh-tw)