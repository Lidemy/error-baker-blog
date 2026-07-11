---
title: "我所理解的 GitFlow"
date: 2021-10-28
tags: [git, flow]
author: tian
layout: layouts/post.njk
lang: zh-CN
sourceLang: zh-TW
translationKey: tian/git-flow
permalink: /zh-CN/posts/tian/git-flow/
draft: true
sourceHash: ca60c0c3603a3d451d30665323e76b9b550bd4d0edea95c3e6c7c62edd706673
---

<!-- summary -->
公司开始 Run Git Flow 也已经超过 3 个月了，记录一下，随着团队扩大、需求和用户增加，版本控制流程的演变过程。
<!-- summary -->
这样的流程有助于我们稳定地、持续地进行交付。
<!-- more -->

## 一条主分支

- `master`

1. Team Lead 的个人项目，也没什么用户在使用，`master` 就是我的游乐场，我想怎么改就怎么改，反正改坏了趁没人发现的时候再改回来就好。

## 两条主分支

- `master`
- `develop`

2. 业务需求增加，加入初期团队成员。开始分 branch，分别是 `develop` 和 `master`，团队成员直接在 `develop` 上做开发，`develop` 和 `master` 分别绑上测试和正式环境的 CI/CD，`develop` 用于测试，`master` 用于交付，每次开发周期将 `develop` 合并到 `master` 一次，作为新版本发布。

## 两条主分支、一条副分支

- `master`（主）
- `develop`（主）
- `feature`（副）

3. 为确保代码质量，每个人在实现需求的时候都要从 `develop` 开启 `feature` 分支，每次合并回 `develop` 都要发 Pull Request，由 Team Lead Review 合并。

4. 为了让自己的代码容易 Review，如果开发的过程需要重构，另外开一个用于重构的 `feature` branch 来重构代码，新的功能则基于这个重构的 Branch 继续做开发，一个功能可以分别发好几个 PR，尽量减少每个 PR 改动文件的数量。

5. 需求做不完，团队人员再度增加，为增进团队交流、保持同步，随着项目扩大，每个人在发 PR 的时候都可以 Assign 给相关成员（曾经接触过这里的代码，或将要接触这部分代码的人），团队的中心分散，每个人都可以对彼此的代码发表评论与 Approved。

6. 同步 Coding Style，每隔固定周期，对这个周期发送的 PR 做 Review，将 Coding Style 写成文档，方便未来入职的人能快速地理解项目，并融入团队。

## 两条主分支、两条副分支

- `master`（主）
- `release`（副）
- `develop`（主）
- `feature`（副）

7. 以 `develop` 作为测试环境，当多人协作时，不小心把没写好的代码合到 `develop` 的时候，就会影响测试人员 QA 做测试，于是我们新增了 `release` branch 来代替 `develop` 测试的功能，将原来测试环境的 CI/CD 从 `develop` 改绑到 `release` 上面。这样一来，PR 合并到 `develop` 的时候就不会部署，不仅减少不必要的 build time，当 `release` branch 出现问题的时候，还可以即时将 `release` rebase 到 `develop` 上面没有问题的 commit，让 QA 的测试不会被影响；测试遇到问题时也可以即时在 `release` 上面做修正，只不过最后要记得再合并回主要的 `develop` 分支。

## 两条主分支、三条副分支（GitFlow）

- `master`（主）
- `hotfix`（副）
- `release`（副）
- `develop`（主）
- `feature`（副）

8. 即便走过这个流程，还是会有 Bug 被部署到正式环境的情况发生，这时候就需要从 `master` 开出一个 `hotfix` branch 做抢修，确认没问题之后，同样要合并回 `master` 和 `develop` 两个大分支；如果没有将 `hotfix` 合并到 `develop`，在下个周期部署的时候，很可能会把修好的 hotfix 盖掉。

你有什么不使用 Git Flow 的理由吗？欢迎在下面留言与我分享。
