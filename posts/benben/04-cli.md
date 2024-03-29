---
title: 等等我還想學 CLI - 微進階的 CLI
date: 2022-01-02
tags: [JavaScript, CLI]
author: benben
layout: layouts/post.njk
image: https://i.imgur.com/PfIQ0Lq.png
---

<!-- summary -->
<!-- 師父領進門，修行在個人，你的 CLI 是否還有在修行？ -->
<!-- summary -->

![window terminal](https://i.imgur.com/PfIQ0Lq.png)

> 圖片來源：我的 window terminal (imgur)

## 前言

（因為工作太忙，拖稿中）

大家安安，時間好快啊！已經 11 月底了，再一個月，今年又要過完了！

Lidemy 第五期的求職期到 12/12 ，也要來到最後的句點了，不少人應該也在工作了吧

筆者的新工作也剛上線，前身是設計公司，主要產品是 3D/VR 的，之前的案子確實是外包，最近在招自己的前端團隊，應該也算是創新（？）

所以整個前端的發展都還沒有一個流程，主管前端技術其實也懂的不深（在幾次的問答中發現），但他也知道（因為他以前都是做 3D 建模的），所以說有問題都可以問同事，有一位前端的同事很厲害，所以目前有問題都會跟他討論，這邊的人都還不錯，非常熱心。

累的地方當然也是有，因為前端的部門剛開始，所以資源比較少，也沒什麼舊的案子可以看，案子都是近期的，框架一下 react 、一下 vue 的，裡面亂到不行，例如 styles 裡面同時有 `.css`, `.scss`, `.sass` 檔（一般是不會這樣寫吧？），但之後確定是用 vue / pug / sass 跟 babylon.js （ WebGL 3D 框架） ，後端是 php 搭配 laravel 框架。

因為是接案公司，所以也要快比較快上手，他只給我一個禮拜的適應期，之後就丟一個專案來了，這一個禮拜我要學公司的流程、Vue、babylon.js，還好我之前有先看一下 Vue，但還是有自主加班多留下來學一點，因為同事也都有留下，有一點責任制的概念 XD

這樣好嗎？我覺得是好的，身為 junior 能多學就多學，不要太在意薪水（但也不要太誇張就好），你能解決的問題越多、價值也就越高，等你待個一、兩年，能力有了，自然會有人找上門挖角，這時候你就知道是誰吃虧了（X），所以眼光要放長遠的啦 XDD

不說了，我假日還在看公司的文件，要繼續去顛覆公司了（？）

> 以下正題

## 師父領進門

一開始，會接觸 CLI （Command-Line interface）應該是在 Lidemy 的中，最初的 week1，當中老師簡單的介紹 CLI 的操作，原來只用鍵盤就可以做這邊多事！我對此深深著迷，因為離 **心中想像中的駭客** 又更接近了，你說有點中二（？）我敢說你小時候一定也想像過，但有時候就是這種微不足道的小動力反而一直推著你前進。

但是沒有師父領進門，你也不會自己去研究這些東西，沒有國文老師還會自己去學數學、沒有數學老師還會自己去學公民，隔行如隔山啊，如果你想要惹毛學校的老師，照我上面的去問看看，一定會被老師打。

我很幸運，剛好也喜歡 CLI 操作又有師父帶領，所以稍為理解 CLI 的一些指令，下面也會介紹一下我認識的 CLI，當然如果有懂比較多的朋友，也可以交流一下，我會很開心的：D

一開始的接觸的就是下面這門課，其實看試看的就很夠了。

> 延伸學習：[Command Line 超新手入門 | Lidemy](https://www.lidemy.com/p/cmd101-command-line)

## 先求能用就好

工作上其實用滑鼠就可以做到很多事了，但有時候非 CLI 不可的時候，你就會覺得「書到用時方恨少」，例如：需要遠端操作主機的時候（好吧，純前端工程師可能真的不太用到）。

總之先來看看基礎的指令吧！

- cd
  切換資料夾路徑
- ls
  查看當前路徑資料夾有什麼檔案或資料夾
- pwd
  查看當前路徑位置
- touch（window 可能不適用，可以考慮先使用 git bash）
  新增檔案

這幾個指令會非常非常常用到，所以一定要記下來，但依筆者的學習過程，我認為：先掌握基本的指令就好，然後再慢慢增加指令，是最有效率的學習法！

例如：一次教你一堆指令，不用一個禮拜，兩天後你就全忘光了，那不如就先記幾個常用的吧，我覺得這也是老師故意的安排，只帶我們認識幾個常用的，而且在第一周就交了，為的就是讓我們提早熱悉 CLI ，因為之後會大量用到，越早熱悉越好！

最最最常用的應該就是 `ls` 了，剛學習時，一進來資料夾就先 ls 看一下有什麼內容，cd 後再 ls 一下，沒事就 ls 一下，漸漸的就記下來了！

還有一個不錯用的指令：`whoami` ，在自己電腦上使用可能無感，但如果是公司的電腦、有很多使用者的話，這個指令可以查看當前的使用者是誰，簡單說就是讓你的電腦知道「他爸是誰」，一不開心就問電腦 `whoami` ，他永遠不會反抗你的！

很多指令都是有意議的，看完上面的 `whoami` ，是不是不用特別記，你下次就記得了，是吧？

## 修行在個人

再來之後會用到 CLI 的地方大概就是專案了吧，很多文件也都會寫一點基本的用法。

例如：

```bash
# 開啟專案
npm run start

# 開發專案
npm run watch

...
```

其實這些都算 CLI 的指令，甚至各個工具、框架也都有自己的 CLI ，如：`vue-cli`, `git-bash`, `docker-cli`, `mysql-cli` ... 等

你說這麼多都要學也太累了吧！好在除了特別的功能不一樣，大多通用的功能指令都是一樣的，如上面的：ls、cd、pwd、touch 等等。

另外這幾個也是開發中非常好用的指令：

- mv
  移動檔案
- copy
  複製檔案
- rm
  刪除檔案

## 微進階的 CLI

上以的基本的部分都熟悉了，就可以尋找自己喜歡的指令，然後慢慢擴充他，很像玩遊戲練技能的感覺，哇今天又多學了一個指令，感覺像是多學了一個技能，這樣才能一直往前，不會固定在這邊。

再來我要分享幾個好用（但還是因人而異啦 XD）指令，也是我邊東看看西看看學來的

- open/start (Mac/Windows)
  開啟檔案
- code .
  開啟 VScode
- shutdown
  關機（shutdown -s -t 10）、登出（shutdown -l）
- exit
  關閉 terminal （你說我點個 X 不就好了，信不信我打完 exit 比你使用滑鼠精準地點到那個小小 X 還快，不信？好吧，我以前也不信，但學起來你就會信了）

另外下面這兩個都可以拆好多好多好多好多文章講了，要深可以深到馬里亞納海溝了 ...

- git
- vim

但筆者也非常喜歡這兩個指令呢！他們底下分別又多了很多的指令，目前也是使用 VScode 搭配 vim 插件在開發，水真的深，但使用熟悉了，長期下來開發效率會提升很多的（而且還很潮？）

如果也有興趣的朋友也可以 google 一下這兩個關鍵字，應該也是很多資源，之是都很摧眠就是了，例如：git 只會 pull/push 的話真的很可惜，還有很多強大的功能、vim 的話，可能只有會用的人才知道他的好

> 延伸學習：[Git - document](https://git-scm.com/doc)
> 延伸學習：[Vim - document](https://www.vim.org/docs.php)

## 總結

以上稍為簡單地介紹了一些 CLI ，當然這水還很深，等著你我去探索，雖然我也還只是個小小的 junior ，但我認為熟悉 CLI 是前往 senior 的門票之一，除了效率之外，CLI 也是跨入後端的必備技能，所以當然不能只停留在這！

但這邊多指令又該先學哪個呢？我覺得開心就好！

為什麼要學這個？因為我開心、我喜歡這個，比起盲目的去學一堆，我認為無壓力去學一個 `whoami` 指令開心多了，你說是吧？

## Ref

- [鳥哥私房菜](http://linux.vbird.org/)
- [Git - document](https://git-scm.com/doc)
- [Vim - document](https://www.vim.org/docs.php)

> 免責聲名

以上均為筆者自身經驗，難免小有主觀意見，供讀者們參考，也歡迎分享經驗交流。
如果有錯誤的地方還請大大們指正，筆者會立刻修改，再次感謝大家！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作係採用 [創用 CC 姓名標示 4.0 國際授權條款](https://creativecommons.org/licenses/by/4.0/) 授權。您可以在 [benben.me](https://benben.me) 找到我。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
