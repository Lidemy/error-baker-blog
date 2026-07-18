---
title: Raycast | 不完全マニュアル
date: 2025-07-31
tags: [raycast, ai]
author: benben
layout: layouts/post.njk
image: https://img.youtube.com/vi/NuIpZoQwuVY/0.jpg
lang: ja
sourceLang: zh-TW
translationKey: benben/15-raycast-101
permalink: /ja/posts/benben/15-raycast-101/
draft: true
sourceHash: cfcaead7ff5ab31c75aaee34d0e0ad1596c54ea0bd4742d52c9c674aa5758feb
---

<!-- summary -->
<!-- 友人のために書いた Raycast マニュアル！ -->
<!-- summary -->

**！本記事では Raycast を紹介します。いつもの通り、役に立つところだけ参考にしてください** ：D

[![](https://img.youtube.com/vi/NuIpZoQwuVY/0.jpg)](https://www.youtube.com/watch?v=NuIpZoQwuVY)

> Raycast 公式の 101 デモ

みなさんこんにちは、2025 年も半分以上過ぎようとしています、嘘でしょ！？前回記事を書いてから 1 年半経ちました 😱

今回は Raycast を書きます！これで前回の記事の穴埋めにもなりますね 🤣
Raycast は主に MacOS 向けです。現在 Window 版は Beta 中〜。

> （Ps. 現在筆者は Window の優先招待コードを 2 つ持っています。必要な読者はメールください〜）

今のところほとんどの機能は「無料」で使えるので、安心してダウンロードしてください。私は Pro を購読しているので、Pro の機能も併せてシェアします。当時 Pro 機能はまだシンプルで、例えば色をカスタマイズできる程度でした。なんてこと！買わないわけにはいきません！（<= 色やテーマのカスタマイズが超好きな人）。筆者はかなり早めに Pro を購読しました。

## インストール

元々 Raycast は Mac 標準の「Spotlight」を置き換えるソフトでした。しかしエコシステムの発展に伴い、明らかに Spotlight をはるかに超えました。Spotlight の機能に加え、さらに多くの機能、高いカスタマイズ性、自分で（React を使って）拡張機能を開発することもできます。

まず Raycast をインストール！

> 私の紹介リンクでインストールできます：[https://raycast.com/?via=benben](https://raycast.com/?via=benben)

そして **標準の Spotlight をオフにしてください**。そうすれば Raycast と Spotlight が衝突しません。両方とも `⌘` + `space` コマンドだからです。

オフにするには〜？

<center>
  <img src="/img/posts/benben/15-raycast-101/15-1.png" class="post-image-width" style="width: 480px" alt="図 1" />
</center>

<center>
  <img src="/img/posts/benben/15-raycast-101/15-2.png" class="post-image-width" style="width: 480px" alt="図 2" />
</center>

> こちらのハンズオンをご参考ください。

もちろん、Raycast に慣れなかったら、同じ手順で元に戻すこともできます〜。このステップまで来たら、完了です 🎊

まずは「アプリの起動」に使ってみてください。残りはゆっくり研究しても大丈夫です 👍

ちょっとした隙間時間に `⌘` + `space` を押して、開きたいアプリを検索！

<center>
  <img src="/img/posts/benben/15-raycast-101/15-3.png" class="post-image-width" style="width: 480px" alt="図 3" />
</center>

## 基礎

次に筆者がシェアするのは、簡単で便利な機能です〜。

### 1. Emoji

筆者はかなり Emoji をよく使う人です。多少伝わってるでしょうか 😂

> Tips: Mac 標準には Emoji ピッカーを開くショートカットがあります：`⌘` + `Ctrl` + `Space`。

でも標準機能はかなりシンプルです（えっ、2025 年だよ X）。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-4.png" class="post-image-width" style="width: 480px" alt="図 4" />
</center>

> 標準 Emoji ピッカーの介面

Raycast の `Search Emoji & Symbol` が使えます。Raycast の右下にはたいてい「使える操作」Actions が表示されます。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-5.png" class="post-image-width" style="width: 480px" alt="図 5" />
</center>

> Raycast Emoji ピッカーの介面

例えば、お気に入りの Emoji をピン留めできます。

> Pro Tips: `⌘` + `Ctrl` + `Space` を Raycast の `Search Emoji & Symbol` のショートカットに設定する。

### 2. クリップボード履歴

仕事で Copy/Paste することがよくあります。突然、昨日丁寧に書いたコピー文を使いたくなる — すごく時間をかけて書いたのに、どの深いフォルダに保存したか思い出せない。そんな時「クリップボード履歴」から探せたらいいのに、と思うでしょう。

そんな時、我らの親友 Raycast が助けてくれます！

<center>
  <img src="/img/posts/benben/15-raycast-101/15-6.png" class="post-image-width" style="width: 480px" alt="図 6" />
</center>

### 3. Change Case

命名は難しい、特にフロントエンドとバックエンドの連携では。バックエンドは言語が違うため命名の伝統も違い、バックエンドのドキュメントをもらうと命名がバックエンドのやり方になっていることがあります。ある Case を別の Case に変えたくなります。

Raycast の `Change Case` が使えます。

例えば：`UserMessageId` を選択し、`Change Case` 機能を使います。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-7.png" class="post-image-width" style="width: 480px" alt="図 7" />
</center>

> Change Case 機能

### 4. Snippet

この機能はコーディングの世界でよく使われます。中国語にどう訳すか分からないので、引き続き Snippet と呼びます。簡単に言うと「再利用可能な斷片」ですが、コードに限らず、どんな文字でも OK です。

例えば、よくある会社情報。

```md
Error Baker 有限公司
地址：太陽系 地球星球
電話：666-666-666
網站：https://blog.errorbaker.tw/
```

- まず再利用したい文字をコピー
- `Create Snippet` で新しい Snippet を作成
- Keyword を設定、Trigger として

<center>
  <img src="/img/posts/benben/15-raycast-101/15-8.png" class="post-image-width" style="width: 480px" alt="図 8" />
</center>

設定後、次に「@error-baker;」と打つと、上の文字列が出力されます 🧙

> Pro Tips: Snippet の「先頭」と「末尾」を設定して、意図しない Snippet の発動を防ぐ。

### 5. Kill Process

Raycast はアプリを終了するのにも使えます。バックグラウンドアプリを含みます。ハングしたアプリを終了するのに便利です。Raycast の `Kill Process` 機能を開くと、現在のプロセスが表示され、「CPU」や「RAM」使用量でソートできます。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-kill-process.png" class="post-image-width" style="width: 480px" alt="図 kill process" />
</center>

## Store

Store と呼ばれていますが、すべて `無料` の「Raycast 拡張」です。公式のものもあれば、他の開発者が作ってシェアしたものもあります。筆者は時々覗いて、人気のある拡張を試しています。

例えば筆者は以下を入れています：

- サードパーティアプリ：Spotify、Arc、Brew
- 生産性ツール：Timer、Color Picker、Year in Progress、Scan QRcode
- 開発関連：Lorem Ipsum、Test Internet Speed、TinyPNG

気に入るものがなければ、自分で拡張を開発することもできます。もちろん、素晴らしい Raycast 拡張を書いたら、シェアして他のユーザーにダウンロードしてもらうこともできます！

> 関連読書：[Raycast の Store](https://www.raycast.com/store)

## ウィンドウ管理

現在フォーカスしている APP を左や右に 50% 分割配置できます。よくあるシーン：

- 半分でコードを書き、半分でプレビューを見る
- 半分でオンライン講座を見て、半分でメモを取る
- ……など

Raycast の `Left Half` と `Right Half` を開いて機能をトリガーできます。

ショートカットも使えます：

- 左へ `Ctrl` + `Opt` + `←`
- 右へ `Ctrl` + `Opt` + `←`
- > 上記は循環設定も可能：1/2、2/3、1/3
- 中央に拡大 `Ctrl` + `Opt` + `Enter`
- 大きく `Ctrl` + `Opt` + `+`
- 小さく `Ctrl` + `Opt` + `-`

以上はすべて無料の機能です！

Pro なら、開く APP をよりカスタマイズして設定できます〜。

例えば、以下を一度に行う：

- 左 50% を VS Code に
- 右 50% を Arc にし、**「localhost:3000」を開く**

そしてこの設定（Layout）を保存します。もっと多くの APP を一度に開くようにも設定できます。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-layout.png" class="post-image-width" style="width: 480px" alt="図 layout" />
</center>

次回は「一つのコマンド」で開けて、さらに速く社畜モードに入れます。素晴らしいでしょう？

## AI 機能

無料でも AI クレジット機能がいくつか使えます。かなり佛心です。現在（投稿時 2025/07/25）は **50** 回で、以下の Raycast AI 機能が使えます！

### 1. Raycast AI（Pro 購読が必要）

これは ChatGPT の機能を Raycast 上で使えるものです。筆者はフロントエンドエンジニアで、ほぼ常にパソコンを開き、ブラウザも開いていますが、それでももう一つタブを開いて ChatGPT の URL を開くのは少し遅く感じることがあります。簡単な質問なら、わざわざ大げさにする必要もない。そんな時は Raycast AI 機能がかなりいいです〜

同じように Raycast を開き、質問を入力し、`Tab` を押すと、ChatGPT のように使えます〜

### 2. Translate（Pro 購読が必要）

筆者は英語があまり得意ではなく、翻訳機能がよく必要です。ドキュメント、メール、同僚とのやり取りなど。もちろん Google 翻訳は便利ですが、上の ChatGPT と同様、多くの場合、素早く翻訳が欲しいだけで、ディテールはいりません。もちろん！専用のブラウザータブを開きたくない（これ重要）。

これも便利な Action をチェックしましょう。筆者がよく使うのは、入れ替え（`⌘` + `S`）、言語切替（`⌘` + `P`）などです。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-translate.png" class="post-image-width" style="width: 480px" alt="図 layout" />
</center>

> Translate 機能

### 3. Fix Spelling and Grammar（Pro 購読が必要）

英語を書く必要がある時があります。メール、README、外国の同僚とのコミュニケーションなど。文法が正しくなくて誤解を招くのはよくありません。`Fix Spelling and Grammar` 機能を使って：

- 綴りと文法を修正：`Fix Spelling and Grammar`
- 文を長く：`Make longer`
- 文を短く：`Make shorter`

> 他は設定の AI 機能を参考にしてください。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-ai.png" class="post-image-width" style="width: 480px" alt="図 layout" />
</center>

## まとめ

そう、小さな機能を置き換えていくと、一つの介面でできることは、わざわざ別の APP やタブを開く必要がなくなります。Color Picker 機能も Raycast で使えるので、関連する APP は削除しました。失うこともまた引き算の哲学です。

この不完全マニュアルはここまで〜。もちろんこれは一部の機能にすぎません。残りは読者の皆さんが発掘してください！クールな使い方があれば、下にコメントして交流してくださいね！

ここまで読んでくれた皆さん、ありがとうございます。自分に拍手を 👏🏼

> （Ps. 現在筆者は Window の優先招待コードを 2 つ持っています。必要な読者はメールください〜）

そうだ！Raycast には Conffetti（紙吹雪）機能もあります 🎊

<center>
  <img src="/img/posts/benben/15-raycast-101/15-wrapped.gif" class="post-image-width" style="width: 720px" alt="図 15-wrapped" />
</center>

> Conffetti 機能。ただし Raycast の拡張を先にダウンロードする必要があります。

さて〜、一日忙しくして、パソコンを Sleep させます（謎の声：Mac ユーザーはめったにシャットダウンしないそうです）。

手慣れた様子で Raycast を開き、「Sleep」と入力して `Enter` を押す。

また無事に一日が過ぎました。Raycast の努力に感謝！

また次回！ 👋🏼

## Ref

- [Raycast](https://raycast.com/?via=benben)
- [Raycast の Store](https://www.raycast.com/store)
- [Raycast 101 | 公式 Youbube](https://www.youtube.com/watch?v=NuIpZoQwuVY)

> 免責事項

以上はすべて筆者自身の経験に基づくもので、主観が混ざるのは避けられません。参考程度にしていただき、経験の共有や交流も大歓迎です。
もし誤りがあれば、ご指摘ください。すぐに修正します。改めてみなさん、ありがとうございます！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作は[クリエイティブ・コモンズ 表示 4.0 国際 ライセンス](https://creativecommons.org/licenses/by/4.0/)の下に提供されています。[benben.me](https://benben.me) で見つけてください。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
