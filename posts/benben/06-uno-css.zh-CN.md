---
title: Uno CSS —— 统一天下的明日之星？
date: 2022-05-18
tags: [CSS, UnoCSS]
author: benben
layout: layouts/post.njk
image: https://i.imgur.com/XRsgu8H.png
lang: zh-CN
sourceLang: zh-TW
translationKey: benben/06-uno-css
permalink: /zh-CN/posts/benben/06-uno-css/
reviewedBy: benben
reviewedAt: 2026-07-18
publishedAt: 2026-07-18
sourceHash: b5ee1c9e34372faa2e9cf2d9e614e8e4fa83178ca4eef4b4f6b18d5208d4530c
---

<!-- summary -->
<!-- 用 Uno CSS 统一天下 CSS！？ -->
<!-- summary -->

## Intro

嗨嗨！又是我！

之前接的一个小案子，也准备要结案啦！开心开心，希望可以顺利结案，这样才有更多的时间写 Error Baker 啊！

那么直接进入正题，这次要分享的是：**Uno CSS**！

<center>
  <img src="https://i.imgur.com/LQrk0DN.png" class="post-image-width" alt="uno css logo" />
</center>

> 图片来源：[Uno CSS Github](https://github.com/unocss/unocss)

简单说，它是一个 **Tailwind** 的替代 CSS 解决方案，没有繁琐的设定（~~我没有说 Tailwind 的设定很繁琐喔~~），可以直接使用。你可以说它抄袭 Tailwind，但是它还有更强大的功能，例如：`正则表达式` 的配置等等（这边容笔者先卖个关子）。看完这篇或许会有不一样的想法喔！

比起目前前端的三大框架，CSS 的写法百百种（SASS/SCSS、Bootstrap、Tailwind、WindyCSS、CSS in JS 系列……等）。那要学还是不学 Uno CSS？我觉得就看个人囉！但是如果，你已经会了 Bootstrap 或是 Tailwind 了，那么学习 Uno CSS 非常 **直觉**，因为 Uno CSS 整合了这些习惯用法！

有点心动了吗？还是还在犹豫呢？那我稍微介绍一下作者：[antfu (Anthony Fu)](https://github.com/antfu)。如果是熟悉 Vue 生态圈的读者们，一定听过他的大名。他是 Vue、Vite 核心成员之一；Windi CSS、VueUse 开发者之一。我也是学习 Vue 才开始 follow 他的，大大呢非常的狂，有机会再写一篇介绍 antfu 大大的文章。

## TL;DR

> 成为工程师时，学到的新潮用语：Too Long; Didn't Read。

刚刚说学习 Uno CSS 很直觉？怎么说呢？以 Tailwind 为例，刚接触 Tailwind 的开发者（甚至熟练的开发者也还是常碰到），在开发一定会遇到的挫折。

例如：

> in tailwind css

```html
<div class="w-25"></div>
<!-- error!: no `w-25` class -->
<!-- notice!: this `w-25` class mean 6.25rem, because 1 : 0.25rem in tailwind -->
```

首先，在 tailwind 中，没有 `w-25` 这个 class，因为它通常是 2 的倍数：1、2、3、4、5、6、12、24、48、60、96……等（有可能还会漏掉）。有个比较要注意的小地方：这里的 `w-25` 指的是 `6.25rem` 的宽，因为在 tailwind 中 w 的单位是 `1 : 0.25rem`。

再来，还很常碰到一种状况，你不知道数字代表的单位是什么。看同一个例子：`w-25` 的 25 是什么单位？%？px？rem？0.25rem？除非去看文件或装 tailwind 的插件，才知道是什么。而且常常不同的单位都不一样，`m-4`、`border-3`、`text-lg`、`shadow-sm`，你能用看得就说出分别是多少吗？如果能直接说出来的人，笔者给你拍拍手。

最后，如果我就是要用 `w-25` 这个 class 怎么办？必须要去翻文件找设定档，然后加了一堆设定档。一时加一时爽，一直加一直爽。最后你的设定档可能比你自己写 CSS 之类的还来的多。这时候的你一定会冒出：「我为什么要用 tailwind？还不如自己写？」这是对新手如我来说很常碰到的状况。但这部分随着熟悉度还会越来越好的啦！

另一方面，来看看 Uno CSS 的情况：

> in uno css

```html
<div class="w-25"></div>
<!-- ok!: auto generate `w-25` class -->
<!-- notice!: this `w-25` class mean 6.25rem, uno css take care this for us -->

<!-- If I want to `25px` width -->
<div class="w-25px"></div>
<!-- ok!: auto generate `w-25px` class -->
<!-- notice!: this `w-25px` class mean 25px, uno css take care this for us without other syntax -->

<!-- If I want to `25rem` width -->
<div class="w-25rem"></div>
<!-- ok!: auto generate `w-25rem` class -->
<!-- notice!: this `w-25rem` class mean 25rem, uno css take care this for us without other syntax -->
```

用了 Uno CSS 上述的问题全部解决：数字问题、单位问题、设定档问题。

（自从用了 Uno CSS 切板都 100 分呢！）

笔者第一次遇到这种情形，非常之惊奇，这是什么巫术！

再来牛刀小试一下：

> in uno css

```html
<div class="w-777"></div>
<!-- ok!: auto generate `w-777` class -->
```

![uno css class](https://i.imgur.com/4Rnomte.png)

> 图片来源：笔者的 VS Code。

没有在跟你五四三的！0 设定档、自动生成！

要不要试试看 77777777777777 行不行？这边留给有兴趣的人试试看了。先刷一波 77777777777777。

其实这不是什么魔法，聪明的小当家一定猜到了，是「**正则表达式**」！我加了正则表达式。

> 延伸阅读：[简易 Regular Expression 入门指南 - Huli](https://blog.huli.tw/2020/05/16/introduction-to-regular-expression/)

## Efficacy

光上述正则表达式的功能就打动我的心了！其实自动推导的功能在 Windi CSS 就有了，但 Uno CSS 在效能方面也是非常之神速啊！

来看看跟其他工具的跑分：

```md
3/26/2022, 11:41:26 PM
1656 utilities | x50 runs (min build time)

none 12.42 ms / delta. 0.00 ms
unocss v0.30.6 20.98 ms / delta. 8.57 ms (x1.00)
tailwindcss v3.0.23 1621.38 ms / delta. 1608.96 ms (x187.79)
windicss v3.5.1 1855.86 ms / delta. 1843.45 ms (x215.16)
```

> 数据来源：[uno css github](https://github.com/unocss/unocss)

哇！这速度可以说是海放所有人了吧！

但 `Uno CSS` 非常低调（？），页面中 [uno css github page](https://github.com/unocss/unocss) 加入了这项说明：`Inspired by Windi CSS, Tailwind CSS, and Twind, but: ...`

也不会说 X 打某某某、最棒的 CSS Library……等（~~迷之音：PHP 是最棒的程序语言~~）。

相反地，Uno CSS 甚至 **整合了其他常用 CSS Library 的 CSS 样式**！

例如：ml-3（Tailwind）、ms-2（Bootstrap）、ma4（Tachyons）和 mt-10px（Windi CSS）全部都可以用啦！

> in Uno CSS

```css
.ma4 { margin: 1rem; }
.ml-3 { margin-left: 0.75rem; }
.ms-2 { margin-inline-start: 0.5rem; }
.mt-10px { margin-top: 10px; }
// all works!
```

这也是为什么笔者说，只要学了 Tailwind、Bootstrap……等，在学习 Uno CSS 的时候会很快了。因为你已经熟悉了某些样式的写法了。但是如果 `只学了 Bootstrap 再学 Tailwind` 或是 `只学了 Tailwind 再学 Bootstrap` 都会多一个时间成本！因为不同工具写法略有不同。

## Document

一个好的 Library 怎么可以没有文件！

其中文件的好坏又会影响 DX（develop experience），有好的 DX 其实也是蛮重要的！

工程师写 code 写得开心，bug 就会减少；
bug 减少，使用者 / 客户就开心；
使用者 / 客户开心，老板就开心；
老板开心，你就加薪（~~并不会~~）。

以 DX 来说 Vue 生态系的其实都不错。例如：Vite（Vue 生态系的开发工具，而且也支持 React 等各大框架唷）。这真的用了就回不去了，开发神之快速！Vite 甚至有套件支持 Ruby、Laravel！

> 延伸阅读：[Vite](https://vitejs.dev/) 真的不用一下吗？（~~就是不想用的话，那我也没办法了 XD~~）

另外 Vue 的官网 [Vue](https://vuejs.org/) 已经支持暗色主题（约 2022/02 开始）啦！真香！

React 的官网 [React](https://reactjs.org/) 目前 React `18.1.0` 版（约 2022/05）依然没有暗色主题（~~每次翻 React 文件都刺眼~~），官网甚至有点 outdated（但还是写得不错啦）。我想初学 React 的开发者都很头痛：我应该要先学 classes component 还是 function component + hooks？这边应该有体验过的朋友们，真的是有苦说不出！这边就留给读者自行意会（其实应该要先学好 JavaScript？）。

好了！这边先打住，不然要战起来了。

其实两边官网的内容都还不错，都写得很详细！有心的话，认真读完文件，应该都是可以上手的（前提是要有心，不然还是建议去找个教学会比较省时间）。

回来看看这次 Uno CSS 的文件吧！

![uno css document](https://i.imgur.com/sdBwpo0.png)

> 图片来源：[UnoCSS Interactive Docs](https://uno.antfu.me/)

其实文件也才刚 Beta 没多久。一进来看到非常的洁简，没有酷炫特效、没有夸大的标题、非常直觉，就是找你要找的东西，有种 Google 的既视感（？）。

来查查刚刚的 `w-25` class……

![uno css document search](https://i.imgur.com/qKurIGO.png)

> 图片来源：[UnoCSS Interactive Docs](https://uno.antfu.me/)

搜寻结果一出来，除了最重要的 `width: 6.25rem` 外，还有 `regex` 的用法、连结，甚至连 `MDN` 的连结都有，全部帮你整合好了！

真的是目前为止 DX 体验最棒的文件。开发时间不多的话查到想要的资讯就可以闪了，时间多的话可以深入了解一下 CSS 的原理、复习一下 regex 用法等等。真的闲到发慌的话（~~可以跟我说是哪间公司吗~~），可以试试按 `random` 看看。

## Summary

在前端的路上，一路从学习 React 到默默变成 Vue 形状了，我觉得蛮棒的。可以同时学习两边的一些技巧，没有哪个好哪个不好。优缺点可以一起比较。在前端这个快速发展的领域中，更要保持开放的心态。通常会去争论哪个框架好的，通常也只有学那一个框架。少有看到有人各框架都精通了，然后说哪个框架最棒。各有不同的 `trade off`，争论该用哪个框架，应该已经是个伪议题了。就如你不会说我学了 HTML、不学 CSS 一样，只是你要先学哪个？又要学得多深？

现况（截至 2022/05）来说 **React 确实较多人用、薪水比较高**，但在 **文件、DX 体验跟包容性 Vue 真的好得没话说**，更是难以想象 Vue 背后没有大公司的支持。甚至在 Vue 作者（尤大大）的推文中，不时会看到 React 派的留言，如：`Why not React?`

回到 `Uno CSS` 身上，仿佛可以看到一点点 Vue 当时的影子。成长性非常强，蛮有机会成为明日之星的。我觉得好的工具值得被更多人知道，但软件的世界是 **没有银弹的**，但要不要使用就是看个人了。

那么最重要的：`Uno CSS` 可以用在 Production 上了吗？现阶段来说，还不是正式版，最后的 API 不保证不会改动。但可以在小项目试试。笔者在自己小项目用了，开发体验非常棒，所以才有了这篇文章。笔者也非常期待 `Uno CSS` 的上线版！

个人是觉得，不管有没有要用都可以关注一下！想了解更多的话，非常推荐看一下 `Uno CSS` 作者 AntFu 写的这一篇：[重新构想原子化 CSS](https://antfu.me/posts/reimagine-atomic-css-zh)，就算没有要用 `Uno CSS` 也可以学到很多东西。

## Ref

- [UnoCSS Interactive Docs](https://uno.antfu.me/)
- [Windi CSS](https://windicss.org/)
- [Bootstrap](https://getbootstrap.com/)
- [Sass](https://sass-lang.com/)
- [简易 Regular Expression 入门指南 - Huli](https://blog.huli.tw/2020/05/16/introduction-to-regular-expression/)
- [Vite](https://vitejs.dev/)
- [重新构想原子化 CSS](https://antfu.me/posts/reimagine-atomic-css-zh)

> 免责声明

以上均为笔者自身经验，难免掺杂主观意见，仅供读者参考，也欢迎分享经验交流。
如果有错误的地方还请大佬们指正，笔者会立刻修改。再次感谢大家！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作采用 [创用 CC 姓名标示 4.0 国际授权条款](https://creativecommons.org/licenses/by/4.0/) 授权。您可以在 [benben.me](https://benben.me) 找到我。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
