---
title: "Reduce | 完全手册"
date: 2026-05-16
tags: [JavaScript, array]
author: benben
layout: layouts/post.njk
lang: zh-CN
sourceLang: zh-TW
translationKey: benben/16-reduce
permalink: /zh-CN/posts/benben/16-reduce/
draft: true
sourceHash: 7788f0dc875f421d0796cc508e16a676932c3196b50b4d8b7ff9e0b2d5e5c700
---

<!-- summary -->
<!-- 上班跟同事聊天刚好聊到 Reduce ，于是就有了这篇了！ -->
<!-- summary -->

**！本篇文章将会介绍笔者 JavaScript 的 Array methods: `Reduce`，老样子参考对你有帮助的就行了** ：D

> 话说 ES6(2015) 已经是**10 年前** 的语法了 👴🏼

笔者认为大部分刚学习 JavaScript 的人，除了 Array 常用的 `push`, `pop`, `shift`, `unshift` 之外，对于其他 methods 应该比较陌生一点，其中又以 `reduce` 最为陌生，其他常用的如 `find`, `forEach` 可能还挺直观的，可能大多人觉得有用到 reduce 再去查就好了，但什么时候会用到呢？甚至也说不清楚。

这边先抛出一些问题，让大家思考一下：

1. `Array.prototype.reduce()` 是什么？
2. 为什么叫 reduce ？
3. 参数的意义是什么？
4. 什么时候会用到？什么时候不该用？

希望看完本篇文章，以上的问题都能迎刃而解了。

## `Array.prototype.reduce()` 是什么？

直上完全手册：

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

对，整个 reduce 的规格就是这样！

这样是不是大家都看懂了？ 好！我们下次见～👋

才怪！

接下来我们看看以下的小班情况：

> 注：小班是一个刚学 JavaScript 的初学者

我们通常第一次看到的 reduce 都会长这样：

```js
const arr = [1, 2, 3]
const sum = arr.reduce((a, b) => a + b)
```

小班：「啊！原来 reduce 是加总用的啊！」

懂了！下次就这样就没问题了吧？

此时大班在心里 OS：「才怪！」

> 注：大班就是幼儿园的大班，不是 Big b_ng

但这时小班刚学完 sum，兴奋地听不进去，就这样小班又开开心心的回去写 code 了！

## 为什么叫 reduce ？

大班认为：上面的「加总」功能，显然跟英文「reduce (减少)」完全是相反的意思。

不确定读者初学 reduce 时，有没有跟大班一样的疑惑？

让我们提升一下视角，假如你是创造 reduce 功能的人，你会怎么命名？

- 我们有一个 Array，里面有很多元素
- 试着把 Array 里元素的数量 **减少**
- 要做得通用化，同时还要确保 "Don't break the Internet"

是的，把一个 Array **减少(reduce)** 到一个值（当然这个值可以是 number, string 甚至是 array）

传入的参数是一个 reduceFunction ，这个 function 要做什么使用者可以自行定义，所以你也可以让原来的 Array 重复两次，长度也变为两倍，跟减少 (reduce) 无关也没关系的。

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

这样是不是就跟 `forEach`, `map` 有点差别了？

但是上述的 `forEach`, `map`, `reduce` 都可以做到加总的功能，但真正优秀的 JavaScript 开发者，知道什么时候该用什么，如果只是不多的 Array 做加总，reduce 的 one line 写法很优雅，但如果有考虑到极致性能，甚至应该用 for 循环就好，因为这些都是 for 循环衍生出的语法糖。

## 参数的意义是什么？

大道理都懂，但小班有自己的想法。

小班：「等一下！所以我说那个 a, b 是什么呢？」

之前用 reduce 做加总时，就是把 a 跟 b 相加啊，reduce 就会自动帮我加起来了，对吧？

「才不是！」大班不耐烦的说。

不要用什么 a, b 这种没有意义的变量名称了，通通都给我改成 acc, cur ！

- `acc` for **accumulator**
- `cur` for current

小班又回头看了一下规格书，发现里面也有提到 accumulator 这个名称！

```
6. Let accumulator be undefined.
```

大班表示：「I told you」「但除了 acc, cur 之外，你还漏了一个参数」

直觉敏锐的读者可能已经发现了，上面的 reduce function 还传了一个 `[]` 进去，

我们一步一步来，一样先看我们的加法：

传说数学家 **高斯** 发明了一个公式，那个大家化成灰也记得的公式：`(首项 + 末项) * 项数 / 2`

什么？你说你忘了？你的数学老师，在你后面 ...

没关系！我们现在有 AI ，咳咳！不是！我是说，我们现在有 reduce ，一个刚才才学的酷东西：

```js
const arr = [1, 2, 3, 4, ..., 100]
const res = arr.reduce((acc, cur) => acc + cur, 0)

console.log(res)
// 5050 === (1 + 100 ) * 100 / 2
```

那种太难的公式不会算没关系，薪水至少要会算吧？
假设小班的薪水是 50000 元，这个月房租 10000 元、娱乐 5000 元、吃饭 8000 元，那么这个月还剩多少钱呢？

```js
const arr = [10000, 5000, 8000]
const res = arr.reduce((acc, cur) => acc - cur, 50000)

// 27000
console.log(res)
```

太棒了！有 27000 元！再加上之前存的 3000 元，可以买一台 `Macbook Air` 了！

小班立马下单、拿到了新电脑之后，开心得不得了，但接着问题又来了，该设什么密码呢？

小班又想起了 **密码学** ，好像有一个概念是两个很大的质数相乘的，这个好！那我要用三个质数！肯定就不会被破解了！

```js
const arr = [11, 37, 97]
const res = arr.reduce((acc, cur) => acc * cur, 1)

console.log(res)
// 39479
```

但有了新密码之后，小班又想起，电脑是不是只看得懂二进制啊？

好吧！那我先把刚才的质数都转成二进制的对照 Object：

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

至于把密码设成质数的二进制相乘又是另一个故事了 ...

再回到 reduce 这边～

是的，我大部分把 initialValue 设成 **单位元素**，例如：加法的单位元素是 0，乘法的单位元素是 1。当然还有 `[]` 跟 `{}` 等等，当然，也没有说不能是 **function**。

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
// 这谁写的？说出来，保证不打死你
```

那么问题来了，如果上面的 initialValue 是没有的话，会发生什么事呢？

这个就交给有兴趣的读者自己去试试看了～

## 什么时候会用到？什么时候不该用？

原则上，能用 `forEach`, `map` 就搞定的事情，就不要使用 `reduce` 。

没错！就跟 `let`, `const` 一样，能用 `const` 就用 `const` 。

这个时间点笔者差不多换新工作也 3 个月了，在 AI 的浪潮下，好像技术文章都很少更新了，好在大多没有变得 AI 味，这些文章在这个时代下，反而更显得珍贵了。

笔者也是秉持着不使用 AI 写文章，忙的时候宁可放着不写，也不使用 AI 硬产，也可能没这么通顺，自以为幽默地放了一些内梗。

好的写到这边，有跟着读下来的读者 reduce 应该也了解得差不多了，感谢看到这里的各位。

我们下次见！👋

---

## Ref

- [Ecma Script](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.reduce)

> 免责声明

以上均为笔者自身经验，难免小有主观意见，供读者们参考，也欢迎分享经验交流。
如果有错误的地方还请大大们指正，笔者会立刻修改，再次感谢大家！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本作品采用 [知识共享 署名 4.0 国际许可协议](https://creativecommons.org/licenses/by/4.0/) 进行许可。你可以在 [benben.me](https://benben.me) 找到我。
