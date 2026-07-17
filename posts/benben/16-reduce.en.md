---
title: "Reduce | The Complete Handbook"
date: 2026-05-16
tags: [JavaScript, array]
author: benben
layout: layouts/post.njk
lang: en
sourceLang: zh-TW
translationKey: benben/16-reduce
permalink: /en/posts/benben/16-reduce/
draft: true
sourceHash: 7788f0dc875f421d0796cc508e16a676932c3196b50b4d8b7ff9e0b2d5e5c700
---

<!-- summary -->
<!-- This post came about because reduce came up while chatting with a coworker. -->
<!-- summary -->

**! This post covers the JavaScript Array method `Reduce`. As always, just take whatever's helpful to you** :D

> By the way, ES6 (2015) is already **10 years old** 👴🏼

I think most people just starting out with JavaScript — besides the common Array methods like `push`, `pop`, `shift`, and `unshift` — are relatively unfamiliar with the rest, and `reduce` is the most unfamiliar of all. Other commonly used ones like `find` and `forEach` are fairly intuitive. Most people figure they'll just look up `reduce` when they need it. But when exactly *do* you need it? They can't even really say.

Let me throw out a few questions for you to think about first:

1. What is `Array.prototype.reduce()`?
2. Why is it called *reduce*?
3. What do the parameters mean?
4. When should you use it? When should you not?

I hope that after reading this post, all of the above will be a breeze.

## What is `Array.prototype.reduce()`?

Straight to the complete handbook:

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

Yep, that's the entire spec for reduce!

So now everyone understands it, right? Great! See you next time~ 👋

As if!

Next, let's look at the following situation with Xiao Ban:

> Note: Xiao Ban is a beginner who just started learning JavaScript.

The first time most of us see reduce, it looks like this:

```js
const arr = [1, 2, 3]
const sum = arr.reduce((a, b) => a + b)
```

Xiao Ban: "Ah! So reduce is for summing!"

Got it. No problem doing it this way from now on, right?

Meanwhile Da Ban mutters inwardly: "As if!"

> Note: Da Ban means the senior class of kindergarten, not "Big B___".

But Xiao Ban had just learned `sum` and was too excited to listen, so off he went, happily writing code again!

## Why is it called reduce?

Da Ban thinks: the "summing" function above is clearly the exact opposite of the English word "reduce."

I wonder — when you first learned reduce, did you have the same confusion as Da Ban?

Let's raise our perspective a bit. If you were the person inventing reduce, how would you name it?

- We have an Array with many elements
- Try to **reduce** the number of elements in the Array
- It has to be general-purpose, while also making sure to "Don't break the Internet"

Yes — **reduce** an Array down to a single value (which of course can be a number, a string, or even an array).

The parameter passed in is a reduceFunction, and what this function does is up to the user to define. So you could also duplicate the original Array and end up with a result twice as long — that has nothing to do with reducing, and that's fine too.

```js
const arr = [1, 2, 3]
const res = arr.reduce((a, b) => {
  a.push(b)
  a.push(b)
  return a
}, [])

// arr gets "reduce"d into
// [1, 1, 2, 2, 3, 3]
console.log(res)
```

See how this is a bit different from `forEach` and `map`?

But the `forEach`, `map`, and `reduce` above can all do summing. A truly excellent JavaScript developer knows when to use which. If you're just summing a small Array, reduce's one-liner is elegant. But if you're chasing peak performance, you should even just use a `for` loop, because all of these are syntactic sugar derived from the `for` loop.

## What do the parameters mean?

The big principles are understood, but Xiao Ban has his own ideas.

Xiao Ban: "Wait! So what are those `a` and `b`?"

When using reduce for summing earlier, you just add `a` and `b`, and reduce automatically adds them up for you, right?

"No!" Da Ban says impatiently.

Stop using meaningless variable names like `a` and `b` — change them all to `acc` and `cur`!

- `acc` for **accumulator**
- `cur` for current

Xiao Ban went back and checked the spec and found that it also mentions the name accumulator!

```
6. Let accumulator be undefined.
```

Da Ban: "I told you." "But besides `acc` and `cur`, you're still missing a parameter."

Sharp-eyed readers may have already noticed that the reduce function above also passed in a `[]`.

Let's go step by step. Again, start with our addition:

Legend has it that the mathematician **Gauss** invented a formula — the one you'd remember even if you were burned to ashes: `(first term + last term) * number of terms / 2`.

What? You say you forgot? Your math teacher, right behind you ...

No worries! We have AI now — ahem! No! I mean, we now have reduce, a cool thing we just learned:

```js
const arr = [1, 2, 3, 4, ..., 100]
const res = arr.reduce((acc, cur) => acc + cur, 0)

console.log(res)
// 5050 === (1 + 100 ) * 100 / 2
```

If that kind of tricky formula is too much, at least you should be able to calculate your own salary, right?
Say Xiao Ban's salary is 50,000. This month rent is 10,000, entertainment 5,000, food 8,000. How much is left this month?

```js
const arr = [10000, 5000, 8000]
const res = arr.reduce((acc, cur) => acc - cur, 50000)

// 27000
console.log(res)
```

Great! 27,000! Add the 3,000 saved up before, and he can buy a `Macbook Air`!

Xiao Ban placed the order right away and was overjoyed when the new computer arrived. But then another problem came up: what password should he set?

Xiao Ban remembered **cryptography** — there seems to be a concept about multiplying two large primes together. This is it! I'll use three primes! Surely it won't be cracked!

```js
const arr = [11, 37, 97]
const res = arr.reduce((acc, cur) => acc * cur, 1)

console.log(res)
// 39479
```

But with the new password set, Xiao Ban remembered again — do computers only understand binary?

Fine! Let me first turn those primes just now into a binary lookup Object:

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

As for setting the password to the product of the primes' binary forms... that's another story.

Back to reduce~

Yes, I mostly set initialValue to the **identity element**: for example, the identity element of addition is 0, and of multiplication is 1. And of course there's also `[]` and `{}`, and so on. And of course, there's no rule saying it can't be a **function**.

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
// Who wrote this? Speak up, I promise I won't beat you to death
```

So here's the question: what happens if the initialValue above is omitted?

I'll leave that for interested readers to try themselves~

## When should you use it? When should you not?

As a rule, if something can be handled with `forEach` or `map`, don't use `reduce`.

Exactly! Just like `let` and `const` — if `const` works, use `const`.

Around this point in time, it's been about three months since I started a new job. In the wave of AI, it seems far fewer technical articles are being updated. Fortunately, most of them haven't taken on an "AI flavor" — in this era, these articles feel even more precious.

I also stick to not using AI to write articles. When I'm busy, I'd rather just not write than force out AI-generated content. It may not be that fluent, and I've tucked in some inside jokes that I find amusing.

Alright, writing up to here — for readers who've followed along, you should understand reduce pretty well by now. Thanks to everyone who made it this far.

See you next time! 👋

---

## Ref

- [Ecma Script](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.reduce)

> Disclaimer

The above is all from my own experience and inevitably contains some subjective opinions, offered for your reference. Feel free to share your experiences and discuss. If there are any errors, please point them out and I'll fix them right away. Thanks again, everyone!

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me).
