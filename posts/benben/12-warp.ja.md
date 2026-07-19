---
title: Warp | あなたの 21 世紀 AI ターミナル
date: 2023-05-31
tags: [Warp, Terminal, AI]
author: benben
layout: layouts/post.njk
image: https://hackmd.io/_uploads/HJsA77LE3.gif
lang: ja
sourceLang: zh-TW
translationKey: benben/12-warp
permalink: /ja/posts/benben/12-warp/
reviewedBy: benben
reviewedAt: 2026-07-18
publishedAt: 2026-07-18
sourceHash: dc6efe8097e148c5a389f5c80b1e859ba58b04ec0ae64cac12d66141d22cf35a
---

<!-- summary -->
<!-- この時代に、まだ従来のターミナルを使って、いろんな config を設定しているんですか？ -->
<!-- summary -->

**！本記事では便利な開発ツール Warp —— AI ターミナルを紹介します。皆さんが爆速で開発できることを願って** :D

## はじめに

<center>
  <img src="https://hackmd.io/_uploads/HJsA77LE3.gif" alt="warp-demo" class="post-image-width" />
</center>

> Warp demo by myself

本記事を読む前に、`terminal` が何かを知っておくのがベストです。現在 Warp は Mac 版しかリリースされていないので、読者の方は判断してください。プロ、业余、転職中、誰でも読めます。または、筆者なりの簡単な分類もあります：

1. level 1: `ls`
2. level 2: `ls -al`
3. level 3: `ls -altr`

小さなクイズ。ググらずに、上記のコマンドの用途を知っていて、パラメータの意味も分かりますか？あなたはどのレベルに当てはまりますか？どれかを選んだなら、おめでとうございます、本記事は楽に読めるはずです。

あなたにも **AI 焦り** と **ツール焦り** がありますか？何でも AI、ツールが次々と出るこの時代、「AI ツール」だけは事欠きません。中にはちょっと便乗しているだけのものも多く、出たばかりの時は確かに新鮮ですが、エンジニアとして長く見ていると、何で作られているか見え、裏に LLM（Large Language Model）をくっつけているだけだと分かります。代表的なのは ChapGPT-3/4、BERT、XLNet などです。

だとすれば、この `Warp` ターミナルも AI をくっつけただけのターミナルなのでしょうか？続きをどうぞ〜。

もちろん違います！そうでなければ筆者はこの記事を書いていませんよね？まずは簡単な比較表から：

| 機能                   | Warp            | Window Terminal    | iTerm2             |
| ---------------------- | --------------- | ------------------ | ------------------ |
| パーソナライズ         | ⭐️⭐️⭐️          | ⭐⭐               | ⭐                 |
| 入出力の簡単コピー     | ⭐⭐⭐          | ⭐                 | ⭐                 |
| Auto Completion        | 開封即利用      | インストール＋設定 | インストール＋設定 |
| ショートカットチート   | 内蔵（cmd + /） | 別途探す           | 別途探す           |
| タブ、ペイン分割       | O               | O                  | O                  |
| AI                     | O               | X                  | X                  |
| マウス使用可           | O               | X                  | X                  |
| cmd + a/z/x/c/v 使用可 | O               | X                  | X                  |

本記事では Warp の紹介といくつかの感想をお話しします。おおまかな構成：

- [はじめに](#はじめに)
- [紹介とインストール](#紹介とインストール)
- [パーソナライズ](#パーソナライズ)
- [使い方と AI](#使い方と-ai)
- [感想・おすすめ](#感想おすすめ)
- [Ref](#ref)

## 紹介とインストール

公式サイトを見てみましょう。結構よくまとまっています（英語が OK ならそのまま読んでも）。ドキュメントも明快です。筆者が使い始めた頃（2023/02 頃）はまだ Live Demo 動画がなく（約 2023/04 に更新）、ドキュメントを読みながら自分で遊んで探るしかありませんでした。後で気付きましたが、もうしばらく前から出ていて、2021 年にはリリースされていた（公式 YouTube チャンネルより）ようです。このところ話題になっているようですね。もちろん `Rust` で開発されているのもイケてます。筆者は他の Tech Youtuber の紹介で偶然見つけました。

<center>

[![Warp official demo](https://img.youtube.com/vi/XWQY8LgkiXM/0.jpg)](https://www.youtube.com/watch?v=XWQY8LgkiXM)

</center>

> 関連読書 [Warp](https://warp.dev)

ただし **現在 Mac プラットフォームのみ** ダウンロード可能。`Window`、`Linux` などの読者はもう少し待つ必要があります。

ただ先に断っておくと、これはタイアップではありません（Warp さん、見てたら検討してください、おい！）。でも warp 公式にも小さな紹介プログラムがあり、10 人紹介すると T シャツがもらえるようです（leetcode の T シャツよりずっと取りやすい）。ただ着ると Nerd すぎて彼女ができないとかどうかは、筆者には言えません（汗）。記事を読んで興味を持ったなら、筆者のリンクを使っていただけると嬉しいです。

<center>
  <img src="https://hackmd.io/_uploads/r1Atcp24n.png" alt="warp-referral" class="post-image-width" />
</center>

> 紹介リンク：<https://app.warp.dev/referral/VLL959>（お願いしますお願いしますありがとうございますありがとうございます 🥹）

個人利用なら費用は一切かかりません。クレジットカードを入力する必要もなく、アカウント登録だけで使い始められます。

筆者にとってのメリット：

1. 教え合いながら学ぶ、新しい知識のシェア
2. Warp の機能をより深く研究できる

あなたにとってのメリット：

1. クールなターミナルを手に入れ、同僚がこっそりあなたの作業を覗き見する（それはそれで微妙？）、話題の中心に
2. AI で作業効率アップ、例えば Git、Vim コマンドなど

ただ以前、友達におすすめした時はまだ紹介プログラムがあることを知らず、読書会で何人かにおすすめしてしまいました（うう）。後で、まあどうせおすすめするなら、ちゃんと記事を書こうと思い、今後友達が興味を持ったらライブデモをもう一度しなくても記事を送れば済むようになる（Don't repeat yourself 原則）と思ったのです。

でも実際、紹介プログラムの有無に関わらず、筏者はもともと便利なツールをシェアする人です。読者が入れるかは人次第、入れ方も筆者の管轄外。仏のようにのほほんとおすすめする感じです。

インストールは、公式サイトで `Download Now` をクリックして、通常通りインストールするだけです。インストールと登録が終わると、筆者の表紙画像のような画面が表示されます（設定やテーマは多少異なるかもしれません）。

## パーソナライズ

- 外観

内蔵テーマが複数あり、**気に入らないものがあれば自分でデザインすることもできます**。公式の完全なチュートリアルもあり、自由度は抜群。もちろんフォントやサイズも設定できます。特筆すべきは、**透明度や Blur 効果** も直接設定できること。以前 Windows（あの無愛想な白黒ウィンドウ）でかなり苦労しましたが、後に [`Window Terminal`](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701) に変えて内蔵設定が使えるようになりました。

<center>
  <img src="https://hackmd.io/_uploads/H1JZmAn43.png" alt="warp-setting" class="post-image-width" />
</center>

> Warp 設定ページ

テーマ設定については、公式のものはどれもまあまあ良いと思います（他の内蔵テーマと比べれば本当にまあまあ）。目に合うものを選べばいいです。フォントのデフォルトも見栄えが良い（デフォルトは Hack）。まだ機能の話に入っていない、外観だけですが、これだけで筆者の心を掴むのに十分です XD。

- Configuration

Warp は **ゼロ設定（Zero Configuration）** を謳い、開封即利用。別途設定やパッケージのインストールは不要で、`.zshrc` や `.bashrc` をずっとバックアップする必要もありません。

よく使う機能をいくつか試しましょう：

**自動パス補完**: ルート `/` で `cd` を入力 + `Tab` を押すと現在のフォルダが表示され、上下で切り替え、`Enter` で自動補完されます。

<center>
<img src="https://hackmd.io/_uploads/BkqDHA2N3.png" alt="warp-setting" class="post-image-width" />
</center>

> 開封即利用 | 自動パス補完

**Git コマンド**: `git log` と入力 + `Tab` を押すと、現在使えるコマンドが表示され、上下で切り替え、`Enter` で自動補完されます。

<center>
  <img src="https://hackmd.io/_uploads/BkKMUA24h.png" alt="warp-setting" class="post-image-width" />
</center>

> 開封即利用 | 自動 Git コマンド補完

もちろんもっと強力な機能がたくさんあります。筆者は全部はデモしません。[Warp が対応しているコマンド](https://docs.warp.dev/features/completions)も参照してください。

## 使い方と AI

- 一般のターミナルとして使う

もちろん通常のターミナルと同じように使えます。`ls` のような通常の Linux コマンドがそのまま使えます。他のクールな機能が不要なら、通常のターミナルとして使えば OK。でもそれなら Warp の必要はないかもしれません（笑）。

- タブ

筆者は昔からタブ機能がとても便利だと思っていました。昔のターミナルになかったのか、私が使い方を知らなかったのかは分かりませんが。とにかく昔はターミナルを複数開こうとするとアプリを複数起動していました。たくさん開く（docker、フロントエンド、バックエンド、日常用など、それぞれターミナルを 1 つずつ）と、探し回る羽目に。そういう時、統合されたターミナルがあればいいのにと思っていました。

ありました。当時筆者が見つけたのが `Window Terminal` です。当時も複数のターミナルを統合できることを売りにしていました。Windows ユーザーなら検討の余地があります。従来の cmd ウィンドウや PowerShell の様々な問題があるので最初は悪い印象を持ちがちですが、Warp もまだ Windows をサポートしていないので、まずは `Window Terminal` を試してみてください。筆者も以前、社内の読書会で友達におすすめしたことがあります。

Warp でのタブ操作はシンプルで直感的：

1. `cmd + t` を押して新しいタブを開く
2. `cmd + shirt + [` を押して左に切り替え
3. `cmd + shirt + ]` を押して右に切り替え
4. `cmd + w` を押して現在のタブを閉じる

基本的には VS Code の操作とほぼ同じです。慣れていれば特に覚え直す必要はありません。

- ペイン分割

ここの `ペイン分割` は上の `タブ` とは全く別の機能で、使い始めた頃によく混同していました。これも `Window Terminal` にある機能ですが、Warp には内蔵のショートカットがあり簡単に使えます。自分の好きなショートカットも設定できます。デフォルトも覚えやすいです。

Warp でのペイン分割操作：

1. `cmd + d` を押して水平ペインを開く
2. `cmd + shift + d` を押して垂直ペインを開く
3. `cmd + option + 上下左右` で Warp 内の分割ペインを素早く切り替え

- AI 機能

この時代、何にでも AI が必要なようですが、もう当たり前になりましたね。Warp ももちろん内蔵の AI が使えます。

コマンド入力欄の先頭に `#` を付けるだけで検索モードに入れます。あとは調べたい内容を入力すれば、AI で簡単にコマンドを検索できます。例えば：

<center>
  <img src="https://hackmd.io/_uploads/HJsA77LE3.gif" alt="warp-demo" class="post-image-width" />
</center>

> 上の画像では、ファイルを Git から削除する方法（How to remove file from git）を調べています。

あまり使わないコマンドは本当に忘れがちです。ブックマークの奥に隠れた git cheat sheet を掘り起こしたり、stack overflow を漁ったりするのは時間の無駄に感じます。そういう時 Warp が役立ちます。読者も Warp の威力を一度体験してみてください。

もちろん、もっと複雑なケースでは、さらに高度な検索を試せます。

Warp の右上の **雷アイコン** をクリックして高度な AI 検索パネルを呼び出すか、ショートカット `ctrl` + `shift` + `space`（デフォルト）を押します。他の App に上書きされる可能性があるので注意。設定でショートカットを変更することもできます。

これで AI に検索させるためのプロンプトをたくさん入力できます。ただしここの検索には **1 日 100 回** の制限があり、翌日にリセットされます。Chat-GPT も Chat-GPT 4 を課金しているので、まあ納得です。

高度な検索はどんどん活用しましょう。回数を使い切っても心配無用。上記の `#` を使う **通常検索は回数制限なし** です。安心して使えます！

## 感想・おすすめ

おすすめとはいえ、筆者は本当に Warp が好きです。様々なパーソナライズ設定、たくさんの便利な内蔵機能、AI サポート。いいツールはおすすめします。Warp は個人利用は無料ですが、現在（2023/05）は Mac OS プラットフォームのみです。今後他のプラットフォームもリリースされるはずなので、興味のある読者はもう少し待つ必要があります。

また、個人的に Warp 公式の Developer Advocate（どう訳せばいいか分からない、開発者アドボケート？）の Jess さんが猛烈で、話し方がうまく、時々ユーモアもあり、こういう技術解説への印象を完全に覆してくれました。彼女から多くを学びました。Warp についてもっと知りたければ、Warp 公式のデモもおすすめです。

筆者の紹介を読んで興味を持ったなら、[筆者の紹介リンク](https://app.warp.dev/referral/VLL959)で登録してください 🥹。

読者のために Warp のよく使うチートシートをまとめます：

- 面倒な設定ファイル不要、開封即利用
- タブ：
  - 新規 `cmd + t`
  - 閉じる `cmd + w`
  - 左に切り替え `cmd + shift + [`
  - 右に切り替え `cmd + shift + ]`
- ペイン分割：
  - 垂直ペイン新規 `cmd + d`
  - 水平ペイン新規 `cmd + shift + d`
  - 閉じる `exit`
  - 切り替え `cmd + option + 上下左右`
- AI：
  - 通常検索は `#` + 調べたいコマンドを入力
  - フル検索 `ctrl` + `shift` + `space`

これだけのコマンドで、マウスを使う時間をかなり減らせます。さらに `Raycast` と `Vim` を組み合わせれば、もうマウスは不要では（えっ？）。一緒にキーボード魔人になりましょう！

だいたいこんな感じです。またね〜。

Happy Coding ~

## Ref

- [Warp](https://warp.dev)
- [Warp official demo](https://www.youtube.com/watch?v=XWQY8LgkiXM)
- [Warp 対応コマンド](https://docs.warp.dev/features/completions)
- [Window Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701)
- [筆者の紹介リンク 🥹](https://app.warp.dev/referral/VLL959)

> 免責事項

以上はすべて筆者自身の経験に基づくもので、主観が混ざるのは避けられません。参考程度にしていただき、経験の共有や交流も大歓迎です。
もし誤りがあれば、ご指摘ください。すぐに修正します。改めてみなさん、ありがとうございます！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作は[クリエイティブ・コモンズ 表示 4.0 国際 ライセンス](https://creativecommons.org/licenses/by/4.0/)の下に提供されています。[benben.me](https://benben.me) で見つけてください。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
