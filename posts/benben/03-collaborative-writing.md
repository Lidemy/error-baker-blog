---
title: 共筆中的共筆 - 以 JavaScript30 為例
date: 2021-10-26
tags: [JavaScript, collaborative]
author: benben
layout: layouts/post.njk
image: https://i.imgur.com/ZmEEvep.png
---

<!-- summary -->
<!-- 有寫過共筆嗎？如果沒有就自己發起吧！ -->
<!-- summary -->

![imgur picture](https://i.imgur.com/ZmEEvep.png)

> 圖片來源：imgur

## 前言

嗨嗨！筆者的第五期 Lidemy 導師計畫剛結束了，大家過得還好嗎？整個過程也是有血有淚、可歌可泣的啊 ><，希望大家也都順利畢業！

原本以為畢業之後應該會順利一點，但之後還要面對求職大魔王啊，看來我想得真是太美好了，想說之後應該比較有時間可以寫文章的說 XD

這個計畫的六個月說長不長說短不短，有些人也在期間做了很多事、研究了不一樣的東西，大家也都成長不少吧！ 這篇文章算是筆者在學習時期「發起共筆讀書會」的一個小回顧。之前聽到學長姐的公司有讀書會，覺得蠻不錯的，不確定大家的公司有沒有讀書會，如果有的話，那很棒，如果沒有就自己發起吧！

## 緣起

為什麼會有這個共筆讀書會活動呢？緣起是這樣的，因為筆者還在 Lidemy 學習時，一直都會做筆記，相信大家都跟筆者一樣認真的。有一天大家在聊天時（在 gather.twon 上面，可以想成是比較自由版本的 google meet，可以自由去別的空間聊天、開會等等），我推薦大家 **JavaScript30** 這個免費的學習資源，但我其實也才看了 5 篇左右，但是真的覺得這個資源很不錯，於是突發奇想「還是我們來辨一個讀書會」主題就是：JavaScript30 ，剛好這也是適合新手的學習資源，非常適合還是新手的我們，找了幾個人一起輪流分享，順便練習自己的解說能力，然後再分享給其他人聽，聽的人可以不只我們自己人，其他 gather.town 上的人也都可以聽。

> 延伸學習：[JavaScript](https://javascript30.com/)

JavaScript30 一直是我覺得不錯的免費資源，只是要先註冊一下才可以看這樣，分享給大家的時候，大家也都覺得不錯，也有人之前就註冊過了，但跟我一樣註冊完一直都沒看（笑），畢竟是免費的嘛，只要是免費的就會覺得：「啊！反正之後還有很多時間可以看」然後就會一直放著了，對！我就是這樣，但如果要分享給別人就不一樣了。

因為有要分享給別人的動力，會逼迫你一定要去看、要去了解，或是至少要看懂要分享的部分，所以動力也會比較足夠，比起「免費的先領起來長灰塵」來說，這個動力絕對多很多，甚至比起你自己看的了解程度也會多很多，這是我自己參加完的心得，但應該很多人也有這樣的感覺。

## 選擇你的工具：HackMD / CodePen

首先，先來介紹線上筆記軟體 - **HackMD** 吧，因為要可以共筆嘛，所以「線上的功能」是必備的，當然也可以用 Notion 之類的，總之要大家都可以接受並願意使用的線上工具，HackMD 是一個線上的 **markdown** 編輯器，markdown 簡單來說就是 github 裡 `README.md` 的 `.md` 檔，可以讓人快速寫出文件的格式的寫法，有點像是 **HTML** 的簡化版，簡單明瞭的寫法，當然要客製化比較難一點。

再來是線上 IDE -  **CodePen** ，因為我們有寫扣的需求，又需要一個即時可以編寫、執行的環境，所以一個輕巧的線上平台是我覺得很棒的工具，其他像是 CodeSandbox 等可能也不錯，但因為我們的 JavaScript30 只會用到原生的 HTML, CSS, JavaScript，顯然 CodePen 比較適合我們的需求，於是就選擇了這個平台做為 demo 的平台。

有了這兩個核心的平台，就差不多可以準備共筆了，可以簡單打一下介紹，如：`README.md` 的檔案那樣，簡單的描述一下要怎麼開始讀書會、時程之類的，更簡單來說就是：「人、事、時、地、物」這些都說清楚，才不會讓人不知道要幹嘛。

## 開始共筆吧

即然工具都有了，就準備開工吧，當然也都可以選擇自己喜歡的工具啦，但要記得工具只是輔助並非一定。

因為是筆者發起的，所以就先幫大家準備簡單的模版：

```markdown
# Title

## HTML

## CSS

## JavaScript

// 其他補充 ...

```

大概是醬，因為都是原生的 HTML, CSS, JavaScript ，由這三個面向去解說一定不會錯，雖然主要是 JavaScript ，但也可以看看 HTML 怎麼規劃的，有時候 CSS 也會有特別的玩意，只要是你學到的東西都可以分享。

如果你還不太會 markdown 語法也沒關係，可以參考 **HackMD 使用教學** ，號稱 10 分鍾就可以上手，但筆者認為對非工程師的朋友，還是有點不友善，推坑給非工程師的朋友還是一直沒成功 XD

> 延伸學習：[HackMD 使用教學](https://hackmd.io/c/tutorials-tw/%2Fs%2Fquick-start-tw)

另外 HackMD 也有投影片模式（side mode）喔，只是要先算好內容的多寡，才不會被截斷的問題，分享時真的很方便，也推薦試試看。

CodePen 的話，就真的比較工程師一點了，要先具備 HTML, CSS, JavaScript 的基礎，才可以比較懂在做什麼，如果讀書會的內容不需要這些的話，也不一定要用這個工具，可以用其他平台。

CodePen 介面看起來像這樣：

![CodePen interface](https://i.imgur.com/T0viLyL.png)

CodePen 使用起來像這樣：

![CodePen usage](https://i.imgur.com/D7lmpRR.png)

簡單說分為 3 個部分：HTML, CSS, JavaScript ，右邊可以即時顯視出當前的樣子，有什麼新的想法也可以試試看、玩玩看，當作一個 PlayGround 的概念，也可以分享給別人。

這個共筆讀書會的建置就差不多到這邊，之後就是最難的一部分：「持續下去」

在整個 JavaScript 30 中學習到的東西很多、很全面，雖然有些東西真的沒有這麼長用到，但是絕對可以打開你的眼界，甚至會讓你說：「竟然還有這種東西！」，而且都是原生的，看完不禁讓我懷疑：「我真的會 JavaScript 嗎？」

在 JavaScript 30 中一些有趣的東西：

- `console.log`, `console.error`, `console.count` 等等。
- canvas 繪圖
- array 的各種練習
- base64 像素的操作
- 其他有趣的小特效

最後的簡單成果（感謝參與的同學們）： [JS30 我要成為 JavaScript 大師](https://hackmd.io/@benben6515/javascript-30)

## 總結

這一篇又是稍為沒什麼技術內容的一篇（汗），但是一定有一些人不太了解這些工具，可能剛好就有人很有想法，但是沒有工具、不知道如何開始，那麼這一篇文章就是為你所寫的。

其實這整個 ErrorBaker 部落格也是一個共筆部落格，所以你想要的話，也可以一起發起一個共筆部落格，或著如果你也覺得共筆讀書會不錯的話，也可以發起共筆讀書會，那麼現在就開始規劃你的共筆吧！

最後希望大家可以一同進步、一同成長，感謝您的閱讀。

### Ref

- [JavaScript 30](https://javascript30.com/)
- [HackMD](https://hackmd.io/)
- [CodePen](https://codepen.io/)
- [為工程師文件而生的協作平台：HackMD 開發故事 | Medium](https://medium.com/starrocket/hackmd-product-story-1e332f83d343)
- [JS30 我要成為 JavaScript 大師 | 筆者 HackMD 範例](https://hackmd.io/@benben6515/javascript-30)

> 免責聲名

以上均為筆者自身經驗，難免小有主觀意見，供讀者們參考，也歡迎分享經驗交流。
如果有錯誤的地方還請大大們指正，筆者會立刻修改，再次感謝大家！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作係採用 [創用 CC 姓名標示 4.0 國際授權條款](https://creativecommons.org/licenses/by/4.0/) 授權。您可以在 [benben.me](https://benben.me) 找到我。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
