---
title: Why Use a Framework — What's the Best Answer You've Heard?
date: 2021-09-19
tags: [framework]
author: benben
layout: layouts/post.njk
image: https://www.saaspegasus.com/static/images/web/modern-javascript/2008-vs-2021.png
lang: en
sourceLang: zh-TW
translationKey: benben/02-framework
permalink: /en/posts/benben/02-framework/
draft: true
sourceHash: 84fa49b4397c0aca6b674b44ec27b0a2267d8d2ce97c03ee938351cf3fc96a31
---

<!-- summary -->
<!-- There are tons of frameworks out there, but have you ever wondered why we use them? -->
<!-- summary -->

![modern-javascript](https://www.saaspegasus.com/static/images/web/modern-javascript/2008-vs-2021.png)

> Image source: [https://www.saaspegasus.com/guides/](https://www.saaspegasus.com/guides/)

## Foreword

Hey everyone! Web frontend in 2021 is, as always, a dizzying kaleidoscope. And of course, we're all learning our way through it in a tumble.

It's also near the tail end of the fifth cohort of my programming mentorship program. I don't know what your learning path looked like — maybe some veterans went all the way from vanilla JavaScript, to jQuery, to the era of the "big three" frameworks. And the frameworks themselves have been through many updates between 2016 and 2021. But a lot of `quick frontend bootcamps` might have you jump straight from just-finished-JavaScript into React hooks, Vue 3, and so on. I'd bet there are people (probably more than a few) who don't know who invented JavaScript, or who've never even heard of Netscape — let alone frameworks. "Why learn JavaScript?" is something they probably couldn't answer very well either.

For these `why`-type questions, I like to dig into the history. History tells you the context people back then were operating in. Once you understand and think it through a bit, you can usually derive your own answer. And that kind of answer is far more convincing to yourself than the ones you mug up to please an interviewer.

I'll approach the question of "why use a framework" from a frontend-framework perspective. But sometimes you don't need to agonize over it so much. Some questions are philosophical — like "what do people live for?" — and you'll just spiral into an existential crisis.

## A Brief History of JavaScript

**In 1995, the great Brendan Eich invented JavaScript.** July 4 of this year (2021) is also his 60th birthday. We mourn him — no wait, we wish him well and thank him! Thanks to his invention of JavaScript, we have jobs to do, and there's a lot that's genuinely hard to understand — but if you can grasp what most people don't, you'll stand out from the crowd. Honestly, that's a pretty good signal of competence, so it kind of makes sense for interviews to test it.

![Thanks for JS - meme](https://res.cloudinary.com/practicaldev/image/fetch/s--ZDtqrBOj--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://github.com/damiancipolat/js_vs_memes/blob/master/doc/js_thanks.png%3Fraw%3Dtrue)

> Image source: [https://dev.to/damxipo/javascript-versus-memes-explaining-various-funny-memes-2o8c](https://dev.to/damxipo/javascript-versus-memes-explaining-various-funny-memes-2o8c)

Thanks, Brendan Eich, for inventing JavaScript! By the way, in case you didn't know, he's "that man" in the picture.

The context back then was: **they needed a program that could run in the browser.** **Netscape** assigned the task to Brendan Eich. Java happened to be red-hot at the time, so he named the language `JavaScript` to ride on its fame — even though it has absolutely nothing to do with Java (there's no "if you know one, you basically know the other" thing here). But it's not entirely unrelated either: he did "reference" Java when designing it, and later on languages kept "referencing" each other, so many idioms do share a similar spirit. I'll leave you to feel that out for yourself.

The controversies Brendan Eich later stirred up — that's another story.

At this point, JavaScript was still pure, very pure. OK, that's enough of a brief JS history for now.

## The jQuery Hegemon and the Warring Browsers

After JavaScript was invented, Netscape's market share took off, and for a time it was the undisputed leader. Naturally, the other players got jealous. The web's user base was still small back then — and as any kid could tell you, this was obviously a vast blue ocean! In no time, a pile of browsers popped up: Internet Explorer, Chrome, Firefox, Safari, Opera, and so on. And so the browser wars began! Kids make choices; I use IE!

But the good times didn't last. The problem facing engineers was: **how to solve the cross-browser problem.** At first, the answer was to write every variation out in full — exhausting, sure, but it also created plenty of jobs, right? Where there's a need, there's an opportunity.

**In 2006, jQuery launched.** At its peak, 65% of the top 10,000 most-visited websites in the world used jQuery. It perfectly solved the cross-browser problem: one way of writing it would compile into code that worked across browsers. Good library — why not use it? Back then, the distinction between library and framework probably didn't even exist yet. The problem was solved, the client was happy, the boss was happy, and you made bank — so you were happy too.

A simple jQuery snippet looks like this:

```javascript
// jQuery
$("#hello")

// 原生 JavaScript
document.getElementById(hello)
```

Why use jQuery becomes self-evident: besides letting you type a lot less, the most important thing is that it solves the cross-browser problem mentioned above. But actually, you don't need jQuery. Browser support is great nowadays, and the much-maligned issue is performance. You didn't feel it on small old projects, but if you reach for jQuery for every little thing, that's wrong. For instance, native `document.getElementById` is far faster than jQuery — as your project grows, it gets slower and slower.

> Further reading: [You Might Not Need jQuery](https://youmightnotneedjquery.com/)

## Framework & Library

As time went on, Facebook released React in 2013 — a brand-new technology at the time. Of course, for it to reach meaningful adoption in Taiwan usually takes at least 3 years. I was still in school then, and of course the school wouldn't teach anything this trendy. But the interview bar already demanded you know a framework (~~well, I never learned it, and school never taught it~~). And sure enough, around 2016, `frontend bootcamps` sprang up like mushrooms after rain, advertising zero-experience career changes and taking in anyone with a pulse. But the reality is: we have no idea what happened to all those anyones afterward — the point was just to get bodies in seats and cash out.

This isn't to say certain people shouldn't become engineers — it's to say this path may be harder than it looks on the surface. Those who successfully transitioned put in enormous time and effort that you didn't see. If your resolve still holds, give it a shot. At worst, you lose 3 to 6 months.

Back to the React framework. Many people saw [the React official site](https://reactjs.org/) describe it as: `A JavaScript library for building user interfaces`. Oh! So React isn't a framework — it's a "Library." Only the whole ecosystem combined makes a framework. Uh-huh, now you get it! But! As a beginner, I was still full of question marks reading this. And so my question becomes: what's a Library then?

The word Library can actually be traced back to 2600 BCE, built from Sumerian cuneiform tablets — oh wait, that's a "library" (the building). Honestly, I couldn't find a clean explanation, because the word has already become very abstract and has many meanings. You can also check [the Chinese Wikipedia page](https://zh.wikipedia.org/wiki/%E5%87%BD%E5%BC%8F%E5%BA%AB) to see just how thin the content is. "Library" splits into Computing Library and Digital Library, and what we want here is the code-containing kind inside Digital Library — wait! You're confusing me! But I think you get what I mean.

Let's switch angles. If you're a web engineer, I bet you've used `npm`. OK, if you claim you haven't and you hand-roll everything, then I'll concede you're a god. npm was born in 2010, and it's not a stretch to say the term "library" really took off around then. For most beginners, "Library" just means: `npm install XXX` to download the package you want to use. Yep, that's how I came to know the word too — a familiar-yet-strange term, and nothing more.

Actually, if you can write a function, you can write a Library. For example:

```javascript
function add(a, b) {
  return a + b
}

// 或是已經沒這麼潮的寫法
const add = (a, b) => a + b
```

Congratulations — you've just written an addition Library. That's how simple the concept is.

Library and Framework, in short, both let you use code someone else has written. The difference lies in `freedom`. It's an abstract concept; let's use a restaurant analogy:

1. The Library approach: like freely picking whatever food you want to eat, or just having a drink.
2. The Framework approach: like a set meal — you can pick certain mains, but dessert isn't optional.

That should make the difference clearer. But "freedom" is also pretty subjective. For example, most people would accept that React offers more freedom than Angular — yet both are still frameworks (more precisely, the React ecosystem and Angular).

> Further reading: [The Difference Between a Framework and a Library](https://www.freecodecamp.org/news/the-difference-between-a-framework-and-a-library-bd133054023f/)

Since React isn't (strictly speaking) a framework, let's think: **what else do you need to add to React to make it a framework?**

If you've used `create-react-app` and looked at the `package.json`, you'll see `react`, `react-dom`, plus some testing packages. Doesn't look like much. But if you're curious like me, open `node_modules` and see how many packages are in there — you'll spot big names like `webpack`, `babel`, `jest`, as well as handy little ones like `uuid`, `dotenv`, `fast`, and so on.

So does having webpack, babel, and jest — those big Libraries — make it a framework? Maybe yes, maybe no. I don't know.

> Further reading: [Is React a Library or a Framework? Here's Why it Matters](https://www.freecodecamp.org/news/is-react-a-library-or-a-framework/)

### Benefits of Using a Framework

Common answers include:

- The same functionality can be reused; easy to extend and maintain
- Components & modularity
- Separation of view and data
- React can be used to build SPAs
- React's ecosystem is mature and there's a wealth of online resources
- Keeps the app's entry point single
- Because more people in the community use it, there are more resources
- ... etc.

But thinking carefully about the answers above, they may all be **outcomes** rather than causes. You have to get the cause-and-effect straight for the logic to be clear. For example, the top two points have nothing to do with frameworks per se — they're things you should pay attention to in any programming.

As I said before, the thing to focus on is what problem the framework solves. Let's see what problem emerged at this point.

The context back then: **in 2010, the iPhone 4 launched, and users migrated en masse to mobile devices.** At this point, the web had to adapt not just to device sizes (RWD) but also get closer to the commercial market. That meant UI/UX mattered more and more — as users grew, you needed better experiences to retain them. The idea of frontend-backend separation also began to sprout. Sure enough, from this magical inflection point (2010), a flood of tools emerged. Remember the picture at the top? If you look closely, the timelines line up.

At this point, the division of labor wasn't yet true frontend-backend separation. To cope with this huge shift, the proto-form of frameworks was born. But separation wasn't done just one way — common patterns include MVC, MVP, and MVVM. So frameworks have some sub-differences, but all aim to solve the same thing: **frontend-backend separation.**

And here the answer gradually surfaces. Why do we need frameworks? Because we need frontend-backend separation. Why do we need frontend-backend separation? Because project scale is large.

Almost all large projects today use frameworks, so a company requiring you to learn at least one framework is pretty reasonable — because company-grade projects are usually big. Now that today's frameworks can all solve the frontend-backend separation problem, the next step is picking one. You can choose based on the model you prefer, performance, file size, syntax, and so on. Of course, the most important thing is still what the company needs XD

## Conclusion

New frontend stuff keeps coming out, and old stuff keeps getting updated — it's impossible to keep up!

Looking back at how frontend tech has evolved, it's not hard to see that new technologies and tools are always born around problems. But in recent years, the pace has slowed — much like how the phone market has saturated. That signals frontend is gradually taking shape, and there may not be huge changes ahead. So seize the moment: when you can master the tech, don't let it slip away!

Finally, I hope we can all keep progressing together! If I've gotten anything wrong or explained it unclearly, please point it out. Thanks for reading.

## Ref

- [You Might Not Need jQuery](https://youmightnotneedjquery.com/)
- [The Difference Between a Framework and a Library](https://www.freecodecamp.org/news/the-difference-between-a-framework-and-a-library-bd133054023f/)
- [Is React a Library or a Framework? Here's Why it Matters](https://www.freecodecamp.org/news/is-react-a-library-or-a-framework/)

> Disclaimer

The above is all based on my own experience, so some subjective opinions are inevitable. It's offered for your reference, and I welcome you to share your own experiences and discuss.
If you spot any errors, please point them out — I'll fix them right away. Thanks again, everyone!

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
