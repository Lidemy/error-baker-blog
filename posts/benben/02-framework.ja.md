---
title: なぜフレームワークを使うのか —— 今まで聞いた中で一番良い答えは？
date: 2021-09-19
tags: [framework]
author: benben
layout: layouts/post.njk
image: https://www.saaspegasus.com/static/images/web/modern-javascript/2008-vs-2021.png
lang: ja
sourceLang: zh-TW
translationKey: benben/02-framework
permalink: /ja/posts/benben/02-framework/
draft: true
sourceHash: 84fa49b4397c0aca6b674b44ec27b0a2267d8d2ce97c03ee938351cf3fc96a31
---

<!-- summary -->
<!-- フレームワークは山ほどありますが、なぜフレームワークを使うのか考えたことはありますか？ -->
<!-- summary -->

![modern-javascript](https://www.saaspegasus.com/static/images/web/modern-javascript/2008-vs-2021.png)

> 画像出典：[https://www.saaspegasus.com/guides/](https://www.saaspegasus.com/guides/)

## はじめに

みなさんこんにちは！2021 年の Web フロントエンドも相変わらず多種多様ですね。もちろん私たちも右往左往しながら学んでいます。

筆者のプログラミングメンタープログラムも第 5 期の終盤を迎えました。みなさんの学習ルートはどんな感じでしたか？もしかすると古参の先輩方は、生の JavaScript から jQuery、そして三大フレームワークの時代までを一路に駆け抜けてきたかもしれません。その間にフレームワーク自体も多くのアップデートを経てきました（2016〜2021）。でも、たくさんの `フロントエンド短期マスター講座` の学習プロセスでは、JavaScript を学び終えた直後に React hooks や Vue 3 などに入ることがあります。JavaScript の作者が誰か知らない人も（しかも少なくないはず）、Netscape すら聞いたことない人もいて、ましてやフレームワークなんて……。「なぜ JavaScript を学ぶのか？」すら、うまく答えられないかもしれません。

こういう `なぜ` 系の质問に対して、筆者は歴史を掘り下げるのが好きです。歴史は当時の人の時代背景を教えてくれます。理解して少し分析すれば、だいたい自分なりの答えが導き出せます。そういう答えのほうが、面接官を誤魔化すための答えよりも、ずっと自分を納得させられます。

筆者はここで、フロントエンドフレームワークの視点から「なぜフレームワークを使うのか」を考えていきます。でも、たまにはそこまでこだわらなくてもいいかもしれません。哲学的な問題もありますから——例えば「人は何のために生きるのか？」と考え始めると、人生を疑い始めてしまいます。

## JavaScript 略史

**1995 年、偉大な Brendan Eich が JavaScript を発明しました。** 今年（2021）の 7 月 4 日は彼の 60 歳の誕生日でもあります。彼を悼む……のではなく！彼を祝福し、感謝しましょう。JavaScript を発明してくれたおかげで私たちには仕事があり、しかもとても分かりにくいこともたくさんあります。でも、大部分の人が分からないことを理解できれば、人と差をつけられます。正直、識別力としては悪くないので、面接でこれを問うのは理にかなっている気がします。

![Thanks for JS - meme](https://res.cloudinary.com/practicaldev/image/fetch/s--ZDtqrBOj--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://github.com/damiancipolat/js_vs_memes/blob/master/doc/js_thanks.png%3Fraw%3Dtrue)

> 画像出典：[https://dev.to/damxipo/javascript-versus-memes-explaining-various-funny-memes-2o8c](https://dev.to/damxipo/javascript-versus-memes-explaining-various-funny-memes-2o8c)

ありがとう、Brendan Eich さん、JavaScript を発明してくれて！ちなみに知らなかった人のために言っておくと、彼は写真の中のあの男です。

当時の時代背景はこうでした：**ブラウザ上で動くプログラムが必要だった。** 当時の **Netscape**（網景）が Brendan Eich にこの任務を割り当てました。ちょうど Java が大人気だったので、彼は知名度にあやかってこの言語を `JavaScript` と名付けました。実際には Java とは全く関係ありません（片方を覚えればもう片方もだいたい分かる、みたいな話はありません）。でも全く無関係というわけでもなくて、発明時に Java を「参考」してはいます。その後どの言語も互いに「参考」にし合ってきたので、書き方が似ているところは確かにあります。ここは各自で感じ取ってください。

その後 Brendan Eich が物議を醸したのは、また別の話です。

この時点の JavaScript はまだ純粋でした。はい、JavaScript 略史はこの辺で。

## jQuery の覇権と、群雄割拠のブラウザ

JavaScript が発明されると、Netscape のシェアも顺势で上昇し、一時はトップに君臨しました。当然、他のプレイヤーは羨ましがりました。当時はまだネットユーザーが少なく——子供でも分かる通り、巨大なブルーオーシャンだったのです！あっという間に Internet Explorer、Chrome、Firefox、Safari、Opera など、たくさんのブラウザが現れ、ブラウザ戦争が始まりました！子供は選ぶ、私は IE 一択！

でも良き時代は長くは続きませんでした。エンジニアが直面した問題は：**クロスブラウザ問題をどう解決するか。** 最初は、あらゆる書き方を全部書き下すというものでした。もちろん疲れますが、その分仕事も生まれましたよね？需要があれば機会がある、です。

**2006 年、jQuery が登場しました。** 一時は世界のトップ 10,000 サイトのうち 65% が jQuery を使っていたこともあります。クロスブラウザ問題を見事に解決し、一つの書き方で各ブラウザで動くコードに変換できました。良い library、使わない手はありませんよね？当時は library と framework の区別すらまだなかったかもしれません。とにかく問題は解決し、顧客も喜び、社長も喜び、あなたも大儲け——だからあなたも幸せ、と。

シンプルな jQuery の書き方はこうです：

```javascript
// jQuery
$("#hello")

// 原生 JavaScript
document.getElementById(hello)
```

なぜ jQuery を使うのか、もう自明ですね。タイピング量を減らせるだけでなく、上述のクロスブラウザ問題を解決できるのが一番のポイントです。でも実は、あなたは jQuery を必要としません。今のブラウザはサポート状況がとても良いことに加え、批判されがちなのがパフォーマンス問題です。昔の小さなプロジェクトでは気になりませんでしたが、ちょっとしたことにも jQuery を使おうとするのは間違っています。例えばネイティブの `document.getElementById` は jQuery よりずっと高速で、プロジェクトが大きくなるほど差は開いていきます。

> 関連読書：[You Might Not Need jQuery](https://youmightnotneedjquery.com/)

## Framework & Library

時が進み、2013 年に Facebook が React をリリースしました。当時としては非常に新しい技術でした。もちろん台湾で一定の開発者が使うようになるには、早くても 3 年はかかります。筆者は当時まだ学生で、学校がこんなトレンディなものを教えてくれるわけがありません。でも面接のハードルとしてはフレームワーク経験を求められます（~~いや、習ったことないし、学校も教えてくれないし~~）。そして確かにその時期（2016）には、多くの `フロントエンド短期講座` が雨後の筍のように現れ、未経験転職を掲げて誰でも歓迎という状態でした。でも実際のところ、その「誰でも」がその後どうなったかは誰も知りません。とにかく人を集めて大儲け、というわけです。

ここで「こういう人はエンジニアになるな」と言いたいわけではありません。むしろ、この道は表面上見えるほど簡単ではない、と言いたいのです。転職に成功した人たちは、あなたが見ていない膨大な時間と労力を注いでいます。もしそれでも意志が固いなら、挑戦してみてください。最悪でも 3〜6 ヶ月を無駄にするだけです。

話を React フレームワークに戻しましょう。[React の公式サイト](https://reactjs.org/)には `A JavaScript library for building user interfaces` と書かれています。おっと！つまり React はフレームワークではなく "Library" なんですね。エコシステム全体が合わさって初めてフレームワークになる、と。なるほど、これでもう分かりましたね！でも！初心者の私には、これでもまだ疑問だらけでした。では改めて私の质問です：じゃあ Library って何？

Library という言葉は、実は紀元前 2600 年にまで遡れ、シュメール人の楔形文字石板から作られた——いや、それは「図書館（library）」のことでした。実は合理的な説明が見つからなかったのです。この言葉はすでに抽象化されすぎて多くの意味を持っています。情報の少なさでは[中国語 Wikipedia のページ](https://zh.wikipedia.org/wiki/%E5%87%BD%E5%BC%8F%E5%BA%AB)を見てみてください。Library には Computing Library と Digital Library があり、ここで言いたいのは Digital Library の中でもコードを置くタイプの Library です——ちょっと！ややこしくなってきた！でも言いたいことは伝わりますよね。

視点を変えましょう。もしあなたが Web エンジニアなら、`npm` を使ったことがあると断言します。もしなかったとしても、全部手書きしているなら、あなたは神様ということにしておきましょう。npm は 2010 年に誕生しました。library という言葉が広く使われるようになったのは、その時期からと言っても過言ではないでしょう。でも多くの初心者にとっての Library とは、`npm install XXX` で使いたいパッケージをダウンロードすること、それだけです。はい、筆者もそうやって library という言葉を知りました。馴染みがあるようで、実はそれだけの言葉でした。

実は、function が書ければ Library も書けます。例えば：

```javascript
function add(a, b) {
  return a + b
}

// 或是已經沒這麼潮的寫法
const add = (a, b) => a + b
```

おめでとうございます、足し算の Library が書けました。概念はそれくらいシンプルです。

Library と Framework は、どちらも他人が書いたコードを使えるようにするものですが、違いは `自由度` にあります。抽象的な概念なので、レストランに例えましょう：

1. Library の書き方：食べたいものを自由に選べるし、飲み物だけでも OK。
2. Framework の書き方：セットメニューのように、メインはある程度選べるが、デザートは選べない。

これで両者の違いが少し分かったでしょうか。でも「自由度」という言葉も主観的です。例えば「React の自由度は Angular より高い」と言えば、多くの人が納得するでしょう。でも両方ともやはりフレームワークです（正確には React エコシステムと Angular）。

> 関連読書：[The Difference Between a Framework and a Library](https://www.freecodecamp.org/news/the-difference-between-a-framework-and-a-library-bd133054023f/)

React が（正確には）フレームワークでないとすれば、こう考えてみましょう：**React に何を足せば一つのフレームワークと言えるのか？**

`create-react-app` を使ったことがあり、`package.json` を見たことがあるなら、`react`、`react-dom` のほかにいくつかのテスト用パッケージなどが見えるはずです。それほど多くはなさそうです。でも私と同じように気になるなら、`node_modules` を開いて中にいくつのパッケージがあるか見てみてください。`webpack`、`babel`、`jest` のような有名所から、`uuid`、`dotenv`、`fast` のような小さな便利パッケージまであります。

webpack、babel、jest のような大きな Library があるからフレームワークと言えるのか？そうかもしれないし、そうでないかもしれない。私には分かりません。

> 関連読書：[Is React a Library or a Framework? Here's Why it Matters](https://www.freecodecamp.org/news/is-react-a-library-or-a-framework/)

### フレームワークを使うメリット

よくある答えは：

- 同じ機能を再利用でき、拡張も保守も容易
- Component とモジュール化
- 画面とデータの分離
- React は SPA の構築に使える
- React のエコシステムは成熟しており、ネット上の資源も非常に豊富
- アプリケーションのエントリーポイントを一つに保てる
- コミュニティの利用者が多い分、資源も豊富
- ……など

でも、これらの答えをよく考えると、どれも **結果** であって原因ではないかもしれません。論理をクリアにするには、因果関係を整理する必要があります。例えば、最初の 2 つはフレームワークとは全く関係ありません。これはどんなプログラミングでも気をつけるべきことです。

先ほども言ったように、注目すべきは「フレームワークが何を解決したのか」という点です。では、この時期にどんな問題が現れたのか見てみましょう。

当時の時代背景はこうでした：**2010 年、iPhone 4 が発売され、ユーザーがモバイルデバイスに大量に移行した。** この時、Web はデバイスサイズへの適応（RWD）だけでなく、より商業市場に近づく必要もありました。それは UI/UX がますます重要になることを意味します。ユーザーが増えるにつれ、より良い体験を提供しなければユーザーを留められません。フロントエンドとバックエンドの分離という概念も芽生え始めました。確かにこの魔法のタイミング（2010）から、大量のツールが登場し始めました。一番上の画像を覚えていますか？よく見ると、タイムラインが一致していることに気づくはずです。

この時点ではまだ完全な分離ではなかったかもしれません。この大きな変化に対応するため、フレームワークの原型が誕生しました。でも分離のやり方は一つではなく、MVC、MVP、MVVM といったモデルがよく知られています。だからフレームワーク同士にも小さな違いはありますが、すべて **フロントエンドとバックエンドの分離** を解決するためのものです。

ここまで来ると、答えが浮かんできます。なぜフレームワークが必要なのか？それはフロントエンドとバックエンドを分離するため。なぜ分離するのか？それはプロジェクトの規模が大きいから。

現在、大型プロジェクトのほとんどはフレームワークを使うので、企業が「少なくとも一つのフレームワークを学んで」と求めるのも、まあ理にかなっています。企業レベルのプロジェクトはたいてい大きいからです。今日のフレームワークはどれも前後端分離の問題を解決できるので、次はフレームワーク選びです。好きなモデル、パフォーマンス、ファイルサイズ、文法などに応じて、好きなフレームワークを選べばいい——もちろん一番大事なのは企業のニーズですが XD

## まとめ

フロントエンドは新しいものが次々出てきて、古いものも次々アップデートされて、もう追いつけません！

フロントエンド技術の発展を振り返ると、新しい技術やツールは常に問題の周りから生まれてきたことが分かります。でもここ数年は落ち着いてきた感があります。スマホ市場が飽和したのと同じように、フロントエンドも次第に形になり、今後大きな変化はないかもしれません。だからこそ、技術を把握できる今のうちに、手放さないようにしましょう！

最後に、みなさんと一緒に進歩していけたら嬉しいです！おかしな点や分かりにくいところがあれば、ぜひご指摘ください。ご覧いただきありがとうございました。

## Ref

- [You Might Not Need jQuery](https://youmightnotneedjquery.com/)
- [The Difference Between a Framework and a Library](https://www.freecodecamp.org/news/the-difference-between-a-framework-and-a-library-bd133054023f/)
- [Is React a Library or a Framework? Here's Why it Matters](https://www.freecodecamp.org/news/is-react-a-library-or-a-framework/)

> 免責事項

以上はすべて筆者自身の経験に基づくもので、主観が混ざるのは避けられません。参考程度にしていただき、経験の共有や交流も大歓迎です。
もし誤りがあれば、ご指摘ください。すぐに修正します。改めてみなさん、ありがとうございます！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作は[クリエイティブ・コモンズ 表示 4.0 国際 ライセンス](https://creativecommons.org/licenses/by/4.0/)の下に提供されています。[benben.me](https://benben.me) で見つけてください。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
