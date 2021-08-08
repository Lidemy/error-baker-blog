---
title: 一段的 React-markdown 研究之旅
date: 2021-08-08
tags: [Markdown]
author: sixwings
layout: layouts/post.njk
---

<!-- summary -->
因為在學習系統的進度報告出現了奇怪的排版而困惑不已的我，踏上了研究 React-markdown 的旅途。
<!-- summary -->
<!-- more -->

# 前情提要
事情是這樣子的，參加 Lidemy [程式導師計畫](https://bootcamp.lidemy.com/)的學生需要定期在進度報告中發表學習進度、心得，白話一點就是可以用 markdown 語法的留言板這樣。我平常是先在 Obsidian 筆記軟體內把當天的進度報告寫好再轉貼上去，事件的起因是我使用了以下的語法：

```md
* test
blahblah...
```

原本預期出現的結果：
![](/img/posts/sixwings/hackmd.png)

但實際結果卻是：
![](/img/posts/sixwings/learing_sys.png)

十分醜陋的段落岔了出來，之前寫進度報告的時候也有發現這個狀況，但當天就特別好奇這背後的原因是什麼？為此我把上面那段語法丟到 hackMD 上測試，結果為前者，那時候以為是系統 BUG 還是什麼問題所以拿去問老師。後來老師說學習系統的 markdown 語法是 [GitHub Flavored Markdown (GFM)](https://github.github.com/gfm/) 然後說[學習系統有開源程式碼](https://github.com/Lidemy/lidemy-learning-frontend)可以自己研究看看唷。於是我就展開了今天的不歸路

# 探究

經過一番做功課時間後。得知學習系統採用的框架是 react，然後是透過 react-markdown 套件處理 markdown 格式的資料。react-markdown 遵循的 markdown 標準為 [CommonMark](https://spec.commonmark.org/current/) ，然後額外支援 [GitHub Flavored Markdown](https://github.github.com/gfm/) (GFM) 語法，新增了刪除線、表格、TODO list、直接URL等功能。

react-markdown 經過了[好幾道步驟](https://github.com/remarkjs/react-markdown#architecture)把 markdown 語法轉換成 html 語言。然後也很好心提供了[線上語法測試](https://remarkjs.github.io/react-markdown/)

# 重現

測試字串還是最前面的那段，一開始在線上測試語法的時候遇到的問題是它沒有顯示換行，為了搞清楚換行問題還去翻 [CommonMark](https://spec.commonmark.org/0.29/) 規格書看它是怎麼處理換行的。學習系統是套用樣式 `white-space: pre-wrap` 所以可以看到換行效果。

然後看到線上測試結果的時候我一脸懵逼，奇怪是正常的阿？後來不信邪，花了一些時間在電腦上實際建立 react 環境去跑，結果也是正常的，我整個滿頭問號。

推測原因可能是 react-markdown 版本不對，或是 remark-gfm 插件造成 parser 的行為改變。後來實測證實是 remark-gfm 造成的問題，同時也在 remark-gfm 套件庫的 [README.md](https://github.com/remarkjs/remark-gfm#important) 獲得證實。研究了好幾天的東西終於可以落幕了，那時候如果可以先看一下說明文件或許就可以早點發現問題吧。

事後我寫作的方式是使用有縮排的寫法，這在其他地方的 markdown 顯示就都是正常的了

```md
* test
  blahblah...
```

# 回顧

這段過程除了「以後在 list 下面一行要記得補縮排」，其實還學習到蠻多東西的。

從 CommonMark 規範的誕生原因，可以知道有一份 Markdown 規格對大家來說還是蠻重要的。也從規格書中感受到 CommonMark 確實想要維持「肉眼看到看到什麼就應該長那個樣子」的精神，但仍然要克服克種奇奇怪怪的特殊情況。從規格書中提供的 example 可以感受到，處理格式真的是不容易的事情。

雖然現在各家 markdown 軟體都說 **100% 完全相容 CommonMark**，但或多或少都加入了一些便利功能，或是懶人語法之類的東西。這點在不同 markdown 平台切換的時候可能會發生問題，造成最後顯示出來的結果不一樣。建議使用 markdown 語法的時候可以先確認一下自己是用 CommonMark、GFM 或是 markdown 軟體自己提供的原生功能。

我是 sixwings，追尋技術的程式人，我們下次見 :)

