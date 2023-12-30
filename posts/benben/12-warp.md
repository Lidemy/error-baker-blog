---
title: Warp | 你的 21 世紀 AI Terminal
date: 2023-05-31
tags: [warp, terminal, ai]
author: benben
layout: layouts/post.njk
image: https://hackmd.io/_uploads/HJsA77LE3.gif
---

<!-- summary -->
<!-- 都什麼時代了，你還在用傳統的 terminal 並且設置各種 config 嗎？ -->
<!-- summary -->

**！ 本篇文章將會介紹一個好用的開發工具 Warp，是一種 AI terminal，期望大家都能火速開發** :D

## 前言

<center>
  <img src="https://hackmd.io/_uploads/HJsA77LE3.gif" alt="warp-demo" class="post-image-width" />
</center>

> Warp demo by myself

閱讀本文前建議知道 `terminal` 是什麼最為佳，目前 Warp 只有推出 Mac 版本，所以可能要讀者斟酌一下，然後不管是職業或是業餘或是轉職中都可以閱讀，或是，筆者自己有簡單的分類：

1. level 1: `ls`
2. level 2: `ls -al`
3. level 3: `ls -altr`

小小測驗，在不 google 的情況下，你知道上述指令的用途且知道參數的函意，你是屬於上面的哪一種呢？如果你選了其中之一，恭喜你本文你應該都能輕鬆看懂。

你也有 **AI 焦慮** 跟 **工具焦慮** 嗎？在這個什麼都要 AI 、什麼工具都不斷的推陳出新的時代，最不缺的就是所謂的 "AI 工具" 了，其中也有不少只是過個水來湊熱鬧的，剛出來確實蠻新奇的，但是身為工程師看久了，就有底他是用什麼做的，然後背後套一個 LLM(Large Language Model) 罷了，比較火紅的如 ChapGPT-3/4, BERT, XLNet 等等。

既然如此，究竟 `Warp` 這個 terminal 是不是只是套一個 AI 而已的 terminal 呢？讓我們繼續看下去 ~

想也知道當然不是！不然筆者就不會寫這篇文章了，你說是吧？那就先來個簡易的比較表格：

| 功能                   | Warp            | Window Terminal | iTerm2       |
| ---------------------- | --------------- | --------------- | ------------ |
| 個人化                 | ⭐️⭐⭐             | ⭐⭐              | ⭐            |
| 輕鬆複製 input/output  | ⭐⭐⭐             | ⭐               | ⭐            |
| Auto Completion        | 開箱即用        | 需安裝、設置    | 需安裝、設置 |
| 快捷鍵手冊             | 內鍵（cmd + /） | 需另外找        | 需另外找     |
| 分頁、分割視窗         | O               | O               | O            |
| AI                     | O               | X               | X            |
| 滑鼠可使用             | O               | X               | X            |
| cmd + a/z/x/c/v 可使用 | O               | X               | X            |

在本篇文章中，筆者會介紹 Warp 以及一些心得，內容大至如下：

- [前言](#前言)
- [簡介及安裝](#簡介及安裝)
- [個人化配置](#個人化配置)
- [使用方式及 AI](#使用方式及-ai)
- [心得推坑](#心得推坑)
- [Ref](#ref)

## 簡介及安裝

來看一下他們的官網，其實已經介紹的不錯了（如果英文 OK 的話，也可以直接看），文件都很清晰，筆者當時開始使用時(約 2023/02)，還沒有 Live Demo 的影片(約 2023/04 更新的)，只能看文件跟自己玩看看去探索，後來才發現他出來有一陣子了，差不多 2021 就推出了（根據 Youtube 上的官方頻道）好像這陣子比較火紅，當然也是很潮的用 `Rust` 開發，筆者會發現也是偶然看到其他 Tech Youtuber 介紹的。

<center>

[![Warp official demo](https://img.youtube.com/vi/XWQY8LgkiXM/0.jpg)](https://www.youtube.com/watch?v=XWQY8LgkiXM)

</center>

> 廷伸閱讀 [Warp](https://warp.dev)

但 **目前只有 Mac 平台** 可供下載，使用 `Window`, `Linux` 等其他平台的讀者可能還要再等等了。

不過還是要先明聲，這不是業配（Warp 看到可以考慮一下，喂！），但是 warp 官方那邊也有提供一個小小推薦計劃，推滿 10 位好像會送一件衣服（比 leetcode 的衣服好拿太多了吧），但是不是一樣穿上就太 Nerd 到交不到女朋友，筆者就不好說了（汗），如果看完我的文章覺得有興趣的話，還是可以用一下筆者的連結唷。

<center>
  <img src="https://hackmd.io/_uploads/r1Atcp24n.png" alt="warp-referral" class="post-image-width" />
</center>

> 推薦連結：<https://app.warp.dev/referral/VLL959> (拜偷 拜偷 感蝦 感蝦 🥹)

個人使用的話，不會有任何費用，所以不用擔心還要填信用卡之類的，只會要你註冊一下帳號，就可以開始使用了。

對我的好處：

1. 教學相長、分享新知
2. 更深入研究 Warp 的功能

對你的好處：

1. 有個酷酷的 terminal ，上班同事都會偷看你工作（好像也不太好），成為話題人物
2. AI 加成工作效率提升，如：Git, Vim 指令

不過在之前推薦給朋友，我還不知道有這個推薦計劃，就在讀書會推了一些朋友了（嗚嗚），後來想想反正都要推了，就好好的寫一篇文，之後有朋友有興趣的話，我也可以貼文章給他了而不用在 live demo 一次了（Don't repeat yourself 原則）

但其實不管有沒有推廣計劃，我本來就會分享好用的工具了，那讀者要不要裝，也是取決在個人，如何裝我也管不著，我就佛系推的概念啦。

安裝方式，就如官網上的點擊 `Download Now`，之後正常安裝就可以了，安裝、註冊好後，就會看到如我首面圖片的畫面了（可能有些設定、主題不一樣）

## 個人化配置

- 外觀

有內鍵多個主題，**萬一沒有喜歡的也可以自行設計**，並且有官方完整的教學，自由感十足。當然也可以設定字體、大小，比較特別的是他還可以直接設定 **透明度、Blur 效果**，以前筆者在 Windows （就是原生醜醜的黑白視窗）上搞了很久，後來改用 [`Window Terminal`](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701) 才有內鍵的設定。

<center>
  <img src="https://hackmd.io/_uploads/H1JZmAn43.png" alt="warp-setting" class="post-image-width" />
</center>

> Warp 設定頁面

主題配置我是覺得官方出品的都還算不錯（比起其他的內鍵主題真的還算都不錯），可以挑一個順眼的用就行了，字體預設也蠻好看的（預設是 Hack），這邊都還沒講到功能，只是外觀而已，但光這些就已經深得筆者的心了 XD

- Configuration

Warp 標旁 **零設定 (Zero Configuration)** 、開箱即用，完全不用另外設定、安裝套件，不用再一直備份你的 `.zshrc`, `.bashrc`

我們來試一些常用的功能：

**自動路徑完成** 的功能：在根目錄 `/` 下，輸入 `cd` + 按 `Tab` 鍵就會呈現當前的資料夾，可以使用上、下切換，按 `Enter` 會自動完成

<center>
<img src="https://hackmd.io/_uploads/BkqDHA2N3.png" alt="warp-setting" class="post-image-width" />
</center>

> 開箱即用 | 自動路徑完成

**Git 指令** 的功能：輸入 `git log` + 按下 `Tab` 鍵就會呈現當前可以用的指令，可以使用上、下切換，按 `Enter` 會自動完成

<center>
  <img src="https://hackmd.io/_uploads/BkKMUA24h.png" alt="warp-setting" class="post-image-width" />
</center>

> 開箱即用 | 自動 Git 指令完成

當然還有很多更強大的功能，筆者這邊就不一一示範了，可以參考還有哪些 [Warp 支援的指令](https://docs.warp.dev/features/completions)

## 使用方式及 AI

- 像一般的 Terminal 使用

當然你可以像一般的 terminal 一樣使用他，輸入正常的 linux 指令，如開頭的指令 `ls` 都可以直接使用，如果不需要其他酷酷的功能也可以像一般的 terminal 一像使用它就好了，但這樣好像也就不用 warp 了（笑）

- 分頁

筆者以前就覺得分頁的功能很好用，不知道是以前的 terminal 沒有，還是筆者不會用。總之呢，以前要多開 terminal 就會多開一個 app，然後萬一開了很多個（像是 docker, front-end, back-end, 日常使用的每個都開一個 terminal），就常常要找來找去，這時候如果有一個整合好的 terminal 就好了。

有的，那時候筆者有找到一款 terminal。對，就是 `Window terminal` ，那時候也是主打可以整合多個 terminal 在一起，如果是 windows 的使用者還是可以考慮使用看看的，我知道傳統的 cmd 視窗、Power Shell 的各種問題，可能就先給使用者不好的印象了，但 Warp 也還沒支援 Windows，所以可以先試試看 `Window terminal`，實其筆者以前也在內部的讀書會，推薦給朋友過。

在 Warp 中分頁非常簡單直覺，操作如下：

1. 按下 `cmd + t` ，開敵新的分頁
2. 按下 `cmd + shirt + [` ，向左邊切換視窗
3. 按下 `cmd + shirt + ]` ，向右邊切換視窗
4. 按下 `cmd + w` ，關閉當前的分頁

基本上，跟使用 VScode 的操作差不多，熟悉的話也不太需要特別記憶。

- 分割視窗

這邊的 `分割視窗` 跟上面的 `分頁`，是完全不一樣的功能，我開始使用也常搞混。其實這也是 `Window terminal` 有的能功，但 warp 有內鍵得快捷鍵可以簡單使用，也可以設定自己喜歡的快捷鍵，但預設的也算好記。

在 Warp 中分割視窗，操作如下：

1. 按下 `cmd + d` ，開啟水平分割視窗
2. 按下 `cmd + shift + d` ，開啟垂直分割視窗
3. 按下 `cmd + option + 上下左右` ，在 Warp 中速切換分割視窗了

- AI 功能

在這個時代，好像什麼都要來點 AI ，但也算稀鬆平常了吧，Warp 當然也有內鍵的 AI 可以使用。

只要在輸入指令的地方前面加入 `#` ，就可以進入搜尋模式了，再輸入想查尋的內容，就可以輕鬆的使用 AI 查尋指令了，例如：

<center>
  <img src="https://hackmd.io/_uploads/HJsA77LE3.gif" alt="warp-demo" class="post-image-width" />
</center>

> 在上面的圖片中，筆者查尋了如何將檔案移除 Git（How to remove file from git）

比較少用的指令真的很容易忘，有什候為了這點小事還要去某個藏在書籤中的 git cheat sheet 或是去翻 stack overflow ，就顯得有點浪費時間，這時候 Warp 就可以派上用場了，讀者可以簡單體驗一下 warp 的威力。

當然有時候比較複雜的使用情況，就可以試試更進階的搜尋功能

可以在 Warp 的右上角中點擊 **閃電的圖示** ，叫出進階 AI 搜尋面板，也可以按下快捷鍵 `ctrl` + `shift` + `space` （預設是這個快捷鍵），但有可能被其他的 App 蓋過去，需留意一下，也可以在設定的地方修改快捷鍵。

這樣就可以輸入更多的 prompt 讓 AI 去搜尋了，但是這邊的搜尋是有限制次數的，**一天 100 次**，隔天會歸 0 ，也不難理解啦，畢竟 Chat-GPT 也都收費的 Chat-GPT 4 了。

進階的搜尋功能可以多加利用，萬一次數用完了也不用擔心，上面使用 `#` 的 **一般搜尋是沒有限制次數的**，可以安心使用！

## 心得推坑

雖說是推坑，但我個人是真的很喜歡 Warp，除了各種個人化的配置檔、很多好用的內鍵功能、AI 輔助，好工具推推。Warp 是個人免費使用的，但目前（2023/05）只有 Mac OS 平台上才有，但未來其他平台應該會推出，有興趣的讀者可能還要再等等了。

另外，私心覺得 Warp 官方的 Developer Advocate(這個不知道怎麼翻，倡導開發者？) Jess 很猛，口條很好、有時又帶點搞笑，完全顛覆我對這種技術教學的印象，也在她身上學到不少，想了解更多 Warp，推薦大家也可以看一下 Warp 的官方 demo。

如果看完筆者的介紹，也有興趣的話，可以用 [筆者的推薦連結](https://app.warp.dev/referral/VLL959) 註冊唷 🥹 。

這邊再幫讀者整理一個 Warp 常用的懶人包：

- 免設定麻煩的設定檔，開箱即用
- 分頁：
  - 新增 `cmd + t`
  - 關閉 `cmd + w`
  - 往左邊切換 `cmd + shift + [`
  - 往右邊切換 `cmd + shift + ]`
- 分割視窗：
  - 新增垂直視窗 `cmd + d`
  - 新增水平視窗 `cmd + shift + d`
  - 關閉 `exit`
  - 切換 `cmd + option + 上下左右`
- AI：
  - 一般搜尋輸入 `#` + 你要查的指令
  - 完整搜尋 `ctrl` + `shift` + `space`

光以上這些指令，已經可以減少不少使用滑鼠的時間了，如果再加上 `Raycast` 跟 `Vim`，根本不用滑鼠了吧（咦）一起加入鍵盤魔人吧！

差不多是這樣啦，我們下次見 ~

Happy Coding ~

## Ref

- [Warp](https://warp.dev)
- [Warp official demo](https://www.youtube.com/watch?v=XWQY8LgkiXM)
- [Warp 支援的指令](https://docs.warp.dev/features/completions)
- [Window Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701)
- [筆者的推薦連結 🥹](https://app.warp.dev/referral/VLL959)

> 免責聲名

以上均為筆者自身經驗，難免小有主觀意見，供讀者們參考，也歡迎分享經驗交流。
如果有錯誤的地方還請大大們指正，筆者會立刻修改，再次感謝大家！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作係採用 [創用 CC 姓名標示 4.0 國際授權條款](https://creativecommons.org/licenses/by/4.0/) 授權。您可以在 [benben.me](https://benben.me) 找到我。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
