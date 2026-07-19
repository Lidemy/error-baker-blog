---
title: Warp | 你的 21 世纪 AI Terminal
date: 2023-05-31
tags: [Warp, Terminal, AI]
author: benben
layout: layouts/post.njk
image: https://hackmd.io/_uploads/HJsA77LE3.gif
lang: zh-CN
sourceLang: zh-TW
translationKey: benben/12-warp
permalink: /zh-CN/posts/benben/12-warp/
reviewedBy: benben
reviewedAt: 2026-07-18
publishedAt: 2026-07-18
sourceHash: dc6efe8097e148c5a389f5c80b1e859ba58b04ec0ae64cac12d66141d22cf35a
---

<!-- summary -->
<!-- 都什么时代了，你还在用传统的 terminal 并且设置各种 config 吗？ -->
<!-- summary -->

**！本篇文章将会介绍一个好用的开发工具 Warp，是一种 AI terminal，期望大家都能火速开发** :D

## 前言

<center>
  <img src="https://hackmd.io/_uploads/HJsA77LE3.gif" alt="warp-demo" class="post-image-width" />
</center>

> Warp demo by myself

阅读本文前建议知道 `terminal` 是什么最为佳。目前 Warp 只有推出 Mac 版本，所以可能要读者斟酌一下。然后不管是职业、业余或是转职中都可以阅读。或是，笔者自己有简单的分类：

1. level 1: `ls`
2. level 2: `ls -al`
3. level 3: `ls -altr`

小小测验，在不 google 的情况下，你知道上述指令的用途且知道参数的含义吗？你是属于上面的哪一种呢？如果你选了其中之一，恭喜你本文你应该都能轻松看懂。

你也有 **AI 焦虑** 跟 **工具焦虑** 吗？在这个什么都要 AI、什么工具都不断推陈出新的时代，最不缺的就是所谓的 "AI 工具" 了。其中也有不少只是过个水来凑热闹的，刚出来确实蛮新奇的，但是身为工程师看久了，就有底他是用什么做的，然后背后套一个 LLM（Large Language Model）罢了。比较火红的如 ChapGPT-3/4、BERT、XLNet 等等。

既然如此，究竟 `Warp` 这个 terminal 是不是只是套一个 AI 而已的 terminal 呢？让我们继续看下去～

想也知道当然不是！不然笔者就不会写这篇文章了，你说是吧？那就先来个简易的比较表格：

| 功能                   | Warp            | Window Terminal | iTerm2       |
| ---------------------- | --------------- | --------------- | ------------ |
| 个性化                 | ⭐️⭐️⭐️          | ⭐⭐            | ⭐           |
| 轻松复制 input/output  | ⭐⭐⭐          | ⭐              | ⭐           |
| Auto Completion        | 开箱即用        | 需安装、设定    | 需安装、设定 |
| 快捷键手册             | 内键（cmd + /） | 需另外找        | 需另外找     |
| 分页、分割视窗         | O               | O               | O            |
| AI                     | O               | X               | X            |
| 滑鼠可使用             | O               | X               | X            |
| cmd + a/z/x/c/v 可使用 | O               | X               | X            |

在本篇文章中，笔者会介绍 Warp 以及一些心得，内容大致如下：

- [前言](#前言)
- [简介及安装](#简介及安装)
- [个人化配置](#个人化配置)
- [使用方式及 AI](#使用方式及-ai)
- [心得推坑](#心得推坑)
- [Ref](#ref)

## 简介及安装

来看一下他们的官网，其实已经介绍得不错了（如果英文 OK 的话，也可以直接看），文件都很清晰。笔者当时开始使用时（约 2023/02），还没有 Live Demo 的影片（约 2023/04 更新的），只能看文件跟自己玩看看去探索。后来才发现他出来有一阵子了，差不多 2021 就推出了（根据 Youtube 上的官方频道），好像这阵子比较火红。当然也是很潮的用 `Rust` 开发，笔者会发现也是偶然看到其他 Tech Youtuber 介绍的。

<center>

[![Warp official demo](https://img.youtube.com/vi/XWQY8LgkiXM/0.jpg)](https://www.youtube.com/watch?v=XWQY8LgkiXM)

</center>

> 延伸阅读 [Warp](https://warp.dev)

但 **目前只有 Mac 平台** 可供下载。使用 `Window`、`Linux` 等其他平台的读者可能还要再等等了。

不过还是要先明声，这不是业配（Warp 看到可以考虑一下，喂！），但是 warp 官方那边也有提供一个小小推荐计划，推满 10 位好像会送一件衣服（比 leetcode 的衣服好拿太多了吧），但是不是一样穿上就太 Nerd 到交不到女朋友，笔者就不好说了（汗）。如果看完我的文章觉得有兴趣的话，还是可以用一下笔者的连结唷。

<center>
  <img src="https://hackmd.io/_uploads/r1Atcp24n.png" alt="warp-referral" class="post-image-width" />
</center>

> 推荐连结：<https://app.warp.dev/referral/VLL959>（拜偷 拜偷 感虾 感虾 🥹）

个人使用的话，不会有任何费用，所以不用担心还要填信用卡之类的，只会要你注册一下账号，就可以开始使用了。

对我的好处：

1. 教学相长、分享新知
2. 更深入研究 Warp 的功能

对你的好处：

1. 有个酷酷的 terminal，上班同事都会偷看你工作（好像也不太好），成为话题人物
2. AI 加成工作效率提升，如：Git、Vim 指令

不过在之前推荐给朋友时，我还不知道有这个推荐计划，就在读书会推了一些朋友了（呜呜），后来想想反正都要推了，就好好的写一篇文。之后有朋友有兴趣的话，我也可以贴文章给他了而不用再 live demo 一次了（Don't repeat yourself 原则）。

但其实不管有没有推广计划，我本来就会分享好用的工具了。那读者要不要装，也是取决在个人，如何装我也管不著，我就佛系推的概念啦。

安装方式，就如官网上的点击 `Download Now`，之后正常安装就可以了。安装、注册好后，就会看到如我首面图片的画面了（可能有些设定、主题不一样）。

## 个人化配置

- 外观

有内键多个主题，**万一没有喜欢的也可以自行设计**，并且有官方完整的教学，自由感十足。当然也可以设定字体、大小。比较特别的是他还可以直接设定 **透明度、Blur 效果**。以前笔者在 Windows（就是原生丑丑的黑白视窗）上搞了很久，后来改用 [`Window Terminal`](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701) 才有内键的设定。

<center>
  <img src="https://hackmd.io/_uploads/H1JZmAn43.png" alt="warp-setting" class="post-image-width" />
</center>

> Warp 设定页面

主题配置我是觉得官方出品的都还算不错（比起其他的内键主题真的还算都不错），可以挑一个顺眼的用就行了，字体预设也蛮好看的（预设是 Hack）。这边都还没讲到功能，只是外观而已，但光这些就已经深得笔者的心了 XD。

- Configuration

Warp 标榜 **零设定（Zero Configuration）**、开箱即用，完全不用另外设定、安装套件，不用再一直备份你的 `.zshrc`、`.bashrc`。

我们来试一些常用的功能：

**自动路径完成** 的功能：在根目录 `/` 下，输入 `cd` + 按 `Tab` 键就会呈现当前的文件夹，可以使用上、下切换，按 `Enter` 会自动完成。

<center>
<img src="https://hackmd.io/_uploads/BkqDHA2N3.png" alt="warp-setting" class="post-image-width" />
</center>

> 开箱即用 | 自动路径完成

**Git 指令** 的功能：输入 `git log` + 按下 `Tab` 键就会呈现当前可以用的指令，可以使用上、下切换，按 `Enter` 会自动完成。

<center>
  <img src="https://hackmd.io/_uploads/BkKMUA24h.png" alt="warp-setting" class="post-image-width" />
</center>

> 开箱即用 | 自动 Git 指令完成

当然还有很多更强大的功能，笔者这边就不一一示范了，可以参考还有哪些 [Warp 支持的指令](https://docs.warp.dev/features/completions)。

## 使用方式及 AI

- 像一般的 Terminal 使用

当然你可以像一般的 terminal 一样使用他，输入正常的 linux 指令，如开头的指令 `ls` 都可以直接使用。如果不需要其他酷酷的功能也可以像一般的 terminal 一样使用它就好了，但这样好像也就不用 warp 了（笑）。

- 分页

笔者以前就觉得分页的功能很好用，不知道是以前的 terminal 没有，还是笔者不会用。总之呢，以前要多开 terminal 就会多开一个 app，然后万一开了很多个（像是 docker、front-end、back-end，日常使用的每个都开一个 terminal），就常常要找来找去。这时候如果有一个整合好的 terminal 就好了。

有的，那时候笔者有找到一款 terminal。对，就是 `Window terminal`。那时候也是主打可以整合多个 terminal 在一起。如果是 windows 的使用者还是可以考虑使用看看的。我知道传统的 cmd 视窗、Power Shell 的各种问题，可能就先给使用者不好的印象了，但 Warp 也还没支援 Windows，所以可以先试试看 `Window terminal`。其实笔者以前也在内部的读书会，推荐给朋友过。

在 Warp 中分页非常简单直觉，操作如下：

1. 按下 `cmd + t`，开启新的分页
2. 按下 `cmd + shirt + [`，向左边切换视窗
3. 按下 `cmd + shirt + ]`，向右边切换视窗
4. 按下 `cmd + w`，关闭当前的分页

基本上，跟使用 VScode 的操作差不多，熟悉的话也不太需要特别记忆。

- 分割视窗

这边的 `分割视窗` 跟上面的 `分页` 是完全不一样的功能，我开始使用也常搞混。其实这也是 `Window terminal` 有的功能，但 warp 有内键的快捷键可以简单使用，也可以设定自己喜欢的快捷键，但预设的也算好记。

在 Warp 中分割视窗，操作如下：

1. 按下 `cmd + d`，开启水平分割视窗
2. 按下 `cmd + shift + d`，开启垂直分割视窗
3. 按下 `cmd + option + 上下左右`，在 Warp 中速切换分割视窗了

- AI 功能

在这个时代，好像什么都要来点 AI，但也算稀松平常了吧。Warp 当然也有内键的 AI 可以使用。

只要在输入指令的地方前面加入 `#`，就可以进入搜寻模式了，再输入想查询的内容，就可以轻松地使用 AI 查询指令了，例如：

<center>
  <img src="https://hackmd.io/_uploads/HJsA77LE3.gif" alt="warp-demo" class="post-image-width" />
</center>

> 在上面的图片中，笔者查询了如何将文件移除 Git（How to remove file from git）。

比较少用的指令真的很容易忘，有时候为了这点小事还要去某个藏在书签中的 git cheat sheet 或是去翻 stack overflow，就显得有点浪费时间。这时候 Warp 就可以派上用场了，读者可以简单体验一下 warp 的威力。

当然有时候比较复杂的使用情况，就可以试试更进阶的搜寻功能。

可以在 Warp 的右上角中点击 **闪电的图示**，叫出进阶 AI 搜寻面板，也可以按下快捷键 `ctrl` + `shift` + `space`（预设是这个快捷键），但有可能被其他的 App 盖过去，需留意一下，也可以在设定的地方修改快捷键。

这样就可以输入更多的 prompt 让 AI 去搜寻了，但是这边的搜寻是有限制次数的，**一天 100 次**，隔天会归 0，也不难理解啦，毕竟 Chat-GPT 也都收费的 Chat-GPT 4 了。

进阶的搜寻功能可以多加利用，万一次数用完了也不用担心，上面使用 `#` 的 **一般搜寻是没有限制次数的**，可以安心使用！

## 心得推坑

虽说是推坑，但我个人是真的很喜欢 Warp，除了各种个人化的配置档、很多好用的内键功能、AI 辅助。好工具推推。Warp 是个人免费使用的，但目前（2023/05）只有 Mac OS 平台上才有，但未来其他平台应该会推出，有兴趣的读者可能还要再等等了。

另外，私心觉得 Warp 官方的 Developer Advocate（这个不知道怎么翻，倡导开发者？）Jess 很猛，口条很好、有时又带点搞笑，完全颠覆我对这种技术教学的印象，也在她身上学到不少。想了解更多 Warp，推荐大家也可以看一下 Warp 的官方 demo。

如果看完笔者的介绍，也有兴趣的话，可以用 [笔者的推荐连结](https://app.warp.dev/referral/VLL959) 注册唷 🥹。

这边再帮读者整理一个 Warp 常用的懒人包：

- 免设定麻烦的设定档，开箱即用
- 分页：
  - 新增 `cmd + t`
  - 关闭 `cmd + w`
  - 往左边切换 `cmd + shift + [`
  - 往右边切换 `cmd + shift + ]`
- 分割视窗：
  - 新增垂直视窗 `cmd + d`
  - 新增水平视窗 `cmd + shift + d`
  - 关闭 `exit`
  - 切换 `cmd + option + 上下左右`
- AI：
  - 一般搜寻输入 `#` + 你要查的指令
  - 完整搜寻 `ctrl` + `shift` + `space`

光以上这些指令，已经可以减少不少使用滑鼠的时间了。如果再加上 `Raycast` 跟 `Vim`，根本不用滑鼠了吧（咦）一起加入键盘魔人吧！

差不多是这样啦，我们下次见～

Happy Coding ~

## Ref

- [Warp](https://warp.dev)
- [Warp official demo](https://www.youtube.com/watch?v=XWQY8LgkiXM)
- [Warp 支持的指令](https://docs.warp.dev/features/completions)
- [Window Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701)
- [笔者的推荐连结 🥹](https://app.warp.dev/referral/VLL959)

> 免责声明

以上均为笔者自身经验，难免掺杂主观意见，仅供读者参考，也欢迎分享经验交流。
如果有错误的地方还请大佬们指正，笔者会立刻修改。再次感谢大家！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作采用 [创用 CC 姓名标示 4.0 国际授权条款](https://creativecommons.org/licenses/by/4.0/) 授权。您可以在 [benben.me](https://benben.me) 找到我。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
