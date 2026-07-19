---
title: Raycast | 不完全手册
date: 2025-07-31
tags: [Raycast, AI]
author: benben
layout: layouts/post.njk
image: https://img.youtube.com/vi/NuIpZoQwuVY/0.jpg
lang: zh-CN
sourceLang: zh-TW
translationKey: benben/15-raycast-101
permalink: /zh-CN/posts/benben/15-raycast-101/
reviewedBy: benben
reviewedAt: 2026-07-18
publishedAt: 2026-07-18
sourceHash: cfcaead7ff5ab31c75aaee34d0e0ad1596c54ea0bd4742d52c9c674aa5758feb
---

<!-- summary -->
<!-- 写给朋友的 Raycast 使用手册！ -->
<!-- summary -->

**！本篇文章将会介绍笔者 Raycast，老样子参考觉得对你有帮助的就行了** ：D

[![](https://img.youtube.com/vi/NuIpZoQwuVY/0.jpg)](https://www.youtube.com/watch?v=NuIpZoQwuVY)

> Raycast 官方的 101 Demo

大家安安，2025 也要过一半多了，我的天！上一篇写文章是 1 年半前了 😱

这次要写 Raycast！也算是填了上一篇的坑了 🤣
Raycast 主要是 for MacOS 使用的，目前 for Window 版的还在 Beta 中～

> （Ps. 目前笔者还有 2 组 Window 的优先邀请码，有需要的读者可以来信～）

目前大多功能都是可以「免费」用的，所以可以放心下载。但因为笔者有订阅 Pro，所以也会一并分享一些 Pro 的功能。刚推出时，Pro 功能还很阳春，像是可以自定义颜色。天啊！我能不买吗？（<= 超爱自己客制化颜色、主题的人）。笔者还算是蛮早期就订阅 Pro 了。

## 安装

最一开始 Raycast 算是取代 Mac 厂「Spotlight」的一个软件，但随着生态系发展，俨然远远超过 Spotlight 了。除了原本 Spotlight 的功能，还有更多功能、客制化程度很高，甚至可以自己开发一个套件（使用 React）。

首先安装 Raycast ！

> 可使用我的推荐连结来安装：[https://raycast.com/?via=benben](https://raycast.com/?via=benben)

然后 **把原厂的 Spotlight 关掉**，这样我们的 Raycast 就不会跟 Spotlight 打架了，因为两个都是 `⌘` + `space` 的指令。

那怎么关掉呢～？

<center>
  <img src="/img/posts/benben/15-raycast-101/15-1.png" class="post-image-width" style="width: 480px" alt="图 1" />
</center>

<center>
  <img src="/img/posts/benben/15-raycast-101/15-2.png" class="post-image-width" style="width: 480px" alt="图 2" />
</center>

> 请参考这边的手把手教学

当然如果读者用不习惯 Raycast，一样可以参考这边的操作改回来的～到这一步骤，就算大功告成了 🎊

可以先拿来「启动应用程序」，之后的再自己慢慢研究也没问题的 👍

有事没事就按下 `⌘` + `space`，然后搜寻你想打开的应用程序！

<center>
  <img src="/img/posts/benben/15-raycast-101/15-3.png" class="post-image-width" style="width: 480px" alt="图 3" />
</center>

## 基础

接下来笔者会分享一些简单好用的功能～

### 1. Emoji

因为笔者也是个蛮爱用 Emoji 的人，应该多少感受得出来吧 😂

> Tips: Mac 原厂有一个快捷键可以打开 Emoji 选择器：`⌘` + `Ctrl` + `Space`

但原厂的功能非常阳春（欸 2025 了 X）。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-4.png" class="post-image-width" style="width: 480px" alt="图 4" />
</center>

> 原厂 Emoji 选择器的介面

我们可以使用 Raycast 的 `Search Emoji & Symbol`，通常 Raycast 的右下角都可以查当前有什么「可用操作」Actions。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-5.png" class="post-image-width" style="width: 480px" alt="图 5" />
</center>

> Raycast Emoji 选择器的介面

例如：我可以把喜爱的 emoji 钉选起来。

> Pro Tips: 把 `⌘` + `Ctrl` + `Space` 设成 Raycast 的 `Search Emoji & Symbol` 快捷键

### 2. 剪贴簿记录

有时候工作常常会需要 Copy/Paste 别的东西，但你突然会用到一个昨天精心写的文案，那是你花了好久写好的，但是也想不起来存在哪个深层的文件夹里了。你心想要是能去「剪贴簿记录」找找就好了。

这时候我们的好朋友 Raycast 也可以帮上我们的忙！

<center>
  <img src="/img/posts/benben/15-raycast-101/15-6.png" class="post-image-width" style="width: 480px" alt="图 6" />
</center>

### 3. Change Case

命名是个难题，尤其是前后端合作上。后端因为语言的不同，命名的传统上也不太一样，可能拿到后端的文件，上面命名是后端的方式，这时候会想要把某个 Case 换成别的 Case。

我们可以使用 Raycast 的 `Change Case`。

例如：UserMessageId <= 把这选取起来，然后使用 `Change Case` 的功能。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-7.png" class="post-image-width" style="width: 480px" alt="图 7" />
</center>

> Change Case 的功能

### 4. Snippet

这个功能在 Coding 的领域很常用，但不知道怎么翻译成中文，所以先继续以英文 Snippet 称呼。简单说就是「一段可以重复使用的片段」，但不一定是 Code，也可以任何文字。

例如：很常见的公司资讯。

```md
Error Baker 有限公司
地址：太阳系 地球星球
电话：666-666-666
网站：https://blog.errorbaker.tw/
```

- 首先把想要重复的文字复制起来
- `Create Snippet` 创建一个新的 Snippet
- 设置 Keyword，做为触发的 Trigger

<center>
  <img src="/img/posts/benben/15-raycast-101/15-8.png" class="post-image-width" style="width: 480px" alt="图 8" />
</center>

设置完后，下次打「@error-baker;」，把就会把上面那段文字变出来了 🧙

> Pro Tips: 设置 Snippet 的「开头」跟「结尾」，以防触发了不想触发的 Snippet

### 5. Kill Process

Raycast 还可以用来关掉应用程序，包含背景的应用程序，要关掉当掉的程序之类的蛮方便的。打开 Raycast 的 `Kill Process` 的功能，就可以看到当前的程序，并且可以依照「CPU」或是「RAM」的用量排序。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-kill-process.png" class="post-image-width" style="width: 480px" alt="图 kill process" />
</center>

## Store

虽然它叫 Store，但都是 `免费` 的「Raycast 套件」，有官方做的，也有其他开发者做然后分享上来的。笔者三不五时就会上去，看看有什么热门的套件可以试试看的。

像笔者就装了以下：

- 第三方软件类：Spotify、Arc、Brew
- 生产力工具：Timer、Color Picker、Year in Progress、Scan QRcode
- 软件相关：Lorem Ipsum、Test Internet Speed、TinyPNG

没有的喜欢的话，甚至可以自己开发一个套件。当然你写了一个很赞的 Raycast 套件，你也可以分享上去，然后供其他 Raycast 使用者下载！

> 延申阅读：[Raycast 的 Store](https://www.raycast.com/store)

## 视窗管理

可以把当前 Focus 的 APP 往左或往右 50% 分割对齐，算是很常使用到这个场景：

- 一半写 Code，一半看预览
- 一半看线上课程，一半写笔记
- …… 等

我们可以打开 Raycast 的 `Left Half` 跟 `Right Half` 来触发功能。

也可以使用快捷键，像是：

- 往左 `Ctrl` + `Opt` + `←`
- 往右 `Ctrl` + `Opt` + `←`
- > 上面的也可以设定循环：1/2、2/3、1/3
- 置中放大 `Ctrl` + `Opt` + `Enter`
- 加大 `Ctrl` + `Opt` + `+`
- 减小 `Ctrl` + `Opt` + `-`

以上这些都是免费的功能！

如果是 Pro 的话，可以应用更客制化的设定开启的 App～

例如，要同时完成以下的步骤：

- 把左边 50% 设定成 VScode
- 右边 50% 设定成 Arc 并 **打开「localhost:3000」**

然后把上面这个设置（Layout）储存下来。如果你想要，也可以设定一次开启更多 App。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-layout.png" class="post-image-width" style="width: 480px" alt="图 layout" />
</center>

下次就可以「一个指令」打开了，又更快地进入社畜模式了，是不是很赞啊。

## AI 功能

免费的就有一些 AI 扣打功能可以用了，还蛮佛的。目前（发文当下 2025/07/25）是 **50** 次，以下的 Raycast AI 功能可以使用！

### 1. Raycast AI（需订阅 Pro）

这个就算是把 ChatGPT 的功能在 Raycast 上使用。虽然笔者是位前端工程师，几乎开着电脑，浏览器也都会开着，但有时候还是会觉得再多开一个分页，再打开 ChatGPT 的网址，还是慢了一点点。如果只是问个简单的问题，好像也不用这个劳师动众。这时候使用 Raycast AI 的功能就还蛮不错的～

一样打开 Raycast，这次输入你要问的问题，然后按下 `Tab`，然后就可以当成 ChatGPT 使用了～

### 2. Translate（需订阅 Pro）

因为笔者的英文不是很好，常常会需要翻译功能，看文件、看 Email、跟同事往来等等。当然现在 Google 翻译很方便，但跟上面 ChatGPT 的情况一样，很多时候你只是想要快速一个翻译，不用太多细节。当然！也不想专门打开一个浏览器分页（这很重要）。

一样可以看一下有什么好用的 Action。笔者很常使用的有交换（`⌘` + `S`）、切换语言（`⌘` + `P`）等等。

<center>
  <img src="/img/posts/benben/15-raycast-101/15-translate.png" class="post-image-width" style="width: 480px" alt="图 layout" />
</center>

> Translate 功能

### 3. Fix Spelling and Grammar（需订阅 Pro）

有时候会需要写一些英文，像是：Email、README、跟外国同事沟通等等。有使用文法不够正确，造成别人的误会就不好了。使用 `Fix Spelling and Grammar` 的功能，可以让我们：

- 修改拼字跟文法：`Fix Spelling and Grammar`
- 让文字变长：`Make longer`
- 让文字变短：`Make shorter`

> 其他的可以参考设定里的 AI 功能

<center>
  <img src="/img/posts/benben/15-raycast-101/15-ai.png" class="post-image-width" style="width: 480px" alt="图 layout" />
</center>

## 总结

是的，当我们开始把一些小功能取代掉，能在一个介面完成的事，就不用再去多开一个 App 或是分页了。像是 Color Picker 功能 Raycast 也可以使用，所以就把相关的 App 删除了。不失也是一种减法哲学。

这一份不完全手册就介绍到这边～当然这只是一部分的功能，剩下的还得到读者去发掘了！如果有想分享的酷用法也可以在下面留言交流唷！

感谢看到这里的各位，给自己一个掌声 👏🏼

> （Ps. 目前笔者还有 2 组 Window 的优先邀请码，有需要的读者可以来信～）

对了！Raycast 也有 Conffetti （彩带）的功能 🎊

<center>
  <img src="/img/posts/benben/15-raycast-101/15-wrapped.gif" class="post-image-width" style="width: 720px" alt="图 15-wrapped" />
</center>

> Conffetti 功能，但需先下载 Raycast 的套件

好啦～忙完了一天，要把电脑休眠（Sleep）了（迷之音：听说 Mac 的使用者都很少关机的）。

熟练地打开 Raycast，输入「Sleep」按下 `Enter`。

平安一天又过去了，感谢 Raycast 的努力！

我们下次见！ 👋🏼

## Ref

- [Raycast](https://raycast.com/?via=benben)
- [Raycast 的 Store](https://www.raycast.com/store)
- [Raycast 101 | 官方 Youbube](https://www.youtube.com/watch?v=NuIpZoQwuVY)

> 免责声明

以上均为笔者自身经验，难免掺杂主观意见，仅供读者参考，也欢迎分享经验交流。
如果有错误的地方还请大佬们指正，笔者会立刻修改。再次感谢大家！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作采用 [创用 CC 姓名标示 4.0 国际授权条款](https://creativecommons.org/licenses/by/4.0/) 授权。您可以在 [benben.me](https://benben.me) 找到我。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
