---
title: Wait, I Still Want to Learn CLI — A Slightly More Advanced CLI
date: 2022-01-02
tags: [JavaScript, CLI]
author: benben
layout: layouts/post.njk
image: https://i.imgur.com/PfIQ0Lq.png
lang: en
sourceLang: zh-TW
translationKey: benben/04-cli
permalink: /en/posts/benben/04-cli/
draft: true
sourceHash: b56102c166141b5484a4d0780a468a74309771fa2f62459248023883d12a145b
---

<!-- summary -->
<!-- A teacher leads you in, but cultivation is up to you — are you still practicing your CLI? -->
<!-- summary -->

![window terminal](https://i.imgur.com/PfIQ0Lq.png)

> Image source: my Windows terminal (imgur)

## Foreword

(Too busy with work — I'm behind on writing this.)

Hey everyone, time flies! It's already late November — one more month and this year is over too!

Lidemy's fifth cohort job-hunting period ends on 12/12 — it's about to reach its final full stop. Quite a few of you are probably already working by now.

My new job just started. The company was originally a design firm, with its main product in 3D/VR. Their previous projects were outsourced; recently they've been building out their own frontend team, which I guess counts as innovation (?)

So the frontend side has yet to settle on any process. My manager doesn't actually know frontend tech all that deeply (I noticed this across a few Q&A sessions), but he's aware of it too (since he used to do 3D modeling). So whenever there's a problem, I can ask colleagues. One frontend colleague is really sharp, so for now I discuss issues with him. The folks here are nice — very helpful.

There are exhausting parts too, of course. Since the frontend department is just starting up, resources are scarce, and there aren't many old projects to reference — they're all recent. The framework flips between React and Vue, and the codebases are a mess. For instance, the styles folder has `.css`, `.scss`, and `.sass` files all mixed together (normally you wouldn't write it that way, right?). Going forward, though, it's confirmed they'll use Vue / pug / sass and babylon.js (a WebGL 3D framework), with PHP paired with the Laravel framework on the backend.

Because it's an agency, you have to get up to speed fast. They only gave me a one-week onboarding, then dropped a project on me. In that week I had to learn the company's process, Vue, and babylon.js. Luckily I'd looked at Vue beforehand, but I still voluntarily stayed late to learn more — my colleagues all stay late too, so there's a hint of "salaryman responsibility" going on XD

Is that a good thing? I think it is. As a junior, learn as much as you can — don't worry too much about salary (within reason). The more problems you can solve, the higher your value. After a year or two, once you've built the skills, people will naturally come poach you — and then you'll know who really lost out (X). So keep your eyes on the long game XDD

Anyway, I'm even reading company docs on weekends — time to go keep disrupting the company (?)

> Onto the main topic.

## A Teacher Leads You In

My first encounter with CLI (Command-Line Interface) was in Lidemy, in the very first week1, where the instructor gave a quick intro to CLI operations. It turns out you can do so many things with just the keyboard! I was captivated — it brought me one step closer to **the hacker I'd always pictured in my head**. A bit chuunibyou, you say (?) I bet you imagined it too when you were a kid. But sometimes it's exactly this kind of trivial motivation that keeps pushing you forward.

But without a teacher to lead you in, you'd never go study these things on your own. Without a Chinese teacher, who'd go learn math on their own? Without a math teacher, who'd go study civics? Different fields might as well be different mountains. If you want to piss off your school teachers, try asking along the lines above — they'll definitely smack you.

I was lucky: I happened to like CLI operations and had a teacher to lead me, so I came to understand a handful of CLI commands. I'll introduce the CLI as I know it below. Of course, if you're a friend who knows more, let's chat — I'd be happy :D

This is the course where it all started. Honestly, the free preview is already enough.

> Further learning: [Command Line for Total Beginners | Lidemy](https://www.lidemy.com/p/cmd101-command-line)

## Just Make It Work First

At work, the mouse can already do a lot. But there are times when CLI is the only way, and you'll feel "you can never have too much learning when you need it" — for example, when you need to operate a server remotely (though, granted, pure frontend engineers may not really need it).

Anyway, let's look at some basic commands first!

- cd
  switch the folder path
- ls
  see what files or folders are in the current path
- pwd
  see the current path location
- touch (might not work on Windows; consider using git bash first)
  create a new file

You'll use these commands very, very often, so you definitely need to memorize them. But from my own learning experience, I think: master the basic commands first, then add more gradually — that's the most efficient way to learn!

For instance, if someone dumps a pile of commands on you at once, you'll forget them all within two days, let alone a week. So you might as well just memorize a few common ones first. I think this is intentional on the teacher's part — only walking us through a handful of common ones, and assigning them in the very first week, so that we get familiar with CLI early. Because we'll be using it heavily later, the sooner we're familiar, the better!

The single most-used command is probably `ls`. When I was first learning, the moment I entered a folder I'd `ls` to see what's inside, then `ls` again after `cd`, and `ls` whenever I had nothing to do. Bit by bit, the commands stuck.

There's also a handy command: `whoami`. On your own computer you might not feel much, but on a company machine with many users, this command tells you who the current user is. Simply put, it lets your computer know "who its daddy is." Whenever you're in a bad mood, just ask the computer `whoami` — it will never defy you!

Many commands are meaningful. After seeing `whoami` above, don't you think you'll remember it next time without any special effort? Right?

## Cultivation Is Up to You

The next place you'll use CLI is probably in projects. A lot of docs also include some basic usage.

For example:

```bash
# 開啟專案
npm run start

# 開發專案
npm run watch

...
```

These all count as CLI commands. Even individual tools and frameworks have their own CLIs, like `vue-cli`, `git-bash`, `docker-cli`, `mysql-cli`, and so on.

You say it's exhausting to have to learn so many? Luckily, aside from their special features being different, most of the common commands are the same — like the ls, cd, pwd, touch mentioned above.

Here are a few more commands that come in handy during development:

- mv
  move files
- copy
  copy files
- rm
  delete files

## A Slightly More Advanced CLI

Once you're familiar with the basics above, you can hunt for the commands you like and slowly expand your toolkit. It feels a bit like leveling up skills in a game — wow, I learned another command today, feels like I gained another skill. That's how you keep moving forward instead of staying stuck.

Next I'll share a few handy (but your mileage may vary XD) commands I picked up from poking around here and there.

- open/start (Mac/Windows)
  open a file
- code .
  open VS Code
- shutdown
  shut down (shutdown -s -t 10), log out (shutdown -l)
- exit
  close the terminal (you say clicking the X is enough — believe it or not, I can type `exit` faster than you can precisely mouse-click that tiny X. Don't believe me? Fair enough, I didn't believe it either — but once you learn it, you will.)

And the next two could each spawn many, many, many, many articles. They go deep — all the way down to the Mariana Trench ...

- git
- vim

I'm also really fond of these two! Each has a whole pile of sub-commands underneath. Right now I develop with VS Code plus a vim plugin. It's a deep, deep rabbit hole, but once you're fluent, your dev efficiency improves a lot over the long run (and it's pretty cool too?).

If you're interested, google these two keywords — there are plenty of resources, though they can be quite sleep-inducing. For example: if you only ever `git pull/push`, that's a real shame — there are tons of powerful features. And for vim, maybe only those who can actually use it understand its appeal.

> Further learning: [Git - document](https://git-scm.com/doc)
> Further learning: [Vim - document](https://www.vim.org/docs.php)

## Conclusion

Above is a brief intro to some CLI commands. Of course the water here is still deep, waiting for you and me to explore. I'm still just a little junior, but I think being comfortable with CLI is one of the tickets to becoming a senior. Beyond efficiency, CLI is also a required skill for moving into the backend — so of course I can't stop here.

But with so many commands, which should you learn first? I think whatever makes you happy!

Why learn this stuff? Because I enjoy it and I like it. Compared to blindly studying a pile of things, I think learning a single `whoami` command with zero pressure is way more fun. Don't you agree?

## Ref

- [鳥哥的 Linux 私房菜](http://linux.vbird.org/)
- [Git - document](https://git-scm.com/doc)
- [Vim - document](https://www.vim.org/docs.php)

> Disclaimer

The above is all based on my own experience, so some subjective opinions are inevitable. It's offered for your reference, and I welcome you to share your own experiences and discuss.
If you spot any errors, please point them out — I'll fix them right away. Thanks again, everyone!

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me).

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
