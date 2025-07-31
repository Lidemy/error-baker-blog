---
title: Raycast | 不完全手冊
date: 2025-07-31
tags: [raycast, ai]
author: benben
layout: layouts/post.njk
image: https://img.youtube.com/vi/NuIpZoQwuVY/0.jpg
---

<!-- summary -->
<!-- 寫給朋友的 Raycast 使用手冊！ -->
<!-- summary -->

**！ 本篇文章將會介紹筆者 Raycast，老樣子參考覺得對你有幫助的就行了** ：D

[![](https://img.youtube.com/vi/NuIpZoQwuVY/0.jpg)](https://www.youtube.com/watch?v=NuIpZoQwuVY)

> Rasycast 官方的 101 Demo

大家安安，2025 也要過一半多了，我的天！上一前寫文章 1 年半前了 😱

這次要寫 Raycast！也算是填了上一篇的坑了 🤣
Raycast 主要是 for MacOS 使用的，目前 for Window 版的還在 Beta 中～

> （Ps. 目前筆者還有 2 組 Window 的優先邀請碼，有需要的讀者可以來信～）

目前大多的功能都是可以「免費」用的，所以可以放用下載，但因為筆者有訂閱 Pro ，所以也會一併分享一些 Pro 的功能，剛推出時，Pro 功能還很陽春，像是可以自訂義顏色。天啊！我能不買嗎？（<= 超愛自己客製化顏色、主題的人）筆者還算是蠻早期就訂閱 Pro 了

## 安裝

最一開始 Raycast 算是取代 Mac 原廠「Spotlight」的一個軟體，但隨著生態系發展，嚴然遠遠超過 Spotlight 了，除了原本 Spotlight 的功能，還有更多功能、客製化程度很高，甚至可以自己開發一個套件（使用 React）。

首先安裝 Raycast ！

> 可使用我的推薦連結來安裝：[https://raycast.com/?via=benben](https://raycast.com/?via=benben)

然後 **把原廠的 Spotlight 關掉**，這樣我們的 Raycast 就不會跟 Spotlight 打架了，因為兩個都是都是 `⌘` + `space` 的指令。

那怎麼關掉呢～？

<center>
  <img src="/img/posts/benben/15-raycast-101/15-1.png" class="post-image-width" style="width: 480px" alt="圖 1" />
</center>

<center>
  <img src="/img/posts/benben/15-raycast-101/15-2.png" class="post-image-width" style="width: 480px" alt="圖 2" />
</center>

> 請參考這邊的手把手教學

當然如果讀者用不習慣 Raycast，一樣可以參考這邊的操作改回來的～到這一步驟，就算大功告成了 🎊

可以先拿來「啟動應用程式」，之後的再自己慢慢研究也沒問題的 👍

有事沒事就按下 `⌘` + `space`，然後搜尋你想打開的應用程式！

<center>
  <img src="/img/posts/benben/15-raycast-101/15-3.png" class="post-image-width" style="width: 480px" alt="圖 3" />
</center>

## 基礎

接下來筆會分享一些簡單好用的功能～

### 1. Emoji

因為筆者也是個蠻愛用 Emoji 的人，應該多少感受得出來吧 😂

> Tips: Mac 原廠有一個快捷鍵可以打開 Emoji 選擇器：`⌘` + `Ctrl` + `Spance`

但原廠的功能非常陽春（欸 2025 了 X）。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-4.png" class="post-image-width" style="width: 480px" alt="圖 4" />
</center>

> 原廠 Emoji 選擇器的介面

我們可以使用 Raycast 的 `Search Emoji & Symbol`，通常 Raycast 的右下角都可以查當前有什麼「可用操作」Actions。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-5.png" class="post-image-width" style="width: 480px" alt="圖 5" />
</center>

> Raycast Emoji 選擇器的介面

例如：我可以把喜愛的 emoji 釘選起來。

> Pro Tips: 把 `⌘` + `Ctrl` + `Spance` 設成 Raycast 的 `Search Emoji & Symbol` 快捷鍵

### 2. 剪貼簿記錄

有時候工作常常會需要 Copy/Paste 別的東西，但你突然會用到一個昨天精心寫的文案，那是你花了好久寫好的，但是也想不起來存在哪個深層的資料夾裡了，你心想要是能去「剪貼簿記錄」找找就好了。

這時候我們的好朋友 Raycast 也可以幫上我們的幫！

<center>
  <img src="/img/posts/benben/15-raycast-101/15-6.png" class="post-image-width" style="width: 480px" alt="圖 6" />
</center>

### 3. Change Case

命名是個難題，尤其是前後端合作上，後端因為語言的不同，命名的傳統上也不太一樣，可能拿到後端的文件，上面命名是後端的方式，這時候會想要把某個 Case 換成別的 Case。

我們可以使用 Raycast 的 `Change Case` 。

例如： UserMessageId <= 把這選取起來，然後使用 `Change Case` 的功能。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-7.png" class="post-image-width" style="width: 480px" alt="圖 7" />
</center>

> Change Case 的功能

### 4. Snippet

這個功能在 Coding 的領域很常用，但不知道怎麼翻譯成中文，所以先繼續以英文 Snippet 稱呼。簡單說就是「一段可以重複使用的片段」，但不一定是 Code，也可以任何文字。

例如：很常見的公司資訊。

```md
Error Baker 有限公司
地址：太陽系 地球星球
電話：666-666-666
網站：https://blog.errorbaker.tw/
```

- 首先把想要重複的文字複製起來
- `Create Snippet` 創建一個新的 Snippet
- 設置 Keyword ，做為觸發的 Trigger

<center>
  <img src="/img/posts/benben/15-raycast-101/15-8.png" class="post-image-width" style="width: 480px" alt="圖 8" />
</center>

設置完後，下次打「@error-baker;」，把就會把上面那段文字變出來了 🧙

> Pro Tips: 設置 Snippet 的「開頭」跟「結尾」，以防觸發了不想觸發的 Snippet

### 5. Kill Process

Raycast 還可以用來關掉應用程式，包含背景的應用程式，要關掉當掉的程式之類的蠻方便的，打開 Raycast 的 `Kill Process` 的功能，就可以看到當前的程式，並且可以依照「CPU」或是「RAM」的用量排序。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-kill-process.png" class="post-image-width" style="width: 480px" alt="圖 kill process" />
</center>

## Store

雖然它叫 Store ，但都是 `免費` 的「Raycast 套件」，有官方做的，也有其他開發者做然後分享上來的。筆者三不五時就會上去，看看有什麼熱門的套件可以試試看的。

像筆者就裝了以下：

- 第三方軟體類：Spotify, Arc, Brew
- 生產力工具：Timer, Color Picker, Year in Progress, Scan QRcode
- 軟體相關：Lorem Ipsum, Test Internet Speed, TinyPNG

沒有的喜歡的話，甚至可以自己開發一個套件，當然你寫了一個 很讚的 Raycast 套件，你也可以分享上去，然後供其他 Raycast 使用者下載！

> 延申閱讀：[Raycast 的 Store](https://www.raycast.com/store)

## 視窗管理

可以把當前 Focus 的 APP 往左或往右 50% 分割對齊，算是很常使用到這個場景：

- 一半寫 Code，一半看預覽
- 一半看線上課程，一半寫筆記
- … 等

我們可以打開 Raycast 的 `Left Half` 跟 `Right Half` 來觸發功能。

也可以使用快捷鍵，像是：

- 往左 `Ctrl` + `Opt` + `←`
- 往右 `Ctrl` + `Opt` + `←`
- > 上面的也可以設定循環：1/2 、2/3、1/3
- 置中放大 `Ctrl` + `Opt` + `Enter`
- 加大 `Ctrl` + `Opt` + `+`
- 減小 `Ctrl` + `Opt` + `-`

以上這些都是免費的功能！

如果是 Pro 的話，可以應用更客製化的設定開啟的 App ～

例如，要同時完成以下的步驟：

- 把左邊 50% 設定成 VScode
- 右邊 50% 設定成 Arc 並 **打開 「localhost:3000」**

然後把上面這個設置（Layout）儲存下來，你如果想要，也可以設定一次開啟更多 App。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-layout.png" class="post-image-width" style="width: 480px" alt="圖 layout" />
</center>

下次就可以「一個指令」打開了，又更快的進入社畜模式了，是不是很讚啊

## AI 功能

免費的就有一些 AI 扣達功能可以用了，還蠻佛的，目前（發文當下 2025/07/25）是 **50** 次，以下的 Raycast AI 功能可以使用！

### 1. Raycast AI （需訂閱 Pro）

這個就算是把 ChatGPT 的功能在 Raycast 上使用， 雖然筆者是位前端工程師，幾乎開著電腦，瀏覽器也都會開著，但有時候還是會覺得再多開一個分頁，再打開 ChatGPT 的網址，還是慢了一點點，如果只是問個簡單的問題，好像也不用這個勞師動眾，這時候使用 Raycast AI 的功能就還蠻不錯的～

一樣打開 Raycast，這次輸入你要問的問題，然後按下 `Tab` ，然後就可以當成 ChatGPT 使用了～

### 2. Translate （需訂閱 Pro）

因為筆者的英文不是很好，常常會需要翻譯功能，看文件、看 Email、跟同事往來等等，然當現在 Google 翻譯很方便，但跟上面 ChatGPT 的情況一樣，很多時候你只是想要快速一個翻譯，不用太多細節，當然！也不想專門打開一個瀏覽器分頁（這很重要）。

一樣可以看一下有什麼好用的 Action，筆者很常使用的有交換（`⌘` + `S`）、切換語言（`⌘` + `P`）等等。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-translate.png" class="post-image-width" style="width: 480px" alt="圖 layout" />
</center>

> Translate 功能

### 3. Fix Spelling and Grammar（需訂閱 Pro）

有時候會需要寫一些英文，像是：Email、README、跟外國同事溝通等等，有使用文法不夠正確，照成別人的誤會就不好了，使用 `Fix Spelling and Grammar` 的功能，可以讓我們

- 修改拼字跟文法：`Fix Spelling and Grammar`
- 讓文字變長：`Make longer`
- 讓文字變短：`Make shorter`

> 其他的可以參考設定裡的 AI 功能

<center>
  <img src="/img/posts/benben/15-raycast-101/15-ai.png" class="post-image-width" style="width: 480px" alt="圖 layout" />
</center>

## 總結

是的，當我們開始把一些小功能取代掉，能在一個介面完成的事，就不用再去多開一個 App 或是分頁了，像是 Color Picker 功能 Raycast 也可以使用，所以就把相關的 App 刪除了，不失也是一種減法哲學。

這一份不完全手冊就介紹到這邊～當然這只是一部分的功能，剩下的還得到讀者去發掘了！如果有想分享的酷用法也可以在下面留言交流唷！

感謝看到這裡的各位，給自己一個掌聲 👏🏼

> （Ps. 目前筆者還有 2 組 Window 的優先邀請碼，有需要的讀者可以來信～）

對了！Raycast 也有 Conffetti （彩帶）的功能 🎊

<center>
  <img src="/img/posts/benben/15-raycast-101/15-wrapped.gif" class="post-image-width" style="width: 720px" alt="圖 15-wrapped" />
</center>

> Conffetti 功能，但需先下載 Raycast 的套件

好啦～忙完了一天，要把電腦休眠（Sleep）了 （迷之音：聽說 Mac 的使用者都很少關機的）。

熱練地打開 Raycast ，輸入「Sleep」按下 `Enter`。

平安一天又過去了，感謝 Raycast 的努力！

我們下次見！ 👋🏼

## Ref

- [Raycast](https://raycast.com/?via=benben)
- [Raycast 的 Store](https://www.raycast.com/store)
- [Raycast 101 | 官方 Youbube ](https://www.youtube.com/watch?v=NuIpZoQwuVY)

> 免責聲名

以上均為筆者自身經驗，難免小有主觀意見，供讀者們參考，也歡迎分享經驗交流。
如果有錯誤的地方還請大大們指正，筆者會立刻修改，再次感謝大家！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作係採用 [創用 CC 姓名標示 4.0 國際授權條款](https://creativecommons.org/licenses/by/4.0/) 授權。您可以在 [benben.me](https://benben.me) 找到我。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
