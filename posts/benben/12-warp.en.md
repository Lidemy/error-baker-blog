---
title: Warp | Your 21st Century AI Terminal
date: 2023-05-31
tags: [warp, terminal, ai]
author: benben
layout: layouts/post.njk
image: https://hackmd.io/_uploads/HJsA77LE3.gif
lang: en
sourceLang: zh-TW
translationKey: benben/12-warp
permalink: /en/posts/benben/12-warp/
draft: true
sourceHash: dc6efe8097e148c5a389f5c80b1e859ba58b04ec0ae64cac12d66141d22cf35a
---

<!-- summary -->
<!-- In this day and age, are you still using a traditional terminal and setting up all kinds of configs? -->
<!-- summary -->

**！This post introduces a handy dev tool — Warp, an AI terminal. Hope it helps everyone code lightning fast** :D

## Foreword

<center>
  <img src="https://hackmd.io/_uploads/HJsA77LE3.gif" alt="warp-demo" class="post-image-width" />
</center>

> Warp demo by myself

Before reading, it's best to know what a `terminal` is. Warp currently only has a Mac version, so please take note. Whether you're a pro, an amateur, or mid-career-change, you can read on. Or, here's a simple self-classification I made:

1. level 1: `ls`
2. level 2: `ls -al`
3. level 3: `ls -altr`

A little quiz — without Googling, do you know what each of the commands above does and what its parameters mean? Which level are you at? If you picked one, congrats — you should find this post easy to follow.

Do you also have **AI anxiety** and **tool anxiety**? In this era where everything has to be AI and tools keep rolling out, the one thing we don't lack is "AI tools." Quite a few are just hopping on the bandwagon. When they first come out they're novel, but as an engineer, after a while you can tell what they're built on — they just slap an LLM (Large Language Model) on the back. The hottest ones include ChapGPT-3/4, BERT, XLNet, and so on.

Given that, is the `Warp` terminal really just a terminal with an AI wrapper? Let's keep reading ~

Obviously not! Otherwise I wouldn't be writing this post, right? Let's start with a simple comparison table:

| Feature                | Warp            | Window Terminal | iTerm2       |
| ---------------------- | --------------- | --------------- | ------------ |
| Personalization        | ⭐️⭐️⭐️             | ⭐⭐              | ⭐            |
| Easy copy input/output | ⭐⭐⭐             | ⭐               | ⭐            |
| Auto Completion        | Out of the box  | Install + setup | Install + setup |
| Shortcut cheat sheet   | Built-in (cmd + /) | Find elsewhere | Find elsewhere |
| Tabs, split panes      | O               | O               | O            |
| AI                     | O               | X               | X            |
| Mouse usable           | O               | X               | X            |
| cmd + a/z/x/c/v usable | O               | X               | X            |

In this post I'll introduce Warp and share some thoughts. The rough outline:

- [Foreword](#foreword)
- [Intro & Installation](#intro--installation)
- [Personalization](#personalization)
- [Usage & AI](#usage--ai)
- [My Take](#my-take)
- [Ref](#ref)

## Intro & Installation

Their official site already explains things pretty well (if your English is OK, you can just read it directly). The docs are clear. When I started using it (around 2023/02), there wasn't a Live Demo video yet (that came around 2023/04), so I could only read the docs and play around to explore. Later I realized it had been out for a while — launched around 2021 (per their official YouTube channel), and only recently got hot. It's also stylishly written in `Rust`. I discovered it by chance from another Tech YouTuber's intro.

<center>

[![Warp official demo](https://img.youtube.com/vi/XWQY8LgkiXM/0.jpg)](https://www.youtube.com/watch?v=XWQY8LgkiXM)

</center>

> Further reading: [Warp](https://warp.dev)

But **currently only Mac platform** is available for download. Readers on `Window`, `Linux`, etc. will have to wait a bit longer.

One disclaimer, though: this isn't a sponsored post (Warp, if you see this, maybe consider it, hey!). Warp does have a small referral program — refer 10 people and they'll send you a T-shirt (way easier to get than the LeetCode shirt). Whether wearing it makes you too Nerd to get a girlfriend — I can't really say (sweat). If after reading you're interested, you can use my referral link.

<center>
  <img src="https://hackmd.io/_uploads/r1Atcp24n.png" alt="warp-referral" class="post-image-width" />
</center>

> Referral link: <https://app.warp.dev/referral/VLL959> (please-do please-do thank-you thank-you 🥹)

For personal use there's no cost, so you don't need to worry about entering a credit card. It just asks you to register an account and you can start using it.

Benefits for me:

1. Teaching and learning go together; sharing new knowledge
2. Diving deeper into Warp's features

Benefits for you:

1. A cool terminal — coworkers will sneak peeks at your work (might not be a good thing), making you a topic of conversation
2. AI boosts your efficiency — for Git, Vim commands, etc.

Before this, I'd already recommended it to friends without knowing about the referral program (boohoo). Later I figured since I'm going to recommend it anyway, I might as well write a proper post, so next time a friend is interested I can just send them the article instead of doing a live demo again (Don't repeat yourself principle).

Honestly, with or without the referral program, I'd share good tools anyway. Whether readers install it is a personal choice, and how they install it is beyond my control. It's a "Buddhist-style recommendation."

To install, just click `Download Now` on the official site and install normally. Once installed and registered, you'll see the screen like my cover image (some settings/themes may differ).

## Personalization

- Appearance

It has several built-in themes, **and if you don't like any, you can design your own** with full official tutorials — total freedom. Of course you can also set fonts and sizes. Notably, you can directly set **transparency and Blur effects**. I fiddled with this for a long time on Windows (the native ugly black-and-white window), and only later switched to [`Window Terminal`](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701) to get built-in settings.

<center>
  <img src="https://hackmd.io/_uploads/H1JZmAn43.png" alt="warp-setting" class="post-image-width" />
</center>

> Warp settings page

For theme configuration, I think the official ones are all pretty good (compared to other built-in themes, they really are decent). Just pick one that looks good to you. The default font is nice too (the default is Hack). We haven't even gotten to features yet — this is just appearance — but already Warp has won my heart XD.

- Configuration

Warp touts **Zero Configuration** — out of the box, no extra setup, no extra packages to install, and no more constantly backing up your `.zshrc`, `.bashrc`.

Let's try some commonly-used features:

**Auto path completion**: at the root `/`, type `cd` + press `Tab` to show the current folders; use up/down to switch; press `Enter` to auto-complete.

<center>
<img src="https://hackmd.io/_uploads/BkqDHA2N3.png" alt="warp-setting" class="post-image-width" />
</center>

> Out of the box | Auto path completion

**Git commands**: type `git log` + press `Tab` to show available commands; use up/down to switch; press `Enter` to auto-complete.

<center>
  <img src="https://hackmd.io/_uploads/BkKMUA24h.png" alt="warp-setting" class="post-image-width" />
</center>

> Out of the box | Auto Git command completion

Of course there are many more powerful features; I won't demo them all. See [what commands Warp supports](https://docs.warp.dev/features/completions).

## Usage & AI

- Use it like a regular Terminal

Of course you can use it like a regular terminal. Type normal Linux commands, like the `ls` from the start, and they all work. If you don't need the cool features, you can just use it as a regular terminal — though at that point you might not need Warp (lol).

- Tabs

I've long thought tabs are super handy. I'm not sure if older terminals didn't have them or if I just didn't know how to use them. Anyway, in the past, to multi-open a terminal you'd open another app instance, and if you opened many (one for docker, one for frontend, one for backend, one for everyday use), you'd constantly be hunting around. At that point, an integrated terminal would be ideal.

There was one I found back then — yep, `Window Terminal`. It also pitched itself as being able to integrate multiple terminals. If you're a Windows user, you can still consider trying it. I know the traditional cmd window and PowerShell have all sorts of issues that may leave a bad first impression, but Warp doesn't support Windows yet either, so give `Window Terminal` a try first. I'd actually recommended it at an internal study group before.

Tabs in Warp are simple and intuitive. Operations:

1. Press `cmd + t` to open a new tab.
2. Press `cmd + shirt + [` to switch left.
3. Press `cmd + shirt + ]` to switch right.
4. Press `cmd + w` to close the current tab.

It's basically the same as using VS Code — if you're familiar, no special memorization needed.

- Split panes

`Split panes` here is completely different from `tabs` above — I confused them a lot when I started. It's also a `Window Terminal` feature, but Warp has built-in shortcuts that make it easy, and you can also set your own shortcuts. The defaults are pretty memorable too.

Split pane operations in Warp:

1. Press `cmd + d` to open a horizontal split.
2. Press `cmd + shift + d` to open a vertical split.
3. Press `cmd + option + arrow keys` to quickly switch between splits in Warp.

- AI features

In this era, it seems everything has to have some AI — but that's par for the course now. Warp of course has built-in AI you can use.

Just prefix your input with `#` to enter search mode, then type what you want to look up — and you can easily use AI to search for commands. For example:

<center>
  <img src="https://hackmd.io/_uploads/HJsA77LE3.gif" alt="warp-demo" class="post-image-width" />
</center>

> In the image above, I searched for how to remove a file from Git (How to remove file from git).

Less-used commands are really easy to forget. Sometimes for these little things you have to dig through a git cheat sheet buried in your bookmarks or scroll through Stack Overflow, which feels like a waste of time. That's where Warp comes in handy. Readers can get a taste of Warp's power.

For more complex scenarios, you can try the more advanced search.

Click the **lightning icon** in the top-right of Warp to bring up the advanced AI search panel, or press the shortcut `ctrl` + `shift` + `space` (that's the default). It may be overridden by other apps — be aware — and you can change the shortcut in settings.

That lets you input more prompts for AI to search. But this search has a usage limit — **100 times a day** — and resets the next day. Makes sense, given that even Chat-GPT charges for Chat-GPT 4.

Make good use of the advanced search. And if you run out of uses, don't worry — the regular search using `#` above **has no usage limit** — use it with peace of mind!

## My Take

Though I'm pitching it, I genuinely really like Warp. Besides all the personalization configs, lots of handy built-in features, and AI assistance — it's a great tool to recommend. Warp is free for personal use, but currently (2023/05) only on Mac OS. Other platforms should come in the future; interested readers will have to wait a bit longer.

Also, personally I think Warp's official Developer Advocate (not sure how to translate — developer advocate?) Jess is amazing: great speaker, sometimes funny, totally overturning my impression of this kind of tech teaching. I learned a lot from her. To learn more about Warp, I recommend watching Warp's official demos.

If after reading my intro you're interested, you can register with [my referral link](https://app.warp.dev/referral/VLL959) 🥹.

Here's a quick cheat sheet of common Warp usage for readers:

- No fiddly config files — out of the box
- Tabs:
  - New `cmd + t`
  - Close `cmd + w`
  - Switch left `cmd + shift + [`
  - Switch right `cmd + shift + ]`
- Split panes:
  - New vertical pane `cmd + d`
  - New horizontal pane `cmd + shift + d`
  - Close `exit`
  - Switch `cmd + option + arrow keys`
- AI:
  - Regular search: type `#` + the command you want to look up
  - Full search: `ctrl` + `shift` + `space`

With just the commands above, you can already cut down a lot of mouse time. Add `Raycast` and `Vim`, and you basically don't need a mouse at all (huh?) — come join the keyboard maniacs!

That's about it. See you next time ~

Happy Coding ~

## Ref

- [Warp](https://warp.dev)
- [Warp official demo](https://www.youtube.com/watch?v=XWQY8LgkiXM)
- [Warp 支援的指令](https://docs.warp.dev/features/completions)
- [Window Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701)
- [筆者的推薦連結 🥹](https://app.warp.dev/referral/VLL959)

> Disclaimer

The above is all based on my own experience, so some subjective opinions are inevitable. It's offered for your reference, and I welcome you to share your own experiences and discuss.
If you spot any errors, please point them out — I'll fix them right away. Thanks again, everyone!

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
