---
title: Uno CSS —— 天下を統一する明日のスター？
date: 2022-05-18
tags: [CSS, unoCSS]
author: benben
layout: layouts/post.njk
image: https://i.imgur.com/XRsgu8H.png
lang: ja
sourceLang: zh-TW
translationKey: benben/06-uno-css
permalink: /ja/posts/benben/06-uno-css/
reviewedBy: benben
reviewedAt: 2026-07-18
publishedAt: 2026-07-18
sourceHash: b5ee1c9e34372faa2e9cf2d9e614e8e4fa83178ca4eef4b4f6b18d5208d4530c
---

<!-- summary -->
<!-- Uno CSS で CSS の世界を統一！？ -->
<!-- summary -->

## Intro

はいはい！また私です！

以前受けた小さな案件も、いよいよ終了します！嬉しい嬉しい。無事に終わるといいな。そうすれば Error Baker を書く時間がもっと増えるから！

ではさっそく本題に入りましょう。今回シェアするのは：**Uno CSS**！

<center>
  <img src="https://i.imgur.com/LQrk0DN.png" class="post-image-width" alt="uno css logo" />
</center>

> 画像出典：[Uno CSS Github](https://github.com/unocss/unocss)

簡単に言うと、**Tailwind** の代替となる CSS ソリューションで、面倒な設定は一切なし（~~別に Tailwind の設定が面倒だとは言ってないですよ~~）。すぐに使い始められます。「Tailwind のパクリじゃん」と言えるかもしれませんが、もっと強力な機能、例えば `正規表現` による設定などもあります（ここはひとまず置いておきます）。この記事を読めば、少し見方が変わるかもしれません！

現在のフロントエンドの三大フレームワークに比べると、CSS の書き方は百種類以上あります（SASS/SCSS、Bootstrap、Tailwind、WindyCSS、CSS in JS シリーズなど）。じゃあ Uno CSS を学ぶべきかどうか？それは人それぞれだと思います！でも、もしあなたが既に Bootstrap や Tailwind を知っているなら、Uno CSS の学習はとても **直感的** です。なぜなら Uno CSS はこれらの慣用的な書き方を統合しているからです！

少し心動かされましたか？それともまだ迷ってる？では筆者が作者を少し紹介しましょう：[antfu (Anthony Fu)](https://github.com/antfu)。Vue エコシステムに詳しい読者なら絶対に彼の名を聞いたことがあるはず。彼は Vue と Vite のコアメンバーであり、Windi CSS や VueUse の開発者の一人です。私も Vue を学び始めてから彼を follow するようになりました。大人物は本当に狂気じみていて（褒め言葉）、いつか antfu 大先生についての記事も書きたいと思っています。

## TL;DR

> エンジニアになると学ぶ流行り言葉：Too Long; Didn't Read。

Uno CSS は学習しやすいと言いましたが、どういうこと？Tailwind を例に挙げましょう。Tailwind に触れたばかりの開発者（熟練の開発者でさえもよく直面する）が、開発中に必ずぶつかる挫折があります。

例えば：

> in tailwind css

```html
<div class="w-25"></div>
<!-- error!: no `w-25` class -->
<!-- notice!: this `w-25` class mean 6.25rem, because 1 : 0.25rem in tailwind -->
```

まず、tailwind には `w-25` という class はありません。なぜなら通常は 2 の倍数で、1, 2, 3, 4, 5, 6, 12, 24, 48, 60, 96……など（もしかすると抜けがあるかも）。注意すべき点として、ここの `w-25` は `6.25rem` の幅を指します。tailwind では w の単位が `1 : 0.25rem` だからです。

さらに、よくある状況として、数字が何の単位を表しているのか分からないことがあります。同じ例で言うと：`w-25` の 25 は何の単位？%？px？rem？0.25rem？ドキュメントを見るか tailwind のプラグインを入れないと分かりません。しかもユーティリティによって単位が違うので、`m-4`、`border-3`、`text-lg`、`shadow-sm` がそれぞれどれくらいか、見ただけで言い当てられますか？もし即答できるなら、筆者から拍手を送ります。

最後に、どうしても `w-25` という class を使いたい場合はどうすればいい？ドキュメントを掘って設定ファイルを探し、設定を山ほど追加しないといけません。一つ追加して気持ちいい、どんどん追加してずっと気持ちいい、でも最後にはあなたの設定ファイルが自分で書く CSS より長くなるかもしれません。その時あなたは必ずこう思うでしょう：「なんで tailwind 使ってるんだ？自分で書いたほうがマシじゃん」。これは初心者の筆者がよく直面する状況です。でも慣れてくればどんどん改善されます！

一方、Uno CSS の場合を見てみましょう：

> in uno css

```html
<div class="w-25"></div>
<!-- ok!: auto generate `w-25` class -->
<!-- notice!: this `w-25` class mean 6.25rem, uno css take care this for us -->

<!-- If I want to `25px` width -->
<div class="w-25px"></div>
<!-- ok!: auto generate `w-25px` class -->
<!-- notice!: this `w-25px` class mean 25px, uno css take care this for us without other syntax -->

<!-- If I want to `25rem` width -->
<div class="w-25rem"></div>
<!-- ok!: auto generate `w-25rem` class -->
<!-- notice!: this `w-25rem` class mean 25rem, uno css take care this for us without other syntax -->
```

Uno CSS を使えば、上記の問題が全部解決します：数字の問題、単位の問題、設定ファイルの問題。

（Uno CSS を使い始めてから、コーディングはいつも 100 点ですよ！）

筆者は初めてこの状況に出会ったとき、本当に驚きました。これはどんな魔術だ！

ではもう少しいじってみましょう：

> in uno css

```html
<div class="w-777"></div>
<!-- ok!: auto generate `w-777` class -->
```

![uno css class](https://i.imgur.com/4Rnomte.png)

> 画像出典：筆者の VS Code。

ふざけんなってレベルです！設定ファイルゼロ、自動生成！

では `77777777777777` はどうなるか試してみます？こちらは興味のある方にお任せします。とりあえず `77777777777777` をば。

実はこれ、別に魔法ではありません。聡明な読者の皆さんはもうお気付きでしょう。「**正規表現**」です！正規表現を足したのです。

> 関連読書：[簡易 Regular Expression 入門指南 - Huli（中国語）](https://blog.huli.tw/2020/05/16/introduction-to-regular-expression/)

## Efficacy

上記の正規表現の機能だけで、もう私の心を掴むには十分です！実は自動推論の機能は Windi CSS にもありましたが、Uno CSS はパフォーマンスの面でも神がかった速さです！

他のツールとのベンチマークを見てみましょう：

```md
3/26/2022, 11:41:26 PM
1656 utilities | x50 runs (min build time)

none 12.42 ms / delta. 0.00 ms
unocss v0.30.6 20.98 ms / delta. 8.57 ms (x1.00)
tailwindcss v3.0.23 1621.38 ms / delta. 1608.96 ms (x187.79)
windicss v3.5.1 1855.86 ms / delta. 1843.45 ms (x215.16)
```

> 出典：[uno css github](https://github.com/unocss/unocss)

うわ！この速度、他を完全にぶっちぎっていますね！

でも `Uno CSS` は非常に控えめ（？）で、[uno css github page](https://github.com/unocss/unocss) にはこう書かれています：`Inspired by Windi CSS, Tailwind CSS, and Twind, but: ...`

「X が Y を殺した」とか「最強の CSS Library」とか言ったりしません（~~謎の声：PHP こそ最強のプログラミング言語~~）。

それどころか、Uno CSS は **他のよく使われる CSS Library の CSS スタイルまで統合** しています！

例えば：ml-3（Tailwind）、ms-2（Bootstrap）、ma4（Tachyons）、mt-10px（Windi CSS）が全部使えます！

> in Uno CSS

```css
.ma4 { margin: 1rem; }
.ml-3 { margin-left: 0.75rem; }
.ms-2 { margin-inline-start: 0.5rem; }
.mt-10px { margin-top: 10px; }
// all works!
```

だからこそ筆者は、Tailwind や Bootstrap を学んだ人は Uno CSS の学習が早いと言ったのです。あなたは既にいくつかのスタイルの書き方に慣れているからです。でも `Bootstrap だけ知っていてから Tailwind を学ぶ`、あるいは `Tailwind だけ知っていてから Bootstrap を学ぶ` と、余分な学習コストがかかります！ツールによって書き方が微妙に違うからです。

## Document

良い Library にドキュメントがないはずがありません！

ドキュメントの良し悪しは DX（develop experience）にも影響します。良い DX は実はとても重要です！

エンジニアが楽しくコードを書けばバグは減る；
バグが減れば、ユーザー／顧客は喜ぶ；
ユーザー／顧客が喜べば、社長も喜ぶ；
社長が喜べば、あなたは昇給する（~~しません~~）。

DX の点では Vue エコシステムは総じて優秀です。例えば Vite（Vue エコシステムの開発ツールで、React など各大フレームワークもサポート）。これ、使ったら戻れません。開発が信じられないほど速い！Vite には Ruby や Laravel をサポートするパッケージすらあります。

> 関連読書：[Vite](https://vitejs.dev/)、本当に使ってみない？（~~どうしても使いたくないなら、まあ仕方ないですね XD~~）

また、Vue の公式サイト — [Vue](https://vuejs.org/) はダークモードをサポートしました（2022/02 頃から）！最高！

React の公式サイト — [React](https://reactjs.org/) は現在 React `18.1.0`（2022/05 頃）時点でもダークモードがありません（~~React のドキュメントをめくるたびに目に刺さります~~）。公式サイトは少し outdated 感もあります（でも書き方は悪くないです）。React を学び始めた開発者はみんな頭を抱えているはず。class component を先に学ぶべきか、function component + hooks を先に学ぶべきか？経験したことのある方は、本当に言葉にできない苦しみだと分かるはず！ここは読者の皆さんで察してください（本当は JavaScript を先にしっかり学ぶべき？）。

はい、ここらで止めておきましょう。でないと戦争が始まってしまいます。

実はどちらの公式サイトもコンテンツは悪くなく、詳細に書かれています。本気でドキュメントを読み終えれば、だいたいキャッチアップできるはずです（ただし本気であることが前提。そうでなければチュートリアルを探すほうが時間の節約になります）。

話を今回の Uno CSS のドキュメントに戻しましょう。

![uno css document](https://i.imgur.com/sdBwpo0.png)

> 画像出典：[UnoCSS Interactive Docs](https://uno.antfu.me/)

実はドキュメントも最近 Beta になったばかりです。開いてみると非常にシンプル。派手なエフェクトも、大げさな見出しもなく、とても直感的。探したいものを探すだけ。なんだか Google みたい（？）。

先ほどの `w-25` class を調べてみましょう……

![uno css document search](https://i.imgur.com/qKurIGO.png)

> 画像出典：[UnoCSS Interactive Docs](https://uno.antfu.me/)

検索結果が出ると、一番重要な `width: 6.25rem` のほかに、`regex` の使い方、リンク、さらには `MDN` へのリンクまであります。全部統合されています！

本当に今までで一番 DX 体験に優れたドキュメントです。開発時間が惜しければ、欲しい情報を見つけたらすぐ離脱して OK。時間があれば、CSS の原理を深く理解したり、regex の使い方を復習したりできます。本当に暇で死にそうなら（~~どの会社か教えてください~~）、`random` ボタンを押してみるのも一興です。

## Summary

フロントエンドの道のりで、React を学んでいたはずが、いつの間にか Vue みたいになっていました。でもそれは良いことだと思います。両方のテクニックを同時に学べるし、どちらが良い悪いではなく、長所短所を比較できます。フロントエンドのような急速に発展する分野では、オープンなマインドを保つことが重要です。フレームワーク論争をする人はたいていその一つしか知らないものです。各フレームワークを極めた人が「これが最高」と言うのは見たことがありません。それぞれに異なる `trade off` があり、どのフレームワークを使うかを議論するのは、もはや空しいテーマでしょう。HTML を学んだから CSS を学ばない、とは言わないのと同じで、どちらを先に学ぶか、どこまで深く学ぶか、というだけの話です。

現状（2022/05 時点）では **React のほうが使用者が多く、給料も高い** のは事実です。でも **ドキュメント、DX 体験、そして包容力においては Vue は本当に申し分ありません**。しかも Vue は巨大企業の支援もなしにここまで来ており、驚くほかありません。Vue の作者（尤大大）のポストにすら、たまに React 派からの `Why not React?` のようなコメントがつきます。

`Uno CSS` に話を戻すと、当時の Vue の面影が少しあります。成長性が非常に高く、明日のスターになる可能性を十分に秘めています。良いツールはもっと多くの人に知られるべきだと思います。ただしソフトウェアの世界に **銀の弾丸はない** ので、使うかどうかは人次第です。

では一番重要な点：`Uno CSS` は Production で使えるのか？現時点では正式版ではなく、最終的な API が変わらない保証もありません。でも小さなプロジェクトで試すことはできます。筆者も自分の小さなプロジェクトで使ってみて、開発体験がとても良かったからこそこの記事が生まれました。`Uno CSS` の安定版リリースをとても楽しみにしています！

個人的には、使う使わないに関わらず、注目しておく価値があると思います。もっと知りたければ、`Uno CSS` 作者の AntFu が書いた [重新构想原子化 CSS](https://antfu.me/posts/reimagine-atomic-css-zh) を非常におすすめします。`Uno CSS` を使わないとしても、多くを学べるはずです。

## Ref

- [UnoCSS Interactive Docs](https://uno.antfu.me/)
- [Windi CSS](https://windicss.org/)
- [Bootstrap](https://getbootstrap.com/)
- [Sass](https://sass-lang.com/)
- [簡易 Regular Expression 入門指南 - Huli](https://blog.huli.tw/2020/05/16/introduction-to-regular-expression/)
- [Vite](https://vitejs.dev/)
- [重新构想原子化 CSS](https://antfu.me/posts/reimagine-atomic-css-zh)

> 免責事項

以上はすべて筆者自身の経験に基づくもので、主観が混ざるのは避けられません。参考程度にしていただき、経験の共有や交流も大歓迎です。
もし誤りがあれば、ご指摘ください。すぐに修正します。改めてみなさん、ありがとうございます！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作は[クリエイティブ・コモンズ 表示 4.0 国際 ライセンス](https://creativecommons.org/licenses/by/4.0/)の下に提供されています。[benben.me](https://benben.me) で見つけてください。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
