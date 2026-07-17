---
title: 'Reduce | 完全マニュアル'
date: 2026-05-16
tags: [JavaScript, array]
author: benben
layout: layouts/post.njk
lang: ja
sourceLang: zh-TW
translationKey: benben/16-reduce
permalink: /ja/posts/benben/16-reduce/
reviewedBy: benben
reviewedAt: 2026-07-18
publishedAt: 2026-07-18
sourceHash: 453a27accd175a00da3851983100d4d0e68cc0c2d77f0f05fd66106249f9f091
---

<!-- summary -->
<!-- 仕事で同僚と話している時にたまたま Reduce の話題になり、それでこの記事が生まれました！ -->
<!-- summary -->

**！本記事では JavaScript の Array メソッド `Reduce` を紹介します。いつもの通り、自分に役立つ部分だけ拾って読んでもらえれば大丈夫です** ：D

> ちなみに ES6（2015）はもう**10 年前**の仕様です 👴🏼

JavaScript を学び始めたばかりの人の多くは、`push`、`pop`、`shift`、`unshift` といった Array の定番メソッドを除くと、他のメソッドにはあまり馴染みがないと思います。その中でもとりわけ馴染みが薄いのが `reduce` です。他のよく使う `find` や `forEach` はわりと直感的ですが、`reduce` は「必要になったら調べればいい」と思っている人が多いでしょう。でも、具体的にいつ必要になるのでしょう？うまく説明できない人も多いはずです。

まずは少し考えてみるための問いをいくつか投げかけます：

1. `Array.prototype.reduce()` とは何か？
2. なぜ reduce と呼ぶのか？
3. 引数の意味は何か？
4. いつ使うべきで、いつ使うべきでないか？

この記事を読み終える頃には、上記の疑問がすべて解消されていることを願っています。

## `Array.prototype.reduce()` とは何か？

いきなり完全マニュアルをどうぞ：

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

そうです、これが reduce の仕様のすべてです！

これでみんな分かりましたよね？はい！それではまた次回〜👋

なわけありません！

次に、シャオバン（小班）くんのある状況を見てみましょう：

> 補足：シャオバンくんは JavaScript を学び始めたばかりの初心者です。

私たちが reduce を初めて目にする時、たいていこんな形をしています：

```js
const arr = [1, 2, 3]
const sum = arr.reduce((a, b) => a + b)
```

シャオバンくん：「あ！つまり reduce は合計を出すためのものなんだね！」

分かった。これからはこう書けば問題ないよね？

その一方、ダーバン（大班）くんは心の中でつぶやきます：「なわけないだろ！」

> 補足：ダーバンくんは幼稚園の年長組のことです。「Big B\_\_\_」ではありません。

でもシャオバンくんは合計を覚えたばかりで興奮していて耳に入らず、また嬉々としてコードを書きに戻っていきました！

## なぜ reduce と呼ぶのか？

ダーバンくんは考えます：上の「合計」機能は、英語の "reduce（減らす）" という言葉とは明らかに完全に正反対の意味だ、と。

皆さんは reduce を初めて学んだ時、ダーバンくんと同じ疑問を持ったことはないでしょうか？

少しだけ視点を上げてみましょう。もしあなたが reduce を作る人だとしたら、どう名付けますか？

- 多くの要素を持つ Array がある
- その Array の要素数を**減らそう**としてみる
- 汎用的にしつつ、"Don't break the Internet" も守る

そうです、Array をひとつの値へと **reduce（減らす）** するのです（もちろんその値は number、string、さらには array でも構いません）。

渡す引数は reduceFunction で、この function が何をするかはユーザーが自由に定められます。だから元の Array を二回繰り返して長さを二倍にすることもでき、reduce（減らす）と関係がなくても構いません。

```js
const arr = [1, 2, 3]
const res = arr.reduce((a, b) => {
  a.push(b)
  a.push(b)
  return a
}, [])

// arr は "reduce" されて
// [1, 1, 2, 2, 3, 3]
console.log(res)
```

これだと `forEach` や `map` とは少し違って見えますよね？

でも上の `forEach`、`map`、`reduce` はどれも合計を出せます。本当に優れた JavaScript 開発者は、いつ何を使うべきかを知っています。少数の Array を合計するだけなら、reduce の one line 書き方は優雅です。けれど究極のパフォーマンスまで考慮するなら、むしろ `for` ループを使うべきです。なぜならこれらはすべて `for` ループから派生した糖衣構文だからです。

## 引数の意味は何か？

大きな理屈は分かった、でもシャオバンくんには自分なりの考えがあります。

シャオバンくん：「ちょっと待って！じゃあその `a` と `b` って何？」

さっき reduce で合計を出した時は、`a` と `b` を足せば、reduce が勝手に全部足してくれるんでしょ？

「そんなわけない！」とダーバンくんは苛立って言います。

`a` や `b` みたいに意味のない変数名はやめて、全部 `acc` と `cur` に変えなさい！

- `acc` は **accumulator** の acc
- `cur` は current の cur

シャオバンくんが仕様書を見直してみると、そこにも accumulator という名前が書いてありました！

```
6. Let accumulator be undefined.
```

ダーバンくん：「言ったでしょ」「でも `acc` と `cur` のほかに、もう一つ引数が抜けてるよ」

勘の鋭い読者はもうお気付きかもしれませんが、上の reduce の function には `[]` も渡されています。

少しずつ進めましょう。同じくまずは足し算から：

伝説の数学者**ガウス**がある公式を発明しました。灰になっても忘れないあの公式：`(初項 + 末項) * 項数 / 2`

何？忘れたって？あなたの数学の先生が、すぐ後ろに・・・

大丈夫！私たちにはもう AI があります、ゴホン！いや違います！私たちには reduce があるのです、たった今学んだばかりの素晴らしいものが：

```js
const arr = [1, 2, 3, 4, ..., 100]
const res = arr.reduce((acc, cur) => acc + cur, 0)

console.log(res)
// 5050 === (1 + 100 ) * 100 / 2
```

そんな難しい公式が分からなくても、少なくとも給料は計算できるはずですよね？
たとえばシャオバンくんの給料が 50,000 で、今月の家賃が 10,000、娯楽が 5,000、食費が 8,000 だとしたら、今月いくら残るでしょうか？

```js
const arr = [10000, 5000, 8000]
const res = arr.reduce((acc, cur) => acc - cur, 50000)

// 27000
console.log(res)
```

素晴らしい！27,000！それに前に貯めていた 3,000 を足せば、`Macbook Air` が買えます！

シャオバンくんはすぐに注文し、新しいパソコンが届いて大喜びでした。でも次なる問題が浮上しました。パスワードは何にしよう？

シャオバンくんは**暗号学**を思い出しました。大きな素数を二つ掛け合わせるという概念があったはず。これだ！じゃあ素数を三つ使おう！これなら絶対に破られない！

```js
const arr = [11, 37, 97]
const res = arr.reduce((acc, cur) => acc * cur, 1)

console.log(res)
// 39479
```

でも新しいパスワードを設定してから、シャオバンくんはまた思い出しました。パソコンって二進数しか分からないんだっけ？

よし！じゃあまず、さっきの素数を二進数の対応表 Object に変換しましょう：

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

パスワードを素数の二進数の積に設定した件は、また別の話・・・

話を reduce に戻しましょう～

そう、私はたいてい initialValue を**単位元**に設定します。たとえば、足し算の単位元は 0、掛け算の単位元は 1。もちろん `[]` や `{}` もあります。そしてもちろん、**function** であってはいけないなんてルールもありません。

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
// これ誰が書いたの？名乗りなさい、絶対に殴らないから
```

では問題です。もし上の initialValue がなかったら、何が起きるでしょうか？

それは興味のある読者自身で試してみてください～

## いつ使うべきで、いつ使うべきでないか？

原則として、`forEach` や `map` で済むことには `reduce` を使わないようにしましょう。

その通り！`let` と `const` と同じで、`const` で済むなら `const` を使いましょう。

この頃、筆者は転職してからちょうど三ヶ月ほど経ちました。AI の波の中で、技術記事の更新はずいぶん減ったように思います。幸い、大半の記事は「AI っぽさ」を帯びておらず、この時代においてそれらはかえって貴重に思えます。

私自身も、AI を使って記事を書かないことを貫いています。忙しい時は書かないでおくほうをマシだと考え、AI で無理に出力することはありません。その分、文章がそれほど流暢ではないかもしれませんし、自分だけが面白がっている内輪ノリのネタも仕込んであります。

さて、ここまで書いてきました。最後まで付き合ってくれた読者は、reduce についてだいぶ理解できたのではないでしょうか。ここまで読んでくれた皆さん、ありがとうございます。

それではまた次回！👋

---

## Ref

- [Ecma Script](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.reduce)

> 免責事項

以上はすべて筆者自身の経験にもとづくもので、多少の主観が混じっているのは避けられません。参考程度にご覧ください。皆さんの経験のシェアや交流も大歓迎です。誤りがあればぜひご指摘ください。すぐに修正いたします。改めて、皆さんありがとうございます！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作は [クリエイティブ・コモンズ 表示 4.0 国際 ライセンス](https://creativecommons.org/licenses/by/4.0/) の下に提供されています。詳しくは [benben.me](https://benben.me) まで。
