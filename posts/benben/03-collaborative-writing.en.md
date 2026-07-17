---
title: Collaborative Notes Within Collaborative Notes — JavaScript30 as an Example
date: 2021-10-26
tags: [JavaScript, collaborative]
author: benben
layout: layouts/post.njk
image: https://i.imgur.com/ZmEEvep.png
lang: en
sourceLang: zh-TW
translationKey: benben/03-collaborative-writing
permalink: /en/posts/benben/03-collaborative-writing/
draft: true
sourceHash: 20e73037b71eb4857b22ba258533ef1d6bff41df6908e23607d7a9a47016fc2f
---

<!-- summary -->
<!-- Ever done collaborative notes? If not, start your own! -->
<!-- summary -->

![imgur picture](https://i.imgur.com/ZmEEvep.png)

> Image source: imgur

## Foreword

Hey hey! My fifth cohort of the Lidemy mentorship program just wrapped up — how's everyone doing? The whole journey was a tale of blood, sweat, and tears ><. I hope you all graduated smoothly!

I thought things would get easier after graduation, but then comes the job-hunting boss fight. I was clearly being too optimistic — I figured I'd have more time to write articles afterwards XD

The six months of the program were neither particularly long nor short. Some people got a lot done during that time, explored different things, and I imagine everyone grew a fair bit! This article is a little retrospective on the "collaborative-notes study group" I started back when I was learning. I'd previously heard that some seniors' companies had study groups and thought that was pretty cool. I'm not sure whether your company has one — if it does, great; if not, start one yourself!

## How It Began

So how did this collaborative-notes study group come about? Here's the origin story. While I was studying at Lidemy, I'd always take notes — I assume you're all as diligent as I was. One day while chatting (on gather.town — think of it as a more freewheeling version of Google Meet, where you can freely wander into different spaces to chat or hold meetings), I recommended **JavaScript30** as a free learning resource. I'd actually only gone through about 5 of them myself, but I really felt this was a great resource, so on a whim I thought, "Maybe we should run a study group," with the topic being: JavaScript30. It also happens to be a beginner-friendly resource, perfect for beginners like us. I found a few people to take turns presenting, which doubled as practice for our explanation skills, and then we'd share it with others. The audience didn't have to be just our own crew — anyone else on gather.town could listen in too.

> Further learning: [JavaScript](https://javascript30.com/)

JavaScript30 has always been a free resource I think is great — you just need to register to view it. When I shared it with everyone, they all thought it was good too. Some had registered before but, like me, never actually watched it (lol). After all, it's free — and with anything free, you tend to think "Ah, I'll have plenty of time to look at it later" and then it just sits there. Yep, that was me. But it's different when you have to share it with others.

Because the motivation of having to share it with others forces you to actually go through it, understand it, or at least understand the part you'll be presenting. So the motivation is much stronger. Compared to "claim the free thing now and let it gather dust," this motivation is way more powerful — and you'll understand the material far more deeply than if you studied it alone. That's my takeaway from participating, but I think a lot of people feel the same way.

## Choose Your Tools: HackMD / CodePen

First, let me introduce the online note tool **HackMD**. Since we need collaborative notes, "online" is a must. You could of course also use something like Notion — the key is an online tool everyone can accept and is willing to use. HackMD is an online **markdown** editor. Markdown, in short, is the `.md` file used in GitHub's `README.md`. It lets you quickly write documents in a structured way — kind of like a simplified version of **HTML**, with simple, clear syntax (though customization is harder).

Next is the online IDE **CodePen**. Since we have a need to write code, and we need an environment where we can edit and run things in real time, a lightweight online platform is a tool I think is wonderful. Others like CodeSandbox might also work, but since JavaScript30 only uses vanilla HTML, CSS, and JavaScript, CodePen is clearly a better fit for our needs — so we picked it as our demo platform.

With those two core platforms, we're about ready to start collaborating. You can dash off a simple intro, like a `README.md` file, briefly describing how to start the study group, the schedule, and so on. Even simpler: spell out "who, what, when, where, why" so people don't show up clueless.

## Let's Collaborate

Now that we've got the tools, let's get to work. Of course, you can pick whatever tools you like — just remember the tools are aids, not necessities.

Since I started it, I prepared a simple template for everyone:

```markdown
# Title

## HTML

## CSS

## JavaScript

// 其他補充 ...

```

It looks something like that. Since it's all vanilla HTML, CSS, and JavaScript, covering it from those three angles can't go wrong. Even though JavaScript is the main focus, you can also look at how the HTML is laid out, and sometimes CSS has its own little tricks. Anything you learned, you can share.

If you're not yet familiar with markdown syntax, that's fine — check out the **HackMD tutorial**, billed as something you can pick up in 10 minutes. I do think it's still a bit unfriendly to non-engineers, and my attempts to drag non-engineer friends into it have yet to succeed XD

> Further learning: [HackMD tutorial](https://hackmd.io/c/tutorials-tw/%2Fs%2Fquick-start-tw)

HackMD also has a slide mode (side mode), by the way. You just need to plan out how much content fits on each slide so things don't get cut off. It's super handy for presentations — give it a try.

CodePen, on the other hand, is decidedly more engineer-oriented. You need basic HTML, CSS, and JavaScript knowledge to really understand what's going on. If your study group doesn't need those, you don't have to use this tool — there are other platforms.

The CodePen interface looks like this:

![CodePen interface](https://i.imgur.com/T0viLyL.png)

And here's what using CodePen looks like:

![CodePen usage](https://i.imgur.com/D7lmpRR.png)

Simply put, it's split into 3 parts: HTML, CSS, and JavaScript, with the right side showing a live preview of the current result. Got a new idea? Try it, play with it — treat it as a playground. You can also share it with others.

That about wraps up the setup of the collaborative-notes study group. The hard part comes next: "keeping it going."

Across JavaScript30 you learn a lot, and very broadly. Some of it you might not actually use that often, but it absolutely opens your eyes — you'll even catch yourself saying "Wait, this exists?!" And it's all vanilla. After going through it, I couldn't help but wonder: "Do I really know JavaScript?"

Some of the fun stuff in JavaScript30:

- `console.log`, `console.error`, `console.count`, and so on.
- canvas drawing
- various array exercises
- base64 pixel manipulation
- other fun little effects

Here's our simple end result (thanks to all the classmates who participated): [JS30 — I Want to Be a JavaScript Master](https://hackmd.io/@benben6515/javascript-30)

## Conclusion

This is another post that's a bit light on technical content (sweat). But there are surely some people who aren't familiar with these tools — maybe someone out there has ideas but no tools, and doesn't know where to start. If that's you, this article was written for you.

Actually, this entire ErrorBaker blog is itself a collaborative blog. So if you want, you can also start a collaborative blog together. Or if you think a collaborative-notes study group sounds good, you can start one of those too. So go ahead — start planning your collaboration!

Finally, I hope we can all keep progressing and growing together. Thanks for reading.

### Ref

- [JavaScript 30](https://javascript30.com/)
- [HackMD](https://hackmd.io/)
- [CodePen](https://codepen.io/)
- [A collaboration platform built for engineer docs: the HackMD story | Medium](https://medium.com/starrocket/hackmd-product-story-1e332f83d343)
- [JS30 — I Want to Be a JavaScript Master | my HackMD example](https://hackmd.io/@benben6515/javascript-30)

> Disclaimer

The above is all based on my own experience, so some subjective opinions are inevitable. It's offered for your reference, and I welcome you to share your own experiences and discuss.
If you spot any errors, please point them out — I'll fix them right away. Thanks again, everyone!

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me).

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
