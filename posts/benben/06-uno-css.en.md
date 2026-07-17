---
title: Uno CSS — The Rising Star to Unify Them All?
date: 2022-05-18
tags: [CSS, unoCSS]
author: benben
layout: layouts/post.njk
image: https://i.imgur.com/XRsgu8H.png
lang: en
sourceLang: zh-TW
translationKey: benben/06-uno-css
permalink: /en/posts/benben/06-uno-css/
draft: true
sourceHash: b5ee1c9e34372faa2e9cf2d9e614e8e4fa83178ca4eef4b4f6b18d5208d4530c
---

<!-- summary -->
<!-- Unify all your CSS with Uno CSS!? -->
<!-- summary -->

## Intro

Hey hey! It's me again!

The small gig I picked up is about to wrap up! So happy — I hope it closes smoothly so I have more time to write for Error Baker!

Now straight to the point: this time I'm sharing **Uno CSS**!

<center>
  <img src="https://i.imgur.com/LQrk0DN.png" class="post-image-width" alt="uno css logo" />
</center>

> Image source: [Uno CSS Github](https://github.com/unocss/unocss)

In short, it's a **Tailwind** alternative CSS solution with no tedious setup (~~I'm not saying Tailwind's setup is tedious, mind you~~). You can use it right away. You could say it copied Tailwind, but it also has more powerful features — like `regex`-based configuration and so on (I'll hold off on that for now). After reading this post, you might see things differently!

Compared to the big three frontend frameworks, CSS has hundreds of styles (SASS/SCSS, Bootstrap, Tailwind, WindyCSS, the CSS-in-JS family, and so on). So should you learn Uno CSS or not? I think that's up to you! But if you already know Bootstrap or Tailwind, then learning Uno CSS is very **intuitive**, because Uno CSS integrates all those habitual idioms!

A little tempted? Or still hesitating? Let me briefly introduce the author: [antfu (Anthony Fu)](https://github.com/antfu). Readers familiar with the Vue ecosystem have definitely heard his name — he's a Vue and Vite core team member, and one of the developers of Windi CSS and VueUse. I started following him because I was learning Vue. The great man is genuinely wild — maybe I'll write a separate post about antfu another time.

## TL;DR

> A trendy term you learn when becoming an engineer: Too Long; Didn't Read.

I just said learning Uno CSS is intuitive? How so? Take Tailwind: developers just starting with it (and even experienced developers still hit this) run into a frustrating setback during development.

For example:

> in tailwind css

```html
<div class="w-25"></div>
<!-- error!: no `w-25` class -->
<!-- notice!: this `w-25` class mean 6.25rem, because 1 : 0.25rem in tailwind -->
```

First, in Tailwind there's no `w-25` class, because the scale is usually multiples of 2: 1, 2, 3, 4, 5, 6, 12, 24, 48, 60, 96, ... (I might still be missing some). One detail worth noting: that `w-25` means a width of `6.25rem`, because in Tailwind the `w` unit ratio is `1 : 0.25rem`.

And then there's another very common situation: you don't know what unit the number represents. Same example: what unit is the 25 in `w-25`? %? px? rem? 0.25rem? Unless you read the docs or install a Tailwind plugin, you won't know — and different utilities use different units: `m-4`, `border-3`, `text-lg`, `shadow-sm` — can you eyeball each and say exactly how much it is? If you can, you get a round of applause.

Finally, if I really want to use the `w-25` class, what do I do? You have to dig through the docs for the config file, then add a pile of config. Adding config once feels great; adding it constantly feels even better — until your config file is bigger than the CSS you'd have written yourself. At that point you'll inevitably blurt out: "Why am I using Tailwind? I might as well write it myself." That's a situation beginners like me hit all the time. But this gets better as you get more familiar!

On the other hand, let's look at how Uno CSS handles it:

> in uno css

```html
<div class="w-25"></div>
<!-- ok!: auto generate `w-25` class -->
<!-- notice!: this `w-25` class mean 6.25rem, uno css take care this for us -->

<!-- If I want to `25px` width -->
<div class="w-25px"></div>
<!-- ok!: auto generate `w-25px` class -->
<!-- notice!: this `w-25px` class mean 25px, uno css take care this for us without other syntax -->

<!-- If I want to `25rem` width -->
<div class="w-25rem"></div>
<!-- ok!: auto generate `w-25rem` class -->
<!-- notice!: this `w-25rem` class mean 25rem, uno css take care this for us without other syntax -->
```

With Uno CSS, all the problems above are solved: numbers, units, config files.

(Ever since I started using Uno CSS, my layouts score 100!)

The first time I ran into this I was absolutely amazed — what sorcery is this?!

Now let's try a bigger flex:

> in uno css

```html
<div class="w-777"></div>
<!-- ok!: auto generate `w-777` class -->
```

![uno css class](https://i.imgur.com/4Rnomte.png)

> Image source: my VS Code.

No messing around! Zero config, auto-generated!

Want to try `77777777777777` and see if it works? I'll leave that to anyone interested. First, drop a wave of `77777777777777`.

Actually, this isn't magic — clever readers will have guessed: it's "**regular expressions**"! I added a regex.

> Further reading: [A Simple Beginner's Guide to Regular Expressions - Huli](https://blog.huli.tw/2020/05/16/introduction-to-regular-expression/)

## Efficacy

The regex capability alone won my heart! In fact, the auto-inference feature already existed in Windi CSS, but Uno CSS is also incredibly fast when it comes to performance!

Let's look at the benchmarks against other tools:

```md
3/26/2022, 11:41:26 PM
1656 utilities | x50 runs (min build time)

none                             12.42 ms / delta.      0.00 ms
unocss       v0.30.6             20.98 ms / delta.      8.57 ms (x1.00)
tailwindcss  v3.0.23           1621.38 ms / delta.   1608.96 ms (x187.79)
windicss     v3.5.1            1855.86 ms / delta.   1843.45 ms (x215.16)
```

> Source: [uno css github](https://github.com/unocss/unocss)

Wow! This speed basically leaves everyone in the dust!

But `Uno CSS` is very low-key (?). On the [uno css github page](https://github.com/unocss/unocss) they include the note: `Inspired by Windi CSS, Tailwind CSS, and Twind, but: ...`

They don't go around saying "X kills Y" or "the best CSS Library" and so on (~~mystery voice: PHP is the best programming language~~).

On the contrary, Uno CSS even **integrates the CSS styles of other popular CSS libraries**!

For example: ml-3 (Tailwind), ms-2 (Bootstrap), ma4 (Tachyons), and mt-10px (Windi CSS) — all of them work!

> in Uno CSS

```css
.ma4 { margin: 1rem; }
.ml-3 { margin-left: 0.75rem; }
.ms-2 { margin-inline-start: 0.5rem; }
.mt-10px { margin-top: 10px; }
// all works!
```

This is also why I said that once you've learned Tailwind, Bootstrap, and so on, learning Uno CSS will be quick — because you're already familiar with some of the styling idioms. But going from `only Bootstrap to Tailwind` or `only Tailwind to Bootstrap` always incurs extra time cost, because different tools write things slightly differently.

## Document

How could a good Library not have docs!

And the quality of docs affects DX (developer experience) — having good DX is actually pretty important!

When engineers write code happily, bugs go down;
when bugs go down, users/clients are happy;
when users/clients are happy, the boss is happy;
when the boss is happy, you get a raise (~~no you don't~~).

On the DX front, the Vue ecosystem is generally pretty good. Take Vite (a Vue-ecosystem dev tool that also supports React and other major frameworks) — once you use it you can't go back. Development is insanely fast! Vite even has packages supporting Ruby and Laravel!

> Further reading: [Vite](https://vitejs.dev/) — really not going to try it? (~~If you really don't want to, there's nothing I can do XD~~)

Also, Vue's official site — [Vue](https://vuejs.org/) — now supports dark mode (since around 2022/02)! So good!

React's official site — [React](https://reactjs.org/) — at React `18.1.0` (around 2022/05) still has no dark mode (~~every time I dig through the React docs it's harsh on the eyes~~), and the site even feels a bit outdated (but it's still well-written). I think developers starting out with React are all pulling their hair out: should I learn class components first, or function components + hooks? Anyone who's been there gets it — there's real pain you can't articulate. I'll leave this to readers to feel out (actually, you should probably learn JavaScript well first?).

OK, I'll stop here, or else a war will break out.

Honestly both official sites have solid content, written in detail. If you have the heart for it, reading the docs seriously, you should be able to pick things up (the precondition being you actually have the heart for it — otherwise, finding a tutorial will save you time).

Back to this Uno CSS doc!

![uno css document](https://i.imgur.com/sdBwpo0.png)

> Image source: [UnoCSS Interactive Docs](https://uno.antfu.me/)

The docs only recently came out of Beta. When you land you see a very clean layout — no flashy effects, no oversized headings, very intuitive. You just find what you need. It kind of gives off Google vibes (?).

Let's look up the `w-25` class from earlier...

![uno css document search](https://i.imgur.com/qKurIGO.png)

> Image source: [UnoCSS Interactive Docs](https://uno.antfu.me/)

The moment the search result shows up, besides the all-important `width: 6.25rem`, there's also the `regex` usage, links, and even a link to `MDN` — all integrated for you!

This really is the best DX docs experience I've seen so far. If you're short on dev time, just find the info you need and bounce; if you have time, you can dive deeper into CSS principles, brush up on regex, and so on. If you're truly bored to death (~~tell me which company you work at~~), you can try clicking `random`.

## Summary

On my frontend journey, I went from learning React to quietly morphing into a Vue person. I think it's great — you can learn techniques from both sides. Neither is "better"; you can weigh the pros and cons together. In a fast-moving field like frontend, you have to keep an open mind. Usually the people arguing over which framework is best only know that one framework. You rarely see someone who's mastered them all declare one to be the best — each has different `trade off`s. Arguing over which framework to use is basically a non-question at this point. It's like you wouldn't say "I learned HTML, so I won't learn CSS." It's just: which do you learn first? And how deep?

As of right now (as of 2022/05), **React does have more users and higher salaries**, but on **docs, DX, and inclusivity, Vue is genuinely fantastic** — and it's hard to imagine Vue pulling this off without backing from a big company. Even in posts by Vue's author (Evan You), you'll occasionally see comments from the React camp, like `Why not React?`.

Back to `Uno CSS`, you can almost see a bit of Vue's shadow from back then. It's growing fast and has a real shot at becoming a rising star. I think good tools deserve to be known by more people — but in software, **there's no silver bullet**. Whether to use it is up to you.

So the most important question: can `Uno CSS` be used in production? At this stage it's not an official release yet, and there's no guarantee the final API won't change. But you can try it on small projects. I've used it on my own small projects, and the dev experience is fantastic — which is why this article exists. I'm really looking forward to the `Uno CSS` stable release!

Personally, whether or not you plan to use it, it's worth keeping an eye on. To learn more, I highly recommend this piece by the `Uno CSS` author, AntFu: [Reimagining Atomic CSS](https://antfu.me/posts/reimagine-atomic-css-zh) — even if you don't end up using `Uno CSS`, you'll learn a lot.

## Ref

- [UnoCSS Interactive Docs](https://uno.antfu.me/)
- [Windi CSS](https://windicss.org/)
- [Bootstrap](https://getbootstrap.com/)
- [Sass](https://sass-lang.com/)
- [簡易 Regular Expression 入門指南 - Huli](https://blog.huli.tw/2020/05/16/introduction-to-regular-expression/)
- [Vite](https://vitejs.dev/)
- [重新构想原子化 CSS](https://antfu.me/posts/reimagine-atomic-css-zh)

> Disclaimer

The above is all based on my own experience, so some subjective opinions are inevitable. It's offered for your reference, and I welcome you to share your own experiences and discuss.
If you spot any errors, please point them out — I'll fix them right away. Thanks again, everyone!

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me).

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
