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

**！ This is an article about Vim for beginners. If you're a Pro with vim already, you are good to go now** :)

<center>
<img src="https://hackmd.io/_uploads/BkbJbumEh.gif" alt="vim-demo" width="360" />
</center>

> Vim demo by myself

You can see the screen magically moving and my mouse don't move any millimeter. That's Vim's power.

## 0 Preface

Hi, nice to see you guys again!

This time, I want to talk about **Vim**. I will introduce Vim, but it does not include boring Vim history.

You don't need a mouse if you use Vim like Pro.

You might wonder if that is true. I would say it makes sense.

Let's dive in!

## 1 Sprit

First thing first, what is Vim? Vim is an editor, no doubt. But it is not just an editor; it is **almost everywhere**. As a developer, you likely use "Git" to control source code or some remote machine whose editor is Vim by default.

Most people aren't aware of Vim's power; that is a pity. That is the same as me before, so don't worry about it. I was first aware of Vim's influence in some Tech YouTube. The first time I saw it, I was stung by Vim's power.

Also, Vim's spirit is in a lot of tools and plugins. For example, I wrote this article using the Vim plugin in VScode. I also use Vim's Chrome plugin(Vimium) to browse the web. Vim is everywhere.

## 2 keys to escape from Vim

If you know how to escape from Vim, it's just `:q` and then `Enter`. You are good to go now. This command `:q` is most famous in Vim. There are a lot of memes about these two keys.

Additionally, if you want to quit with save, you can input `:qw` and then `Enter.` Alternately, you can input `:x` then `Enter` or press `ZZ` for quit, `ZQ` for save, and quit. Cool, now you can use these methods as you want. Vim is very fun.

The minimum knowledge of Vim are:

1. How to input text
2. How to save text

These two key points are the first things of **any editor**. Let us recall how we got started to edit text files. I suppose most of us probably use the built-in text editor to edit `.txt` file for the first time.

- How to input text in a built-in editor?

> It is like just inputting any text you want.

- How to save text in a built-in editor?

> Use `Ctrl/Cmd + S`, then close `X` button with your mouse—no big deal.

There you are, the same two key points! But in Vim, it is just a little different. Believe it or not, Vim provides **richer and more fun** features than a regular built-in editor.

## 3 Modes of Vim

1. Normal mode
2. Input mode
3. Select mode

I suggest beginners know about **normal mode** and **input mode** at first, and it's enough.

When we first enter Vim world, it is always at **normal mode** by default (if you don't set your `.vimrc` file or stuff). In this mode, we can NOT input text **except** we push some specific keys. It is essential, you should know. In the past, I learned about this from the Internet as well. But I realized: "You can not type anything, " meaning you might push some specific keys intentionally. So, I just randomly pushed my keyboard. You guess what? Yeah, I changed some of my configured files, which I worked on.

I prefer to regard normal mode as "navigate mode" because you can look around in the file or document with some specific keys. Meanwhile, some keys can switch to other modes with different features as well.

> Fun fact: There is also an "easy mode" in Vim. Open a file with a command like this: `vim -y file.md`, then you will open a file with easy mode, which is like Nano editor. That means if you want to use a simple editor like Nano editor, you don't even install Nano! Just use Vim easy mode. I don't encourage using this mode because it can not show Vim's power.

## 4 direction

There are four directions in Vim world:

1. h (**←**)
2. j (**↓**)
3. k (**↑**)
4. l (**→**)

Yes, that is a little weird! I known! But if you look at your keyboard, you will find these four keys just under your right figure one by one. It's no coincidence, and reducing the chance of using a mouse makes more sense.

Instead of using traditional direction four arrow keys, Vim uses **h, j, k, and l**. In this way, you can keep your figures in the center above the keyboard. You might wonder if it is a big deal. Yes, I had this thought before. But now, I will say **Yes, it is important** and I use 60% keyboard as well. Those do make me more focused on my work.

They're more efficient ways to navigate in Vim, such as `H`, `L`, `M`, `ctrl + d`, and `ctrl + r`. But if you are not familiar with h, j, k, l, **focus on these four keys is good enough, and they can do every navigation** you want in Vim. This is true, but the difference is how long the time taken.

## 5 ways to input

There are five ways to input:

1. a、A
2. i、I
3. o、O
4. c、C
5. r、R

But those five keys' uppercase and lowercase are a little different. That means there are 10+ ways to input text in Vim.

That may be a little overwhelming, I know. Again, just know `i` is enough. You might think, why so many ways to input text? Taking `i`, and `a` for example, they are very similar, but one is **insert(i)** at the blank spot, and the other is **append(a)** at the blank spot.

Actually, I bet you may remember `i` and `a` to input some text in Vim. Not really? Repeat after me: `i, insert`, `a, append`. The truth is don't memorize these commands, but say it out.

## Recap

For some readers already familiar with Vim, this article may be very easy. But Vim is easy, like 1, 2, 3, 4 and 5. Not at all; I'm just kidding.

Vim is hard to learn. But once you learn it and master it, Vim will become your best investment in your skill, which not only in coding but also in document editing (literally any document).

- First, learn the minimum knowledge of Vim.

They are `h`, `j`, `k`, `l`, `i`, `:q!`, `:wq`, and just believe they're enough to do everything in Vim.

- Second, learn Vim key by key.

When you are familiar with the minimum knowledge, you can move on to the following key and check their function key by key. Recommend you pick up `w`, `e`, `b`, `zz`, `ctrl + d`, `ctrl + u`, `%`.

- Third, don't try to memorize any hotkey.

Instead of memorizing them, you should use them as much as you can until one day you don't need to check the document of Vim or Google it. It is like you are learning your first hotkeys, `ctrl + c` and `ctrl + v`, but there are much more hotkeys(they are cool and magical) in the world of Vim. And these skills will grow with you. I really love the feeling it is like you are playing an RPG game in which you started with a not-really good(maybe suck) weapon. But in the end, it became a legendary weapon, and it matched their master.

## Bonus: Vim tutor just in your hand

So you are excited and want to learn more about Vim.

But when you saw the cheat sheet of Vim like this:

<center>
<img src="https://helloacm.com/wp-content/uploads/2015/09/vi-vim-cheat-sheet.jpg" alt="vim-cheat-sheet" width="480" />
</center>

> [Vim cheat sheet](https://helloacm.com/vi-vim-cheat-sheet-jpg/)

And you decide to quit. Cool, you want to quit? And what key you need to key in?

Yeah, it is `:q!`. You know it.

But wait, if I told you there is a **free Vim tutor** for you, would you consider sticking for a while?

Let's meet him.

If you use OS based on Linux (you can use `Git bash terminal`, which is cross-platform).

Open your terminal and input `vimtutor` then `Enter`. You will see him show up in your terminal.

How to close Vim Tutor? You asked. But you know it already.

> `:q`

In case you don't like him, there are some useful links:

- [VIM Adventures](https://vim-adventures.com/)
- [Interactive Vim tutorial](https://www.openvim.com/)
- [vimcolorschemes](https://vimcolorschemes.com/) (Vim is old school? Check out how many fashion themes Vim has)

That's pretty much it. Ciao ~

## Ref

- [vim official](https://www.vim.org/)
- [Vim cheat sheet](https://helloacm.com/vi-vim-cheat-sheet-jpg/)
- [VIM Adventures](https://vim-adventures.com/)
- [Interactive Vim tutorial](https://www.openvim.com/)
- [vimcolorschemes](https://vimcolorschemes.com/)

> Disclaimer

The above content is based on author's own experience, and it is inevitable that there are some subjective opinions. This is for readers' reference, and sharing experiences with me is also welcome.
If there are any mistakes, please correct me. I will modify it immediately; thank you again!

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
