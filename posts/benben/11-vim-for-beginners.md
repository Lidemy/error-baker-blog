---
title: Vim for beginners
date: 2023-05-07
tags: [vim]
author: benben
layout: layouts/post.njk
image: https://hackmd.io/_uploads/BkbJbumEh.gif
---

<!-- summary -->
<!-- Some people don't want to learn vim. Some people want to learn vim, but ... -->
<!-- summary -->

**！ This article is about Vim for beginners. If you're a Pro with vim already, you are good to go now** :)

<img src="https://hackmd.io/_uploads/BkbJbumEh.gif" alt="vim-demo" width="360" />

> Vim demo by myself

You can see the screen magically moving and my mouse don't move any millimeter. That's Vim's power.

## 0 Preface

Hi, nice to see you guys again!.

This time I want talk about **Vim**. I will simply introduce Vim for sure, but it not include boring Vim history.

If you use Vim like Pro, you don't need mouse any more.

You might wonder is that true? I would say it make sense.

Let's dive in!

## 1 Sprit

First thing first. What is Vim? Vim is editor, no doubt. But it no just a editor, it almost in **everywhere** actually. As a developer you likely use "Git" to control source code or some remote machine which editor is Vim by default.

Most people don't aware of Vim's power that is a little pity. That is same as me before, so don't worry about it. I was first aware of Vim's power is in some Tech Youtube. At first time I saw it, I was stung by Vim's power.

Also Vim's sprit in a lot of tools, plugins. For example, I use Vim plugin in VScode to write this article right now. I use Vim's chrome plugin(Vimium) to browser web as well. Vim is everywhere.

## 2 keys to escape from Vim

If you just know how to escape from Vim, it's just `:q` then `Enter`. You are good to go now. This commend `:q` is most famous about Vim. There are a lot of memes about this tow keys.

Additionally, if you want to quit with save, you can input `:qw` then `Enter`. Alternately, you can input `:x` then `Enter`, or just press `ZZ` for quit, `ZQ` fro save and quit. Cool, now you can use these methods as you want. Vim is very fun, is it?

The minimum knowledge about Vim are:

1. How to input text
2. How to save text

In fact, these two key points are fist things of **any editor**. Let us recall how we get start to edit text file. I supposed most of us probably use build-in text editor to edit `.txt` file at first time.

- How to input text in a build-in editor?

> It be like just input any texts you want.

- How to save text in a build-in editor?

> just use `Ctrl/Cmd + S` then close `X` button with you mouse, no big deal.

There you are, the same two key points! But in Vim, it is just a little different. Believe or not, Vim provides **rich and fun** feature than a regular build-in editor.

## 3 modes of Vim

1. normal mode
2. input mode
3. select mode

I suggest beginners just know about **normal mode** and **input mode** at first and it's enough.

When we first into Vim world, it always be at **normal mode** by default (if you don't set your `.vimrc` file or stuff). In this mode, we can NOT input text **except** we push some specific keys. This is very important, you should known. In the past, I learned about this from the Internet as well. But I just learn: "You can not type anything" (which means you might push some specific keys intentionally). So I just randomly pushed my keyboard. You guess what? Yeah, I changed some of my configure file which I worked on.

Personally, I prefer regard normal mode as "navigate mode", because you can look around in the file or document with some specific keys. Meanwhile, these are some keys can switch to other mode with different features as well.

> Fun fact, there is also "easy mode" in Vim. Open a file with commend like this `vim -y file.md`, then you will open a file with easy mode which like Nano editor. That means if you just want to use simple editor like Nano editor, you don't even install Nano! Just use Vim easy mode. I don't encourage use this mode, because it can not show Vim's power.

## 4 direction

There are four direction in Vim world:

1. h (**←**)
2. j (**↓**)
3. k (**↑**)
4. l (**→**)

Yes, that are a little weird! I known! But if you look at your keyboard, you will find that three of these keys just under you right figures one by one. It's no coincident and it makes more sense with reducing large chance of using mouse.

Instead of using traditional direction 4 arrow keys, Vim using **h, j, k and l**. In this way, you can keep your figures in the central above the keyboard. You might wonder is it a big deal? Yes, I had this though before. But now, I will say **Yes, it is important** and I use 60% keyboard as well. Those do make me more focus on my working.

There more efficient way to navigate in Vim, such as `H`, `L`, `M`, `ctrl + d`, `ctrl + r`. But if you no familiar with h, j, k, l, **focus on these 4 keys is good enough and they can do every navigation** you want in Vim. This is true, but the difference is how long the time taken.

## 5 ways to input

There are five ways to input:

1. a、A
2. i、I
3. o、O
4. c、C
5. r、R

But those five keys' uppercase and lowercase are a little different. That means there are 10+ ways to input text in Vim.

That may be a little overwhelming, I known. Again, just know `i` is enough. You might think why so many way to input text. Taking `i`, `a` for example, they are very similar, but one is **insert(i)** at the blank spot and the other is **append(a)** at the blank spot

Actually, I bet you may remember `i` and `a` to input some text in Vim. Not really? Repeat after me: `i, insert`, `a, append`. The truth is don't memorize these commends, but say it out.

## Recap

For some readers already familiar about Vim, this article may be very easy. But Vim is easy like 1, 2, 3, 4 and 5. Not at all, I just kidding.

Vim is hard to learn. But once you learned it and mastered it, Vim will become your the best investment in your skill which not only in coding but also in document editing (literally any document).

- First, learn the minium knowledge of Vim.

They are `h`, `j`, `k`, `l`, `i`, `:q!`, `:wq` and just believe they're enough to do everything in Vim.

- Second, learn Vim key by key.

When you familiar the minium knowledge, you can move on next key and check their function key by key. Recommend you pick up `w`, `e`, `b`, `zz`, `ctrl + d`, `ctrl + u`, `%`.

- Third, don't try to memorize any hotkey.

Instead of memorize them, you should use them as much as you can until one day you don't need to check the document of Vim or google it. It like you are learning your first the hotkeys `ctrl + c` and `ctrl + v`, but there are much more hotkeys(they are cool and magical) in the world of Vim. And these skills will grow with you. I really love the feeling it like you are playing RPG game which you started from not really good(maybe suck) weapon. But in the end, it became a legendary weapon and it matching their master.

## Bonus: Vim tutor just in your hand

So you are excited and want to learn more about Vim.

But when you saw the cheat sheet of Vim like this:

<img src="https://helloacm.com/wp-content/uploads/2015/09/vi-vim-cheat-sheet.jpg" alt="vim-cheat-sheet" width="480" />

> [Vim cheat sheet](https://helloacm.com/vi-vim-cheat-sheet-jpg/)

And you decide to quit. Cool, you want to quit? and what key you need to key in?

Yeah, it is `:q!`. You known it.

But wait, if I told you there a **free Vim tutor** for you, will you consider stick for a while?

Let's meet him.

If you use OS based on Linux (you can use `Git bash terminal` which is cross platform).

Open your terminal and input `vimtutor` then `Enter`. You will see him show up in your terminal.

How to close vim tutor? you asked. But you known it.

> `:q`

In case you don't like him, there are some useful links:

- [VIM Adventures](https://vim-adventures.com/)
- [Interactive Vim tutorial](https://www.openvim.com/)
- [vimcolorschemes](https://vimcolorschemes.com/) (Vim is old school? Check out how many fashion themes Vim has)

That's pretty much. Ciao ~

## Ref

- [vim official](https://www.vim.org/)
- [Vim cheat sheet](https://helloacm.com/vi-vim-cheat-sheet-jpg/)
- [VIM Adventures](https://vim-adventures.com/)
- [Interactive Vim tutorial](https://www.openvim.com/)
- [vimcolorschemes](https://vimcolorschemes.com/)

> Disclaimer

The above content based on author's own experience and it is inevitable that there are some subjective opinions. This is for readers' reference and sharing experiences to me is also welcome.
If there are any mistakes, please correct me. I will modify it immediately, thank you again!

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
