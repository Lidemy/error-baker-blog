---
title: Uno CSS - 一統天下的明日之星？
date: 2022-05-18
tags: [CSS, unoCSS]
author: benben
layout: layouts/post.njk
image: https://i.imgur.com/XRsgu8H.png
---

<!-- summary -->
<!-- 用 Uno CSS 統一天下 CSS！？ -->
<!-- summary -->

### Intro

嗨嗨！又是我！

之前接的一個小案子，也準備要結案啦！開心開心，希望可以順利結案，這樣才有更多的時間寫 Error Baker 啊！

那麼直接進入正題，這次要分享的是：**Uno CSS** ！

![](https://i.imgur.com/LQrk0DN.png)

> 圖片來源： [Uno CSS Github](https://github.com/unocss/unocss)

簡單說，他是一個 **Tailwind** 的替代 CSS 解決方案，沒有繁鎖的設定（~~我沒有說 Tailwind 的設定很繁鎖喔~~），可以直接使用，你可以說他抄襲 Tailwind ，但是他還有更強大的功能，例如：`正則表達式` 的配置 等等（這邊容筆者先賣的關子），看完這篇或許會有不一樣的想法喔！

比起目前前端的三大框架， CSS 的寫法百百種（SASS/SCSS, Bootstrap, Tailwind, WindyCSS, CSS in JS 系列 ... 等），那要學還是不學 Uno CSS？我覺得就看個人囉！但是如果說，你已經會了 Bootstrap 或是 Tailwind 了，那麼學習 Uno CSS 非常 **直覺** ，因為 Uno CSS 整合了這些習慣用法！

有點心動了嗎？還是還在猶豫呢？那麼我稍為介紹一下作者：[antfu (Anthony Fu)](https://github.com/antfu) ，如果是熟悉 Vue 生態圈的讀者們，一定聽過他的大名，他是 Vue、Vite 核心成員之一；Windi CSS、VueUse 開發者之一，我也是學習 Vue 才開始 follow 他的，大大呢非常的狂，有機會再寫一篇介紹 antfu 大大的文章。

### TL;DR

> 成為工程師時，學到的新潮用語 Too Long; Don't Read

剛剛說學習 Uno CSS 很直覺？怎麼說呢？以 Tailwind 為例，剛接觸 Tailwind 的開發者（甚至熟練的開發者也還是常碰到），在開發一定遇到的錯折。

例如：

> in tailwind css
```html
<div class="w-25"></div>
<!-- error!: no `w-25` class -->
```

首先，在 tailwind 中，沒有 `w-25` 這個 class ，因為他通常是 2 的倍數，1, 2, 3, 4 ,5, 6, 12, 24, 48, 60, 96 ... 等（有可能還會漏掉）。

再來，還很常碰到一種狀況，你不知道數字代表的單位是什麼，看同一個例子：`w-25` 的 25 是什麼？%？px？rem？0.5rem？除非去看文件或裝 tailwind 的插件，才知道是什麼，而且常常不同的單位都不一樣，`m-4`, `border-3`, `text-lg`, `shadow-sm` ，你能夠用看得就說出分別是多少嗎？如果能夠直接說出來的人，筆者給你拍拍手。

最後，如果我就是要用 `w-25` 這個 class 怎麼辨？必須要去翻文件找設定檔，然後加了一堆設定檔，一時加一時爽，一直加一直爽，最後你的設定檔可能比你自己寫 CSS 之類的還來的多，這時的你一定會冒出：我為什麼要用 tailwind ？還不如自己寫？這是對於新手如我來說很常碰到的狀況，但這部分隨著熟悉度還會越來越好的啦！

另一方面，來看看 Uno CSS 的情況：

> in uno css
```html
<div class="w-25"></div>
<!-- ok!: auto generate `w-25` class -->

<!-- If I want to `25px` width -->
<div class="w-25px"></div>
<!-- ok!: auto generate `w-25px` class -->
```

用了 Uno CSS 上述的問題全部解決：數字問題、單位問題、設定檔問題。

（自從用了 Uno CSS 切板都 100 分呢！）

筆者第一次遇到這種情行，非常之驚奇，這是什麼巫術！

再來牛刀小試一下：

> in uno css
```html
<div class="w-777"></div>
<!-- ok!: auto generate `w-777` class -->
```

![](https://i.imgur.com/4Rnomte.png)

> 圖片來源： 筆者的 VScode

沒有在跟你五四三的！0 設定檔、自動生成！

要不要試試看 77777777777777 行不行？這邊留給有興趣的人試試看了，先刷一波 77777777777777 。

其實這不是什麼魔法，聰明的小當家一定猜到了，是「**正則表達式**」！我加了正則表達式。

> 延伸閱讀：[簡易 Regular Expression 入門指南 - Huli](https://blog.huli.tw/2020/05/16/introduction-to-regular-expression/)

### Efficacy

光上述正則表達式的能功就打動我的心了！其實自動推導的功能在 Windi CSS 就有了，但 Uno CSS 在效能方面也是非常之神速啊！

來看看跟其他工具的跑分：

```md
3/26/2022, 11:41:26 PM
1656 utilities | x50 runs (min build time)

none                             12.42 ms / delta.      0.00 ms
unocss       v0.30.6             20.98 ms / delta.      8.57 ms (x1.00)
tailwindcss  v3.0.23           1621.38 ms / delta.   1608.96 ms (x187.79)
windicss     v3.5.1            1855.86 ms / delta.   1843.45 ms (x215.16)
```
> 資料來源：[uno css github](https://github.com/unocss/unocss)

哇！這速度可以說是海放所有人了吧！

但 `Uno CSS` 非常低調（？）頁面中 [uno css github page](https://github.com/unocss/unocss) 加入了這項說明： `Inspired by Windi CSS, Tailwind CSS, and Twind, but: ...`

也不會說 X 打某某某、最棒的 CSS Library ...等（~~迷之音：PHP 是最棒的程式語言~~）。

相反地，Uno CSS 甚至 **整合了其他常用 CSS Library 的 CSS 樣式**！

例如： ml-3 (Tailwind), ms-2 (Bootstrap), ma4 (Tachyons), and mt-10px (Windi CSS) 全部都可以用啦！

> in Uno CSS
```css
.ma4 { margin: 1rem; }
.ml-3 { margin-left: 0.75rem; }
.ms-2 { margin-inline-start: 0.5rem; }
.mt-10px { margin-top: 10px; }
// all works!
```

這也是為什麼筆者說，只要學了 Tailwind, Bootstrap ... 等，在學習 Uno CSS 的時候會很快了，因為你已經熟悉了某些樣式的寫法了，但是如果 `只學了 Bootstrap 再學 Tailwind` 或是 `只學了 Tailwind 再學 Bootstrap` 都會多一個時間成本！因為不同工具寫法略有不同。

### Document

一個好的 Library 怎麼可以沒有文件！

其中文件的好壞又會影響 DX（develop experience），有好的 DX 其實也是蠻重要的！

工程師寫 code 寫得開心，bug 就會減少；
bug 減少，使用者 / 客戶就開心；
使用者 / 客戶開心，老闆就開心；
老闆開心，你就加薪（~~並不會~~）。

以 DX 來說 Vue 生態系的其實都不錯，例如：Vite （Vue 生態系的開發工具，而且也支援 React 等各大框架唷），這真的用了就回不去了，開發神之快速！Vite 甚至有套件支援 Ruby, Laravel！

> 延伸閱讀：[Vite](https://vitejs.dev/) 真的不用一下嗎？（~~就是不想用的話，那我也沒辨法了 XD~~）

另外 Vue 的官網 - [Vue](https://vuejs.org/) 已經支援暗色主題（約 2022/02 開始）啦！真香！

React 的官網 - [React](https://reactjs.org/) 目前 React `18.1.0` 版（約 2022/05）依然沒有暗色主題（~~每次翻 React 文件都刺眼~~），官網甚至有點 outdated （但還是寫得不錯啦），我想初學 React 的開發者都很頭痛，我應該要先學 classes component 還是 function component + hooks？這邊應該有體驗過的朋友們，真的是有苦說不出！這邊就留給讀者自行意會（其實應該要先學好 JavaScript？）。

好了！這邊先打住，不然要戰起來了。

其實兩邊官網的內容都還不錯，都寫得很詳細！有心的話，認真讀完文件，應該都是可以上手的（前提是要有心，不然還是建議去找個教學會比較省時間）

回來看看這次 Uno CSS 的文件吧！

![](https://i.imgur.com/sdBwpo0.png)

> 圖片來源：[UnoCSS Interactive Docs](https://uno.antfu.me/)

其實文件也才剛 Beta 沒多久，一進來看到非常的潔簡，沒有酷炫特效、沒有跨大的標題、非常直覺的，就是找你的要找的東西，有種 Google 的既視感（？）。

來查查剛剛的 `w-25` class ...

![](https://i.imgur.com/qKurIGO.png)

> 圖片來源：[UnoCSS Interactive Docs](https://uno.antfu.me/)

搜尋結果一出來，除了最重要的 `width: 6.25rem` 外，還有 `regex` 的用法、連結，甚至連 `MDN` 的連結都有，全部幫你整合好了！

真的是目前為止 DX 體驗最棒的文件，開發時間不多的話查到想要的資訊就可以閃了，時間多的話可以深入了解一下 CSS 的原理、複習一下 regex 用法等等，真的閒到發荒的話（~~可以跟我說是哪間公司嗎~~），可以試試按 `random` 看看。

### Summary

在前端的路上，一路從學習 React 到默默變成 Vue 形狀了，我覺得蠻棒的，可以同時學習兩邊的一些技巧，沒有哪個好哪個不好，優缺點可以一起比較，在前端這個快速發展的領域中，更要保持開放的心態，通常會去爭論哪個框架好的，通常也只有學那一個框架，少有看到有人各框架都精通了，然後說哪個框架最棒，各有不同的 `trade off` ，爭論該用哪個框架，應該已經是個偽議題了，就如你不會說我學了 HTML ，不學 CSS 一樣，只是你要先學哪個？又要學得多深？

現況（截至 2022/05 ）來說 **React 確實較多人用、薪水比較高**，但在**文件、DX 體驗跟包容性 Vue 真的好的沒話說**，更是難以想像 Vue 背後沒有大公司的支持，甚至在 Vue 作者（尤大大）的推文中，不時會看到 React 派的留言，如：`Why not React?`

回到 `Uno CSS` 身上，仿佛可以看到一點點 Vue 當時的影子，成長性非常強，蠻有機會成為明日之星的，我覺得好的工具值得被更多人知道，但軟體的世界是 **沒有銀彈的**，但要不要使用就是看個人了。

那麼最重要的 `Uno CSS` 可以用在 Production 上了嗎？現階段來說，還不是正式版，最後的 API 不保証不會改動，但可以在小專案試試，筆者在自己小專案用了，開發體驗非常棒，所以才有了這篇文章，筆者也非常期待 `Uno CSS` 的上線版！

個人是覺得，不管有沒有要用都可以觀注一下！想了解更多的話，非常推薦看一下 `Uno CSS` 作者 AntFu 寫的這一篇：[重新构想原子化 CSS](https://antfu.me/posts/reimagine-atomic-css-zh)，就算沒有要用 `Uno CSS` 也可以學到很多東西。

### References

- [UnoCSS Interactive Docs](https://uno.antfu.me/)
- [Windi CSS](https://windicss.org/)
- [Bootstrap](https://getbootstrap.com/)
- [Sass](https://sass-lang.com/)
- [簡易 Regular Expression 入門指南 - Huli](https://blog.huli.tw/2020/05/16/introduction-to-regular-expression/)
- [Vite](https://vitejs.dev/)
- [重新构想原子化 CSS](https://antfu.me/posts/reimagine-atomic-css-zh)

###### 免責聲名

以上均為筆者自身經驗，難免小有主觀意見，供讀者們參考，也歡迎分享經驗交流。
如果有錯誤的地方再請大大們指正，筆者會立刻修改，再次感謝大家！
