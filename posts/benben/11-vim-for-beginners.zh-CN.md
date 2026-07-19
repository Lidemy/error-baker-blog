---
title: Vim for beginners
date: 2023-05-07
tags: [Vim]
author: benben
layout: layouts/post.njk
image: https://hackmd.io/_uploads/BkbJbumEh.gif
lang: zh-CN
sourceLang: zh-TW
translationKey: benben/11-vim-for-beginners
permalink: /zh-CN/posts/benben/11-vim-for-beginners/
reviewedBy: benben
reviewedAt: 2026-07-18
publishedAt: 2026-07-18
sourceHash: 04197b423d87d2255c648a23d309a76dc9153a2f53bdea02d2890309a92b432a
---

<!-- summary -->
<!-- 有些人不想学 Vim；有些人想学 Vim，但是 ... -->
<!-- summary -->

**！这是一篇写给初学者的 Vim 文章。如果你已经是 Vim Pro，那就可以跳过这篇了** :)

<center>
<img src="https://hackmd.io/_uploads/BkbJbumEh.gif" alt="vim-demo" class="post-image-width" />
</center>

> Vim demo by myself

你可以看到画面神奇地移动，而我的鼠标一毫米都没有动。这就是 Vim 的威力。

## 0 前言

嗨，很高兴再次见到大家！

这次我想聊聊 **Vim**。我会介绍 Vim，但不会讲那些无聊的 Vim 历史。

如果你像 Pro 一样使用 Vim，你不需要鼠标。

你可能会怀疑这是不是真的。我会说，这还算合理。

让我们开始吧！

## 1 精神

首先，Vim 是什么？Vim 是一个编辑器，这无庸置疑。但它不只是个编辑器——它 **几乎无所不在**。身为一个开发者，你可能会用 Git 来控制原始码，或是登录某台远端机器，而它的预设编辑器就是 Vim。

多数人没有意识到 Vim 的强大，这很可惜。这跟以前的我一样，所以不用担心。我最早是在某个科技 YouTube 频道上注意到 Vim 的影响力。第一次看到时，我就被 Vim 的威力所震撼。

此外，Vim 的精神也存在于许多工具和插件中。例如，我写这篇文章时用的是 VS Code 里的 Vim 插件。我也用 Vim 的 Chrome 插件（Vimium）来浏览网页。Vim 无所不在。

## 2 离开 Vim 的按键

如果你知道怎么离开 Vim，就是 `:q` 然后 `Enter`，这样就搞定了。这个 `:q` 指令在 Vim 里最有名了。这两个键有很多迷因。

另外，如果你想储存后离开，可以输入 `:qw` 然后 `Enter`。或者，你可以输入 `:x` 然后 `Enter`，或是按 `ZZ` 离开、`ZQ` 储存并离开。酷吧，现在你可以随心所欲地使用这些方法。Vim 非常有趣。

Vim 的最基本知识是：

1. 如何输入文字
2. 如何储存文字

这两个关键是 **任何编辑器** 的第一课。让我们回想一下当初是怎么开始编辑文字文件的。我猜我们大多数人第一次都是用内建的文字编辑器编辑 `.txt` 档。

- 内建编辑器怎么输入文字？

> 就是直接输入你想要的任何文字。

- 内建编辑器怎么储存文字？

> 用 `Ctrl/Cmd + S`，然后用鼠标点关闭 `X` 按钮，没什么大不了。

你看，就是同样的两个关键！只是在 Vim 里有一点点不一样。信不信由你，Vim 提供了比一般内建编辑器 **更丰富、更有趣** 的功能。

## 3 Vim 的模式

1. Normal mode（普通模式）
2. Input mode（输入模式）
3. Select mode（选取模式）

我建议初学者一开始先认识 **normal mode** 和 **input mode**，这样就够了。

我们第一次进入 Vim 世界时，预设都是在 **normal mode**（如果你没有设定 `.vimrc` 档之类的）。在这个模式下，我们 **无法** 输入文字，**除非** 按下某些特定按键。这点很重要，你应该要知道。过去我也是从网路上学到这点。但我意识到：「你什么都打不出来」的意思是，你可能是有意按下某些特定按键。于是我就乱按一通。你猜怎么著？嗯，我修改了一些我正在处理的设定档。

我比较倾向把 normal mode 当作「navigate mode（导览模式）」，因为你可以用一些特定按键在文件或文件中浏览。同时，也有些按键可以切换到其他具有不同功能的模式。

> 小知识：Vim 也有「easy mode（简易模式）」。用这样的指令开启文件：`vim -y file.md`，然后你就会以简易模式开启文件，类似 Nano 编辑器。也就是说，如果你想用像 Nano 一样简单的编辑器，根本不用安装 Nano！用 Vim 的简易模式就好。但我不鼓励使用这个模式，因为它无法展现 Vim 的威力。

## 4 方向

Vim 世界有四个方向：

1. h (**←**)
2. j (**↓**)
3. k (**↑**)
4. l (**→**)

对，这有点奇怪！我知道！但如果你看一下你的键盘，你会发现这四个键刚好在你右手手指下方一个接着一个。这不是巧合，而且减少使用鼠标的机会也更有道理。

不同于传统的方向四个方向键，Vim 使用 **h、j、k、l**。这样一来，你可以把手指保持在键盘中央上方。你可能会想这有什么大不了的。对，我以前也这样想过。但现在，我会说 **是的，这很重要**，而且我也用 60% 键盘。这些确实让我更专注于工作。

在 Vim 里还有更有效率的导览方式，例如 `H`、`L`、`M`、`ctrl + d`、`ctrl + r`。但如果你对 h、j、k、l 还不熟悉，**专注在这四个键就够好了，而且它们能做到 Vim 里所有你想要的导览**。这是真的，差别只在于花了多少时间。

## 5 输入方式

有五种输入方式：

1. a、A
2. i、I
3. o、O
4. c、C
5. r、R

但这五个键的大写和小写有点不一样。也就是说，Vim 里有 10+ 种输入文字的方式。

这可能有点 overwhelming，我知道。再一次，只要知道 `i` 就够了。你可能会想，为什么有这么多输入文字的方式？以 `i` 和 `a` 为例，它们非常相似，但一个是在空白处 **insert（i）**，另一个是在空白处 **append（a）**。

其实我敢打赌你可能会记得用 `i` 和 `a` 在 Vim 里输入文字。不会吗？跟着我念：`i, insert`、`a, append`。重点是不要死记这些指令，而是把它念出来。

## 回顾

对某些已经熟悉 Vim 的读者来说，这篇文章可能非常简单。但 Vim 就是简单，像 1、2、3、4、5 一样。才怪，我开玩笑的。

Vim 很难学。但一旦你学会并精通它，Vim 就会成为你技能中最好的投资，不只限于写程序，连文件编辑（真的是任何文件）都适用。

- 第一，学习 Vim 的最基本知识。

它们是 `h`、`j`、`k`、`l`、`i`、`:q!`、`:wq`，只要相信它们就足以在 Vim 里完成一切。

- 第二，逐键学习 Vim。

当你熟悉了最基本的知识，你就可以进到下一个键，一个一个键检查它们的功能。建议你接着学 `w`、`e`、`b`、`zz`、`ctrl + d`、`ctrl + u`、`%`。

- 第三，不要试图死记任何快捷键。

与其死记，你应该尽可能多地使用它们，直到有一天你不需要再查 Vim 的文件或 Google。这就像你在学你的第一组快捷键 `ctrl + c` 和 `ctrl + v` 一样，只是 Vim 的世界里有更多快捷键（它们很酷、很神奇）。而这些技能会跟你一起成长。我真的很喜欢这种感觉，就像你在玩一个 RPG 游戏，一开始拿著一把不怎么样（也许很烂）的武器。但最后，它变成了传奇武器，并找到了它的主人。

## 番外篇：你手边就有的 Vim tutor

所以你很兴奋，想多学一点 Vim。

但当你看到这样的 Vim cheat sheet：

<center>
<img src="https://helloacm.com/wp-content/uploads/2015/09/vi-vim-cheat-sheet.jpg" alt="vim-cheat-sheet" class="post-image-width" />
</center>

> [Vim cheat sheet](https://helloacm.com/vi-vim-cheat-sheet-jpg/)

于是你决定放弃。酷，你想放弃？那你要按下什么键？

对，就是 `:q!`。你知道的。

但等等，如果我告诉你有一个 **免费的 Vim tutor** 给你，你愿意再坚持一下吗？

让我们来见见他。

如果你用的是 Linux 作业系统（你可以用跨平台的 `Git bash terminal`）。

打开你的终端机，输入 `vimtutor` 然后 `Enter`。你就会看到他出现在你的终端机里。

怎么关掉 Vim Tutor？你问。但你已经知道了。

> `:q`

如果你不喜欢他，这里有些有用的连结：

- [VIM Adventures](https://vim-adventures.com/)
- [Interactive Vim tutorial](https://www.openvim.com/)
- [vimcolorschemes](https://vimcolorschemes.com/)（Vim 很老派？看看 Vim 有多少时尚主题）

差不多就是这样。Ciao ~

## Ref

- [vim official](https://www.vim.org/)
- [Vim cheat sheet](https://helloacm.com/vi-vim-cheat-sheet-jpg/)
- [VIM Adventures](https://vim-adventures.com/)
- [Interactive Vim tutorial](https://www.openvim.com/)
- [vimcolorschemes](https://vimcolorschemes.com/)

> 免责声明

以上均为笔者自身经验，难免掺杂主观意见，仅供读者参考，也欢迎分享经验交流。
如果有错误的地方还请大佬们指正，笔者会立刻修改。再次感谢大家！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作采用 [创用 CC 姓名标示 4.0 国际授权条款](https://creativecommons.org/licenses/by/4.0/) 授权。您可以在 [benben.me](https://benben.me) 找到我。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
