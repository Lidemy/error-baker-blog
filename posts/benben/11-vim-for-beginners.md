---
title: Vim for beginners
description: "寫給初學者的 Vim 入門：認識 Vim 無所不在的精神、如何離開 Vim，以及輸入與儲存這兩個任何編輯器的第一課，帶你踏出用鍵盤取代滑鼠的第一步。"
date: 2023-05-07
tags: [Vim]
author: benben
layout: layouts/post.njk
image: https://hackmd.io/_uploads/BkbJbumEh.gif
lang: zh-TW
translationKey: benben/11-vim-for-beginners
translationTargets: [en, ja, zh-CN]
---

<!-- summary -->
<!-- 有些人不想學 Vim；有些人想學 Vim，但是 ... -->
<!-- summary -->

**！這是一篇寫給初學者的 Vim 文章。如果你已經是 Vim Pro，那就可以跳過這篇了** :)

<center>
<img src="https://hackmd.io/_uploads/BkbJbumEh.gif" alt="vim-demo" class="post-image-width" />
</center>

> Vim demo by myself

你可以看到畫面神奇地移動，而我的滑鼠一毫米都沒有動。這就是 Vim 的威力。

## 0 前言

嗨，很高興再次見到大家！

這次我想聊聊 **Vim**。我會介紹 Vim，但不會講那些無聊的 Vim 歷史。

如果你像 Pro 一樣使用 Vim，你不需要滑鼠。

你可能會懷疑這是不是真的。我會說，這還算合理。

讓我們開始吧！

## 1 精神

首先，Vim 是什麼？Vim 是一個編輯器，這無庸置疑。但它不只是個編輯器——它 **幾乎無所不在**。身為一個開發者，你可能會用 Git 來控制原始碼，或是登入某台遠端機器，而它的預設編輯器就是 Vim。

多數人沒有意識到 Vim 的強大，這很可惜。這跟以前的我一樣，所以不用擔心。我最早是在某個科技 YouTube 頻道上注意到 Vim 的影響力。第一次看到時，我就被 Vim 的威力所震撼。

此外，Vim 的精神也存在於許多工具和插件中。例如，我寫這篇文章時用的是 VScode 裡的 Vim 插件。我也用 Vim 的 Chrome 插件（Vimium）來瀏覽網頁。Vim 無所不在。

## 2 離開 Vim 的按鍵

如果你知道怎麼離開 Vim，就是 `:q` 然後 `Enter`，這樣就搞定了。這個 `:q` 指令在 Vim 裡最有名了。這兩個鍵有很多迷因。

另外，如果你想儲存後離開，可以輸入 `:qw` 然後 `Enter`。或者，你可以輸入 `:x` 然後 `Enter`，或是按 `ZZ` 離開、`ZQ` 儲存並離開。酷吧，現在你可以隨心所欲地使用這些方法。Vim 非常有趣。

Vim 的最基本知識是：

1. 如何輸入文字
2. 如何儲存文字

這兩個關鍵是 **任何編輯器** 的第一課。讓我們回想一下當初是怎麼開始編輯文字檔的。我猜我們大多數人第一次都是用內建的文字編輯器編輯 `.txt` 檔。

- 內建編輯器怎麼輸入文字？

> 就是直接輸入你想要的任何文字。

- 內建編輯器怎麼儲存文字？

> 用 `Ctrl/Cmd + S`，然後用滑鼠點關閉 `X` 按鈕，沒什麼大不了。

你看，就是同樣的兩個關鍵！只是在 Vim 裡有一點點不一樣。信不信由你，Vim 提供了比一般內建編輯器 **更豐富、更有趣** 的功能。

## 3 Vim 的模式

1. Normal mode（普通模式）
2. Input mode（輸入模式）
3. Select mode（選取模式）

我建議初學者一開始先認識 **normal mode** 和 **input mode**，這樣就夠了。

我們第一次進入 Vim 世界時，預設都是在 **normal mode**（如果你沒有設定 `.vimrc` 檔之類的話）。在這個模式下，我們 **無法** 輸入文字，**除非** 按下某些特定按鍵。這點很重要，你應該要知道。過去我也是從網路上學到這點的。但我意識到：「你什麼都打不出來」的意思是，你可能是有意按下某些特定按鍵。於是我就亂按一通。你猜怎麼著？嗯，我修改了一些我正在處理的設定檔。

我比較傾向把 normal mode 當作「navigate mode（導覽模式）」，因為你可以用一些特定按鍵在檔案或文件中瀏覽。同時，也有些按鍵可以切換到其他具有不同功能的模式。

> 小知識：Vim 也有「easy mode（簡易模式）」。用這樣的指令開啟檔案：`vim -y file.md`，然後你就會以簡易模式開啟檔案，類似 Nano 編輯器。也就是說，如果你想用像 Nano 一樣簡單的編輯器，根本不用安裝 Nano！用 Vim 的簡易模式就好。但我不鼓勵使用這個模式，因為它無法展現 Vim 的威力。

## 4 方向

Vim 世界有四個方向：

1. h (**←**)
2. j (**↓**)
3. k (**↑**)
4. l (**→**)

對，這有點奇怪！我知道！但如果你看一下你的鍵盤，你會發現這四個鍵剛好在你右手手指下方一個接著一個。這不是巧合，而且減少使用滑鼠的機會也更有道理。

不同於傳統的方向四個箭頭鍵，Vim 使用 **h、j、k、l**。這樣一來，你可以把手指保持在鍵盤中央上方。你可能會想這有什麼大不了的。對，我以前也這樣想過。但現在，我會說 **是的，這很重要**，而且我也用 60% 鍵盤。這些確實讓我更專注於工作。

在 Vim 裡還有更有效率的導覽方式，例如 `H`、`L`、`M`、`ctrl + d`、`ctrl + r`。但如果你對 h、j、k、l 還不熟悉，**專注在這四個鍵就夠好了，而且它們能做到 Vim 裡所有你想要的導覽**。這是真的，差別只在於花了多少時間。

## 5 輸入方式

有五種輸入方式：

1. a、A
2. i、I
3. o、O
4. c、C
5. r、R

但這五個鍵的大寫和小寫有點不一樣。也就是說，Vim 裡有 10+ 種輸入文字的方式。

這可能有點 overwhelming，我知道。再一次，只要知道 `i` 就夠了。你可能會想，為什麼有這麼多輸入文字的方式？以 `i` 和 `a` 為例，它們非常相似，但一個是在空白處 **insert（i）**，另一個是在空白處 **append（a）**。

其實我敢打賭你可能會記得用 `i` 和 `a` 在 Vim 裡輸入文字。不會嗎？跟著我念：`i, insert`、`a, append`。重點是不要死記這些指令，而是把它念出來。

## 回顧

對某些已經熟悉 Vim 的讀者來說，這篇文章可能非常簡單。但 Vim 就是簡單，像 1、2、3、4、5 一樣。才怪，我開玩笑的。

Vim 很難學。但一旦你學會並精通它，Vim 就會成為你技能中最好的投資，不只限於寫程式，連文件編輯（真的是任何文件）都適用。

- 第一，學習 Vim 的最基本知識。

它們是 `h`、`j`、`k`、`l`、`i`、`:q!`、`:wq`，只要相信它們就足以在 Vim 裡完成一切。

- 第二，逐鍵學習 Vim。

當你熟悉了最基本的知識，你就可以進到下一個鍵，一個一個鍵檢查它們的功能。建議你接著學 `w`、`e`、`b`、`zz`、`ctrl + d`、`ctrl + u`、`%`。

- 第三，不要試圖死記任何快捷鍵。

與其死記，你應該盡可能多地使用它們，直到有一天你不需要再查 Vim 的文件或 Google。這就像你在學你的第一組快捷鍵 `ctrl + c` 和 `ctrl + v` 一樣，只是 Vim 的世界裡有更多快捷鍵（它們很酷、很神奇）。而這些技能會跟著你一起成長。我真的很喜歡這種感覺，就像你在玩一個 RPG 遊戲，一開始拿著一把不怎麼樣（也許很爛）的武器。但最後，它變成了傳奇武器，並找到了它的主人。

## 番外篇：你手邊就有的 Vim tutor

所以你很興奮，想多學一點 Vim。

但當你看到這樣的 Vim cheat sheet：

<center>
<img src="https://helloacm.com/wp-content/uploads/2015/09/vi-vim-cheat-sheet.jpg" alt="vim-cheat-sheet" class="post-image-width" />
</center>

> [Vim cheat sheet](https://helloacm.com/vi-vim-cheat-sheet-jpg/)

於是你決定放棄。酷，你想放棄？那你要按下什麼鍵？

對，就是 `:q!`。你知道的。

但等等，如果我告訴你有一個 **免費的 Vim tutor** 給你，你願意再堅持一下嗎？

讓我們來見見他。

如果你用的是 Linux 作業系統（你可以用跨平台的 `Git bash terminal`）。

打開你的終端機，輸入 `vimtutor` 然後 `Enter`。你就會看到他出現在你的終端機裡。

怎麼關掉 Vim Tutor？你問。但你已經知道了。

> `:q`

如果你不喜歡他，這裡有些有用的連結：

- [VIM Adventures](https://vim-adventures.com/)
- [Interactive Vim tutorial](https://www.openvim.com/)
- [vimcolorschemes](https://vimcolorschemes.com/)（Vim 很老派？看看 Vim 有多少時尚主題）

差不多就是這樣。Ciao ~

## Ref

- [vim official](https://www.vim.org/)
- [Vim cheat sheet](https://helloacm.com/vi-vim-cheat-sheet-jpg/)
- [VIM Adventures](https://vim-adventures.com/)
- [Interactive Vim tutorial](https://www.openvim.com/)
- [vimcolorschemes](https://vimcolorschemes.com/)

> 免責聲名

以上均為筆者自身經驗，難免小有主觀意見，供讀者們參考，也歡迎分享經驗交流。
如果有錯誤的地方還請大大們指正，筆者會立刻修改，再次感謝大家！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作係採用 [創用 CC 姓名標示 4.0 國際授權條款](https://creativecommons.org/licenses/by/4.0/) 授權。您可以在 [benben.me](https://benben.me) 找到我。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
