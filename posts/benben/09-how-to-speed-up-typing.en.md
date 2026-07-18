---
title: How to Improve Your Typing Speed — From Beginner to Super Beginner
date: 2022-10-16
tags: [typing, vs-code-plugin]
author: benben
layout: layouts/post.njk
image: https://hackmd.io/_uploads/rJWJgRQ1i.gif
lang: en
sourceLang: zh-TW
translationKey: benben/09-how-to-speed-up-typing
permalink: /en/posts/benben/09-how-to-speed-up-typing/
reviewedBy: benben
reviewedAt: 2026-07-18
publishedAt: 2026-07-18
sourceHash: 93bf6bc560a8c69282c6039d9f736fb18bbee52e136e4678657638a20bf88a81
---

<!-- summary -->
<!-- How to boost typing efficiency, from the perspectives of warrior, mage, and thief ... -->
<!-- summary -->

**! This post is mainly about speeding up your code typing, from various angles — physical, psychological, visual. Hope it helps!**

<center>

![typing](https://hackmd.io/_uploads/rJWJgRQ1i.gif)

</center>

## Foreword

Hey everyone, I'm finally back! I was a bit busy lately. This time I want to share about "typing efficiency"!

"Fast typing" is absolutely a skill worth investing in — especially for people who type on a keyboard for long stretches, like developers, writers, and even **stenographers**. If your typing speed is really fast, don't be a ~~liver-busting~~ engineer — go be a stenographer (interested readers can go look up stenographer salaries)! During my learning journey I've watched a lot of online courses and livestreams, and I noticed that many top experts and masters type incredibly fast. As someone with short fingers, I envied them every time I saw it — if only my typing could be that fast! And then I'd start fantasizing about fast coding — 3000 words omitted ...

First, a clarification: I'm talking about **efficiency**, not just speed — and efficiency is a subjective feeling. So besides introducing some good typing-practice sites to boost speed, I'll also cover other ways to **amplify the _feeling_ of typing fast**. If you're interested, read on!

## Beginner Chapter

Some say the best IDE (Integrated Development Environment) is VS Code, some say Notepad++, some say VIM, some say Office Word. Let's hear why a former Facebook engineer says it's Office Word.

<center>

[![Best IDE](https://img.youtube.com/vi/X34ZmkeZDos/0.jpg)](https://www.youtube.com/watch?v=X34ZmkeZDos)

</center>

> Why Microsoft Word is the best IDE for programming | Joma Tech

Let's try the best IDE, Microsoft Word! Wait! I follow my VS Code habit and type `! + tab`, `.wrapper > .item * 3` (Emmet syntax) and immediately press `Tab` — how come nothing happens! It should have generated an HTML template right away. I can't write code anymore.

It's funny on the surface, but the more you think about it, the scarier it gets. Yep, we've all been spoiled by modern IDEs.

In my opinion, Word is huge — uh, no! Word is expensive. Buying a legit copy of Word isn't cheap. Looks like using the best IDE comes at a cost!

Or maybe ... let's try the plain white txt first!

I've genuinely done this. Every time after watching a master's tech talk, I'd fire up an empty Notepad, fall straight into the flow state, and hammer away at the keyboard. When I snapped back to reality, there was a string of `console.log('Hello World')`. Even I couldn't believe it.

Let's go back to the very starting point: open only Notepad and see if you can write something from scratch without Googling — like the simplest Counter, TodoList, and so on.

---

## Warrior Chapter

- Skill: **Two-handed keyboard proficiency**

The most basic way to improve typing speed — there's nothing to it but practice!

There are tons of typing-practice sites out there; I won't introduce them one by one. Here are some I think are good — some recommended by friends. Sharing them all openly, no holding back.

Recommended English typing sites:

- <https://www.ratatype.com/>
- <https://www.typing.com>
- <https://10fastfingers.com/typing-test/english>
- <https://qwerty.kaiyi.cool/>

My small tip is to practice along with learning proper finger positioning. In the short term your typing may actually slow down, but once you get used to it, you'll find you break through the bottleneck you hit with old fingerings much faster.

- Skill: **Auto spell defense**

Next is the auto-defense part. The faster you type, the more mistakes you make. At that point you can try the VS Code plugin: [Code Spell Check](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

This is also a much-discussed plugin, but it's genuinely useful — especially when you type fast. Sometimes you misspell a function name while writing it, and then the whole codebase inherits the wrong name. Fixing it later becomes a huge headache. For personal projects it's fine — you sabotage yourself, step on your own landmines, and eventually get used to it.

But for collaborative projects, it's no joke. For example: the dev schedule is tight, a typo slips in, then it keeps getting reused — environment variables reuse it, the backend reuses it, the database reuses it. Now it's not just a "fix it yourself" problem. So please, never typo, and don't typo your way into sabotaging others, OK? Just turn on the auto-defense!

- Skill: Don't **`Tab`-spam**

Next: **don't use `Tab` (auto complete)**, and don't keep pressing "up" in the Terminal just to find that one `npm run dev`. This is a landmine many new developers hit. Modern IDEs are powerful, so you can `Tab` your way to the end and be a `Tab` engineer. It's fast for development, sure — but what follows is: you can't actually type fast, and you can't even remember commonly-used APIs (like `document.getElementById('#app')`). Test yourself: can you finish without `Tab`? If you can, how many seconds did it take?

Some readers might think: is that really necessary? Isn't `Tab` great? I agreed at first too. But later, in one class, a classmate asked [Huli](https://blog.huli.tw/about/) how to type English as fast as the teacher. One of his suggestions was "don't use auto complete." From that moment on, I rarely used auto complete — and I found it really helpful. So I'm sharing this idea here too.

Let me be clear: I agree `Tab` has its benefits, and many senior developers `Tab` all the way too. But the premise is that these senior developers already have most APIs at their fingertips and type very fast — for them, `Tab` is purely a time-saver. From what I've seen, the way most new developers use `Tab` is different — sure, it saves time, but it also saves them the chance to think and the chance to practice typing.

> Use `Tab`, but only when you truly understand the meaning behind each `Tab`.

## Mage Chapter

- Skill: **Meteor**

After all that hard-core stuff, let's add some "magic." Try the VS Code plugin: [Power Mode](https://marketplace.visualstudio.com/items?itemName=hoovercj.vscode-power-mode)

After installing it, you immediately learn "Meteor." The visuals are stunning — you can check the demo on the official site; I won't repost it here.

Once you use it, your coding is 100 points — even meteors falling won't faze you! No ... boss, please stop dropping meteors, I'm about to break.

Using it for just a moment, you'll think Meteor is awesome — but can we turn off the earthquake effect (side effect?)?

Yes, you can. Just go to the settings:

VS Code Settings -> type "powermode" -> scroll down to find "Shake:Enabled" -> uncheck the box.

Done!

> Now it's meteor-spam time (not the development kind of meteors)! Typing feels like 500x, 1000x — pure satisfaction!

## Thief Chapter

- Skill: **Afterimage**

We've arrived at the Thief Chapter — time to slack off a bit and pick up the passive skill "Afterimage."

You don't need to install anything here, because this is a native VS Code "hidden setting." It's off by default, and it seems many people don't know about it. I also discovered it in some master's livestream. After sharing it with friends, every one of them raved about it.

So let me teach you how to learn "Afterimage":

- Use VS Code's `Cursor Smooth Create Animation` setting
  1. Open VS Code's settings panel (`cmd` + `,` / `ctrl` + `,`).
  2. Search: `smooth`.
  3. Find `Editor: Cursor Smooth Create Animation` and check the box.

![Cursor Smooth Create Animation](https://hackmd.io/_uploads/B1GLPaXJi.png)

> Before

![before](https://hackmd.io/_uploads/rJWJgRQ1i.gif)

> After

![after](https://hackmd.io/_uploads/SkDylRQJs.gif)

It seems the GIF screenshots have been compressed, so the afterimage effect isn't very obvious QQ

But if you look closely, after enabling it, the mouse cursor leaves an afterimage and becomes **smoother**.

> Now you can glide glide glide — typing code feels smooth as butter.

## Bonus: Merchant Chapter

- Skill: **Just buy it! When have I ever not bought!**

This is the equipment section. As an excellent engineer (?), you have to find a keyboard you like, pair it with your preferred switch type, your preferred feel — but this part is really subjective. Simply put: try lots of them, so you know which switches, materials, and feel you like. Another important factor is your needs — portability, RGB lighting, and so on.

Let me briefly share my own experience. Because I like keeping my hands on the keyboard to maintain efficiency, I considered 87% and 60% keyboards, since the numpad just takes up space when sitting there and you can save more room. As for switches, that's also very personal. I wasn't familiar with the differences between switches at first, so my first one was the all-purpose brown switch. It felt fine at first, but after a while I noticed my right pinky started to hurt a bit (if you use proper finger positioning to code, you'll find many keys are hit by the right pinky). I later switched to red switches — lighter and quieter.

The common switches on the market, in short:

- Force: red < brown < blue
- Volume: red < brown < blue

But it still varies by brand and product — a brief intro for readers who want to get into it (~~but if money isn't an issue, you could try HHKB~~). As for keycap material: I have sweaty/oily hands, so I'd suggest trying PBT or better materials. Lots of people have covered this — merchants, do your homework!

## Conclusion: Super Beginner Chapter

- Skill: **I want it all**

Skill points are limited, and the frontend sea is boundless. Turn back, beginners!

But I want it all! So the methods above can all be tried together, depending on your needs. Or you can do nothing and just buy a keyboard that makes you happy; you can also grind with the company's crappy keyboard. As long as you feel it improves your "typing efficiency," that's enough.

Because the typing-efficiency skill grows along with the user, the return on investment is very high! Don't underestimate this soft skill — some companies actually require a minimum typing speed from developers. In a sense, this skill also separates junior developers from mid-to-senior ones. It's well worth investing a little time in.

Also, the skills mentioned in this post seem to resemble the contents of a certain classic game — totally revealing my age (QQ). Readers, don't claim me, OK? Memories, sigh.

Finally, I hope everyone can get one step closer to the idealized hacker — but please be an ethical hacker!

Happy Typing, Happy Hacking!

## Ref

- [YouTube | VS Code tips — Enabling smoothly animated cursor movement](https://www.youtube.com/watch?v=FCUi_dRU0tY)
- <https://www.ratatype.com/>
- <https://www.typing.com>
- <https://10fastfingers.com/typing-test/english>
- <https://qwerty.kaiyi.cool/>
- [VScode Plugin | Code Spell Check](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
- [VScode Plugin | Power Mode](https://marketplace.visualstudio.com/items?itemName=hoovercj.vscode-power-mode)

> Disclaimer

The above is all based on my own experience, so some subjective opinions are inevitable. It's offered for your reference, and I welcome you to share your own experiences and discuss.
If you spot any errors, please point them out — I'll fix them right away. Thanks again, everyone!

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
