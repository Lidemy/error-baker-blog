---
title: Raycast | An Incomplete Handbook
date: 2025-07-31
tags: [Raycast, AI]
author: benben
layout: layouts/post.njk
image: https://img.youtube.com/vi/NuIpZoQwuVY/0.jpg
lang: en
sourceLang: zh-TW
translationKey: benben/15-raycast-101
permalink: /en/posts/benben/15-raycast-101/
reviewedBy: benben
reviewedAt: 2026-07-18
publishedAt: 2026-07-18
sourceHash: cfcaead7ff5ab31c75aaee34d0e0ad1596c54ea0bd4742d52c9c674aa5758feb
---

<!-- summary -->
<!-- A Raycast handbook written for friends! -->
<!-- summary -->

**！This post introduces Raycast. As always, just take whatever's helpful to you** :D

[![](https://img.youtube.com/vi/NuIpZoQwuVY/0.jpg)](https://www.youtube.com/watch?v=NuIpZoQwuVY)

> Raycast's official 101 demo

Hey everyone, 2025 is already more than half over — my goodness! It's been a year and a half since my last post 😱

This time I'm writing about Raycast! That also fills the hole I left in the previous post 🤣
Raycast is mainly for MacOS. The Window version is currently in Beta ~

> (Ps. I currently have 2 priority invite codes for Windows. Readers who need one can email me ~)

Most features can be used for "free" right now, so you can safely download it. Since I've subscribed to Pro, I'll also share some Pro features. When it first launched, the Pro features were pretty basic — like being able to customize colors. OMG! How could I not buy it? (<= a person who super loves customizing colors and themes). I subscribed to Pro fairly early.

## Installation

Originally, Raycast was a replacement for Mac's built-in "Spotlight." But as its ecosystem grew, it clearly far exceeded Spotlight. Besides the original Spotlight features, it has many more features, is highly customizable, and you can even develop your own extensions (using React).

First, install Raycast!

> You can install it with my referral link: [https://raycast.com/?via=benben](https://raycast.com/?via=benben)

Then **turn off the built-in Spotlight**, so Raycast won't clash with Spotlight — both use the `⌘` + `space` shortcut.

How to turn it off ~?

<center>
  <img src="/img/posts/benben/15-raycast-101/15-1.png" class="post-image-width" style="width: 480px" alt="Image 1" />
</center>

<center>
  <img src="/img/posts/benben/15-raycast-101/15-2.png" class="post-image-width" style="width: 480px" alt="Image 2" />
</center>

> Please refer to this step-by-step tutorial.

Of course, if you don't get used to Raycast, you can also follow the same steps to revert ~ Once you're at this step, you're done 🎊

You can start with "launching applications" — exploring the rest later is totally fine 👍

Whenever you have a chance, hit `⌘` + `space`, then search for the app you want to open!

<center>
  <img src="/img/posts/benben/15-raycast-101/15-3.png" class="post-image-width" style="width: 480px" alt="Image 3" />
</center>

## Basics

Next I'll share some simple, handy features ~

### 1. Emoji

Since I'm a heavy Emoji user, you can probably tell 😂

> Tips: Mac has a built-in shortcut to open the Emoji picker: `⌘` + `Ctrl` + `Space`.

But the built-in feature is very basic (come on, it's 2025 X).

<center>
  <img src="/img/posts/benben/15-raycast-101/15-4.png" class="post-image-width" style="width: 480px" alt="Image 4" />
</center>

> The built-in Emoji picker interface.

We can use Raycast's `Search Emoji & Symbol`. Usually the bottom-right of Raycast shows what "Actions" are available.

<center>
  <img src="/img/posts/benben/15-raycast-101/15-5.png" class="post-image-width" style="width: 480px" alt="Image 5" />
</center>

> Raycast Emoji picker interface.

For example: I can pin my favorite emojis.

> Pro Tips: Bind `⌘` + `Ctrl` + `Space` to Raycast's `Search Emoji & Symbol`.

### 2. Clipboard History

Sometimes at work you often need to Copy/Paste various things. Suddenly you need that copy you carefully wrote yesterday — it took you forever, but you can't remember which deep folder you saved it in. You wish you could look it up in "clipboard history."

That's where our good friend Raycast can help!

<center>
  <img src="/img/posts/benben/15-raycast-101/15-6.png" class="post-image-width" style="width: 480px" alt="Image 6" />
</center>

### 3. Change Case

Naming is hard. Especially in frontend/backend collaboration, the backend has different naming conventions because of different languages. Maybe you get backend docs with backend-style naming, and you want to convert one Case to another.

We can use Raycast's `Change Case`.

For example: select `UserMessageId`, then use the `Change Case` feature.

<center>
  <img src="/img/posts/benben/15-raycast-101/15-7.png" class="post-image-width" style="width: 480px" alt="Image 7" />
</center>

> Change Case feature

### 4. Snippet

This feature is common in coding. I'm not sure how to translate it to Chinese, so I'll keep calling it Snippet. Simply put, it's "a reusable snippet" — but not necessarily code, it can be any text.

For example, common company info.

```md
Error Baker 有限公司
地址：太陽系 地球星球
電話：666-666-666
網站：https://blog.errorbaker.tw/
```

- First copy the text you want to reuse
- `Create Snippet` to create a new Snippet
- Set a Keyword as the trigger

<center>
  <img src="/img/posts/benben/15-raycast-101/15-8.png" class="post-image-width" style="width: 480px" alt="Image 8" />
</center>

After setting it, next time you type "@error-baker;", it'll output the text above 🧙

> Pro Tips: Set the "opening" and "closing" of a Snippet to avoid triggering Snippets you don't want.

### 5. Kill Process

Raycast can also be used to close apps, including background ones. It's pretty handy for killing hung apps. Open Raycast's `Kill Process` feature to see current processes, sortable by "CPU" or "RAM" usage.

<center>
  <img src="/img/posts/benben/15-raycast-101/15-kill-process.png" class="post-image-width" style="width: 480px" alt="Image kill process" />
</center>

## Store

Although it's called the Store, all "Raycast extensions" are `free`. Some are made officially, others by other developers who shared them. I drop by now and then to see what popular extensions are worth trying.

For instance, I've installed:

- Third-party apps: Spotify, Arc, Brew
- Productivity tools: Timer, Color Picker, Year in Progress, Scan QRcode
- Dev-related: Lorem Ipsum, Test Internet Speed, TinyPNG

If nothing suits you, you can even build your own extension. Of course, if you write a great Raycast extension, you can also share it for other Raycast users to download!

> Further reading: [Raycast Store](https://www.raycast.com/store)

## Window Management

You can split the currently focused app to the left or right at 50%. This is a commonly-used scenario:

- Half coding, half preview
- Half online course, half notes
- … etc

We can open Raycast's `Left Half` and `Right Half` to trigger the feature.

You can also use shortcuts, like:

- Left `Ctrl` + `Opt` + `←`
- Right `Ctrl` + `Opt` + `←`
- > The above can be set to cycle: 1/2, 2/3, 1/3
- Center & enlarge `Ctrl` + `Opt` + `Enter`
- Make larger `Ctrl` + `Opt` + `+`
- Make smaller `Ctrl` + `Opt` + `-`

All the above are free features!

With Pro, you can apply more customized settings for which apps to open ~

For example, to do all the following at once:

- Set the left 50% to VS Code
- Set the right 50% to Arc and **open "localhost:3000"**

Then save this Layout. If you want, you can set it to open even more apps at once.

<center>
  <img src="/img/posts/benben/15-raycast-101/15-layout.png" class="post-image-width" style="width: 480px" alt="Image layout" />
</center>

Next time you can open it with "one command" — even faster into wage-drone mode. Isn't that great?

## AI Features

The free tier already gives you some AI credits to use — quite generous. Currently (as of 2025/07/25 when this is posted), it's **50** uses, and the following Raycast AI features are available!

### 1. Raycast AI (Pro subscription required)

This is like using ChatGPT inside Raycast. Although as a frontend engineer I'm almost always at my computer with the browser open, sometimes opening another tab and going to the ChatGPT URL still feels a bit slow. If you're just asking a simple question, you don't need to make a big production of it — that's where Raycast AI is pretty nice ~

Just open Raycast, type your question, hit `Tab`, and use it like ChatGPT ~

### 2. Translate (Pro subscription required)

Since my English isn't great, I often need translation — for docs, emails, communication with colleagues, etc. Of course Google Translate is convenient, but as with ChatGPT above, often you just want a quick translation without too much detail. And definitely! Without opening a dedicated browser tab (this matters).

Again, take a look at the handy Actions. I often use swap (`⌘` + `S`), switch language (`⌘` + `P`), etc.

<center>
  <img src="/img/posts/benben/15-raycast-101/15-translate.png" class="post-image-width" style="width: 480px" alt="Image layout" />
</center>

> Translate feature

### 3. Fix Spelling and Grammar (Pro subscription required)

Sometimes you need to write some English — emails, READMEs, communication with foreign colleagues, etc. If your grammar isn't quite right, causing misunderstandings, that's not good. Use the `Fix Spelling and Grammar` feature to:

- Fix spelling and grammar: `Fix Spelling and Grammar`
- Make text longer: `Make longer`
- Make text shorter: `Make shorter`

> Others can be found in the AI section of settings.

<center>
  <img src="/img/posts/benben/15-raycast-101/15-ai.png" class="post-image-width" style="width: 480px" alt="Image layout" />
</center>

## Conclusion

Yes — once we start replacing small features, anything you can do in one interface means you don't need to open another app or tab. For instance, the Color Picker feature works in Raycast, so I deleted the related app. Losing is also a kind of subtraction philosophy.

That's it for this incomplete handbook ~ Of course this is only a subset of features — the rest is for readers to discover! If you have cool uses to share, leave a comment below!

Thanks to everyone who read this far — give yourself a round of applause 👏🏼

> (Ps. I still have 2 Windows priority invite codes. Readers who need one can email me ~)

Oh! Raycast also has a Confetti feature 🎊

<center>
  <img src="/img/posts/benben/15-raycast-101/15-wrapped.gif" class="post-image-width" style="width: 720px" alt="Image 15-wrapped" />
</center>

> Confetti feature — requires downloading a Raycast extension first.

Alright ~ Busy day done, time to put the computer to Sleep (mystery voice: Mac users rarely shut down).

Smoothly open Raycast, type "Sleep", press `Enter`.

Another peaceful day passes — thanks to Raycast's hard work!

See you next time! 👋🏼

## Ref

- [Raycast](https://raycast.com/?via=benben)
- [Raycast Store](https://www.raycast.com/store)
- [Raycast 101 | Official YouTube](https://www.youtube.com/watch?v=NuIpZoQwuVY)

> Disclaimer

The above is all based on my own experience, so some subjective opinions are inevitable. It's offered for your reference, and I welcome you to share your own experiences and discuss.
If you spot any errors, please point them out — I'll fix them right away. Thanks again, everyone!

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
