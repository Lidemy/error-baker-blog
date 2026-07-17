---
title: 共笔中的共笔 —— 以 JavaScript30 为例
date: 2021-10-26
tags: [JavaScript, collaborative]
author: benben
layout: layouts/post.njk
image: https://i.imgur.com/ZmEEvep.png
lang: zh-CN
sourceLang: zh-TW
translationKey: benben/03-collaborative-writing
permalink: /zh-CN/posts/benben/03-collaborative-writing/
draft: true
sourceHash: 20e73037b71eb4857b22ba258533ef1d6bff41df6908e23607d7a9a47016fc2f
---

<!-- summary -->
<!-- 写过共笔吗？如果没有就自己发起吧！ -->
<!-- summary -->

![imgur picture](https://i.imgur.com/ZmEEvep.png)

> 图片来源：imgur

## 前言

嗨嗨！笔者的第五期 Lidemy 导师计划刚结束了，大家过得还好吗？整个过程也是有血有泪、可歌可泣啊 ><。希望大家也都顺利毕业！

原本以为毕业之后应该会顺利一点，但之后还要面对求职大魔王啊，看来我想得真是太美好了。想说之后应该比较有时间的可以写文章的说 XD

这个计划的六个月说长不长说短不短。有些人也在期间做了很多事、研究了不一样的东西，大家也都成长不少吧！这篇文章算是笔者在学习时期「发起共笔读书会」的一个小回顾。之前听到学长姐的公司有读书会，觉得蛮不错的。不确定大家的公司有没有读书会，如果有的话那很棒，没有的话就自己发起吧！

## 缘起

为什么会有这个共笔读书会活动呢？缘起是这样的。因为笔者还在 Lidemy 学习时，一直都会做笔记，相信大家都跟笔者一样认真。有一天大家在聊天时（在 gather.town 上面，可以想成是自由版本的 google meet，可以自由去别的空间聊天、开会等等），我推荐大家 **JavaScript30** 这个免费的学习资源。但我其实也才看了 5 篇左右，但是真的觉得这个资源很不错，于是突发奇想「要不我们来办一个读书会」，主题就是：JavaScript30。刚好这也是适合新手的学习资源，非常适合还是新手的我们。找了几个人一起轮流分享，顺便练习自己的解说能力，然后再分享给其他人听。听的人可以不只我们自己人，其他 gather.town 上的人也都可以听。

> 延伸学习：[JavaScript](https://javascript30.com/)

JavaScript30 一直是我觉得不错的免费资源，只是要先注册一下才可以看这样。分享给大家的时候，大家也觉得不错，也有人之前就注册过了，但跟我一样注册完一直没看（笑）。毕竟是免费的嘛，只要是免费的就会觉得：「啊！反正之后还有很多时间可以看」然后就会一直放着了。对！我就是这样。但如果要分享给别人就不一样了。

因为有要分享给别人的动力，会逼迫你一定要去看、要去了解，或是至少要看懂要分享的部分，所以动力也会比较足够。比起「免费的先领起来长灰尘」来说，这个动力绝对多很多，甚至比起你自己看的了解程度也会多很多。这是我自己参加完的心得，但应该很多人也有这样的感觉。

## 选择你的工具：HackMD / CodePen

首先，先来介绍在线笔记软件 **HackMD** 吧。因为要可以共笔嘛，所以「在线的功能」是必备的。当然也可以用 Notion 之类的。总之要大家都可以接受并愿意使用的在线工具。HackMD 是一个在线的 **markdown** 编辑器。markdown 简单来说就是 github 里 `README.md` 的 `.md` 档，可以让人快速写出文件格式的写法，有点像是 **HTML** 的简化版——简单明了的写法，当然要客制化比较难一点。

再来是在线 IDE **CodePen**。因为我们有写代码的需求，又需要一个即时可以编写、执行的环境，所以一个轻巧的在线平台是觉得很棒的工具。其他像是 CodeSandbox 等可能也不错，但因为我们的 JavaScript30 只会用到原生的 HTML、CSS、JavaScript，显然 CodePen 比较适合我们的需求，于是就选择了这个平台作为 demo 的平台。

有了这两个核心的平台，就差不多可以准备共笔了。可以简单打一下介绍，如：`README.md` 的文件那样，简单地描述一下要怎么开始读书会、时程之类的。更简单来说就是：「人、事、时、地、物」这些都说明白，才不会让人不知道要干嘛。

## 开始共笔吧

既然工具都有了，就准备开工吧。当然也都可以选择自己喜欢的工具啦，但要记得工具只是辅助并非一定。

因为是笔者发起的，所以就先帮大家准备简单的模板：

```markdown
# Title

## HTML

## CSS

## JavaScript

// 其他補充 ...

```

大概是酱。因为都是原生的 HTML、CSS、JavaScript，由这三个面向去解说一定不会错。虽然主要是 JavaScript，但也可以看看 HTML 怎么规划的，有时候 CSS 也会有特别的东西。只要是你学到的东西都可以分享。

如果你还不太会 markdown 语法也没关系，可以参考 **HackMD 使用教学**，号称 10 分钟就可以上手。但笔者认为对非工程师的朋友还是有点不友善，推坑非工程师的朋友还是一直没成功 XD

> 延伸学习：[HackMD 使用教学（中文）](https://hackmd.io/c/tutorials-tw/%2Fs%2Fquick-start-tw)

另外 HackMD 也有投影片模式（side mode）喔，只是要先算好内容的多少，才不会被截断的问题。分享时真的很方便，也推荐试试看。

CodePen 的话，就真的比较工程师一点了。要先具备 HTML、CSS、JavaScript 的基础，才能比较懂在做什么。如果读书会的内容不需要这些的话，也不一定要用这个工具，可以用其他平台。

CodePen 界面看起来像这样：

![CodePen interface](https://i.imgur.com/T0viLyL.png)

CodePen 使用起来像这样：

![CodePen usage](https://i.imgur.com/D7lmpRR.png)

简单说分为 3 个部分：HTML、CSS、JavaScript。右边可以即时显示出当前的樣子，有什么新的想法也可以试试看、玩玩看，当作一个 PlayGround 的概念，也可以分享给别人。

这个共笔读书会的建制就差不多到这边。之后就是最难的一部分：「持续下去」。

在整个 JavaScript 30 中学习到的东西很多、很全面。虽然有些东西真的没有这么常用到，但是绝对可以打开你的眼界，甚至会让你说：「竟然还有这种东西！」而且都是原生的，看完不禁让我怀疑：「我真的会 JavaScript 吗？」

在 JavaScript 30 中一些有趣的东西：

- `console.log`、`console.error`、`console.count` 等等。
- canvas 绘图
- array 的各种练习
- base64 像素的操作
- 其他有趣的小特效

最后的简单成果（感谢参与的同学）：[JS30 我要成为 JavaScript 大师](https://hackmd.io/@benben6515/javascript-30)

## 总结

这一篇又是稍微没什么技术内容的一篇（汗），但是一定有一些人不了解这些工具。可能刚好就有人很有想法，但是没有工具、不知道如何开始——那么这一篇文章就是为你所写的。

其实这整个 ErrorBaker 部落格也是一个共笔部落格。所以你想要的话，也可以一起发起一个共笔部落格。或者如果你也觉得共笔读书会不错的话，也可以发起共笔读书会。那么现在就开始规划你的共笔吧！

最后希望大家可以一同进步、一同成长。感谢您的阅读。

### Ref

- [JavaScript 30](https://javascript30.com/)
- [HackMD](https://hackmd.io/)
- [CodePen](https://codepen.io/)
- [为工程师文件而生的协作平台：HackMD 开发故事 | Medium](https://medium.com/starrocket/hackmd-product-story-1e332f83d343)
- [JS30 我要成为 JavaScript 大师 | 笔者 HackMD 范例](https://hackmd.io/@benben6515/javascript-30)

> 免责声明

以上均为笔者自身经验，难免掺杂主观意见，仅供读者参考，也欢迎分享经验交流。
如果有错误的地方还请大佬们指正，笔者会立刻修改。再次感谢大家！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作采用 [创用 CC 姓名标示 4.0 国际授权条款](https://creativecommons.org/licenses/by/4.0/) 授权。您可以在 [benben.me](https://benben.me) 找到我。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
