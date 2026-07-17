---
title: Reduce | 完全手冊
date: 2026-05-16
tags: [JavaScript, array]
author: benben
layout: layouts/post.njk
lang: zh-TW
translationKey: benben/16-reduce
translationTargets: [en, ja, zh-CN]
---

<!-- summary -->
<!-- 上班跟同事聊天剛好聊到 Reduce ，於是就有這篇了！ -->
<!-- summary -->

**！ 本篇文章將會介紹筆者 JavaScript 的 Array methods: `Reduce`，老樣子參考對你有幫助的就行了** ：D

> 話說 ES6(2015) 已經是**10 年前** 的語法了 👴🏼

筆者認為大部分剛學習 JavaScript 的人，除了 Array 常用的 `push`, `pop`, `shift`, `unshift` 之外，對於其他 methods 應該比較陌生一點，其中又以 `reduce` 最為陌生，其他常用的如 `find`, `forEach` 可能還蠻直觀的，可能大多人覺得有用到 reduce 再去查就好了，但什麼時候會用到呢？甚至也說不清楚。

這邊先拋出一些問題，讓大家思考一下：

1. `Array.prototype.reduce()` 是什麼？
2. 為什麼叫 reduce ？
3. 參數的意義是什麼？
4. 什麼時候會用到？什麼時候不該用？

希望看完本篇文章，以上的問題都能迎刃而解了。

## `Array.prototype.reduce()` 是什麼？

直上完全手冊：

```md
1. Let O be ? ToObject(this value).
2. Let len be ? LengthOfArrayLike(O).
3. If IsCallable(callback) is false, throw a TypeError exception.
4. If len = 0 and initialValue is not present, throw a TypeError exception.
5. Let k be 0.
6. Let accumulator be undefined.
7. If initialValue is present, then
   a. Set accumulator to initialValue.
8. Else,
   a. Let kPresent be false.
   b. Repeat, while kPresent is false and k < len,
   i. Let Pk be ! ToString(𝔽(k)).
   ii. Set kPresent to ? HasProperty(O, Pk).
   iii. If kPresent is true, then 1. Set accumulator to ? Get(O, Pk).
   iv. Set k to k + 1.
   c. If kPresent is false, throw a TypeError exception.
9. Repeat, while k < len,
   a. Let Pk be ! ToString(𝔽(k)).
   b. Let kPresent be ? HasProperty(O, Pk).
   c. If kPresent is true, then
   i. Let kValue be ? Get(O, Pk).
   ii. Set accumulator to ? Call(callback, undefined, « accumulator, kValue, 𝔽(k), O »).
   d. Set k to k + 1.
10. Return accumulator.
```

> [Ecma Script - reduce](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.reduce)

對，整個 reduce 的規格就是這樣！

這樣是不是大家都看懂了？ 好！我們下次見～👋

才怪！

接下來我們看看以下的小班情況：

> 註：小班是一個剛學 JavaScript 的初學者

我們通常第一次看到的 reduce 都會長這樣：

```js
const arr = [1, 2, 3]
const sum = arr.reduce((a, b) => a + b)
```

小班：「啊！原來 reduce 是加總用的啊！」

懂了！下次就這樣就沒問題了吧？

此時大班在心裡 OS：「才怪！」

> 註：大班就是幼稚園的大班，不是 Big b_ng

但這時小班剛學完 sum，興奮地聽不進去，就這樣小班又開開心心的回去寫 code 了！

## 為什麼叫 reduce ？

大班認為：上面的「加總」功能，顯然跟英文「reduce (減少)」完反是相反的意思。

不確定讀者初學習 reduce 時，有沒有跟大班一樣的疑惑？

讓我們提升一下視角，假如你是創造 reduce 功能的人，你會怎麼命名？

- 我們有一個 Array，裡面有很多元素
- 試著把 Array 裡元素的數量 **減少**
- 要做得通用化，同時還要確保 "Don't break the Internet"

是的，把一個 Array **減少(reduce)** 到一個值（當然這個值可以是 number, string 甚至是 array）

傳入的參數是一個 reduceFunction ，這個 function 要做什麼使用者可以自行定義，所以你也可以讓原來的 Array 重複兩次，長度也變為兩倍，跟減少 (reduce) 無關也沒關係的。

```js
const arr = [1, 2, 3]
const res = arr.reduce((a, b) => {
  a.push(b)
  a.push(b)
  return a
}, [])

// arr 被 "reduce" 成了
// [1, 1, 2, 2, 3, 3]
console.log(res)
```

這樣是不是就跟 `forEach`, `map` 有點差別了？

但是上述的 `forEach`, `map`, `reduce` 都可以做到加總的功能，但真正優秀的 JavaScript 開發者，知道什麼時候該用什麼，如果只是不多的 Array 做加總，reduce 的 one line 寫法很優雅，但如果有考慮到的極致效能，甚至應該用 for 迴圈就好，因為這些都是 for 迴圈衍生出的語法糖。

## 參數的意義是什麼？

大道理都懂，但小班有自己的想法。

小班：「等一下！所以我說那個 a, b 是什麼呢？」

之前用 reduce 做加總時，就是把 a 跟 b 相加啊，reduce 就會自動幫我加起來了，對吧？

「才不是！」大班不耐煩的說。

不要用什麼 a, b 這種沒有意義的變數名稱了，通通都給我改成 acc, cur ！

- `acc` for **accumulator**
- `cur` for current

小班又回頭看了一下規格書，發現裡面也有提到 accumulator 這個名稱！

```
6. Let accumulator be undefined.
```

大班表示：「I told you」「但除了 acc, cur 之外，你還漏了一個參數」

直覺敏銳的讀者可能已經發現了，上面的 reduce function 還傳了一個 `[]` 進去，

我們一步一步來，一樣先看我們的加法：

傳說數學家 **高斯** 發明了一個公式，那個大家化成灰也記得的公式：`(首項 + 末項) * 項數 / 2`

什麼？你說你忘了？你的數學老師，在你後面 ...

沒關係！我們現在有 AI ，咳咳！不是！我是說，我們現在有 reduce ，一個剛剛才學的酷東西：

```js
const arr = [1, 2, 3, 4, ..., 100]
const res = arr.reduce((acc, cur) => acc + cur, 0)

console.log(res)
// 5050 === (1 + 100 ) * 100 / 2
```

那種太難的公式不會算沒關係，薪水至少要會算吧？
假設小班的薪水是 50000 元，這個月房租 10000 元、娛樂 5000 元、吃飯 8000 元，那麼這個月還剩多少錢呢？

```js
const arr = [10000, 5000, 8000]
const res = arr.reduce((acc, cur) => acc - cur, 50000)

// 27000
console.log(res)
```

太棒了！有 27000 元！再加上之前存的 3000 元，可以買一台 `Macbook Air` 了！

小班立馬下單、拿到了新電腦之後，開心得不得了，但接著問題又來了，該設什麼密碼呢？

小班又想起了 **密碼學** ，好像有一個概念是兩個很大的質數相乘的，這個好！那我要用三個質數！肯定就不會被破解了！

```js
const arr = [11, 37, 97]
const res = arr.reduce((acc, cur) => acc * cur, 1)

console.log(res)
// 39479
```

但有了新密碼之後，小班又想起，電腦是不是只看得懂二進位啊？

好吧！那我先把剛剛的質數都轉成二進位的對照 Object：

```js
const arr = [11, 37, 97]
const res = arr.reduce((acc, cur) => {
  const value = cur.toString(2)
  acc[cur] = value
  return acc
}, {})

console.log(res)
// {
//   "11": "1011",
//   "37": "100101",
//   "97": "1100001"
// }
```

至於把密碼設成質數的二進位相乘又是另一個故事了 ...

再回到 reduce 這邊～

是的，我大部分把 initialValue 設成 **單位元素**，例如：加法的單位元素是 0，乘法的單位元素是 1。當然還有 `[]` 跟 `{}` 等等，當然，也沒有說不能是 **function**。

```js
const arr = [() => console.log(1), () => console.log(2), () => console.log(3)]
const fn = () => {}
const res = arr.reduce((acc, cur, index) => {
  acc[index] = cur
  return acc
}, fn)

// 1
fn['0']()
// 2
fn['1']()
// 3
fn['2']()
// 這誰寫的？說出來，保證不打死你
```

那麼問題來了，如果上面的 initialValue 是沒有的話，會發生什麼事呢？

這個就交給有興趣的讀者自己去試試看了～

## 什麼時候會用到？什麼時候不該用？

原則上，能用 `forEach`, `map` 就搞定的事情，就不要使用 `reduce` 。

沒錯！就跟 `let`, `const` 一樣，能用 `const` 就用 `const` 。

這個時間點筆者差不多換新工作也 3 個月了，在 AI 的浪潮下，好像技術文章都很少更新了，好在大多沒有變得 AI 味，這些文章在這個時代下，反而更顯得珍貴了。

筆者也是秉持著不使用 AI 寫文章，忙的時候寧可放著不寫，也不使用 AI 硬產，也可能沒這麼通順，自以為幽默地放了一些內梗。

好的寫到這邊，有跟著讀下來的讀者 reduce 應該也了解得差不多了，感謝看到這裡的各位。

我們下次見！👋

---

## Ref

- [Ecma Script](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.reduce)

> 免責聲明

以上均為筆者自身經驗，難免小有主觀意見，供讀者們參考，也歡迎分享經驗交流。
如果有錯誤的地方還請大大們指正，筆者會立刻修改，再次感謝大家！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作係採用 [創用 CC 姓名標示 4.0 國際授權條款](https://creativecommons.org/licenses/by/4.0/) 授權。您可以在 [benben.me](https://benben.me) 找到我。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
