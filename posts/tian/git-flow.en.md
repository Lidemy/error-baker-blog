---
title: "GitFlow as I Understand It"
date: 2021-10-28
tags: [git, flow]
author: tian
layout: layouts/post.njk
lang: en
sourceLang: zh-TW
translationKey: tian/git-flow
permalink: /en/posts/tian/git-flow/
draft: true
sourceHash: 9e08e16af3be44a8813fcb624dbe3acaac0aa3ec7075ff69e73286ae61c32d12
---

<!-- summary -->
It's been over three months since our company started running Git Flow. Here's a record of how our version-control workflow evolved as the team grew and the number of features and users increased.
<!-- summary -->
This kind of workflow helps us deliver stably and continuously.
<!-- more -->

## One main branch

- `master`

1. As the Team Lead's personal project with hardly any users, `master` was my playground — I changed whatever I wanted however I wanted. If I broke something, I'd just revert it before anyone noticed.

## Two main branches

- `master`
- `develop`

2. As business requirements grew and the first team members joined, we started splitting branches into `develop` and `master`. Team members developed directly on `develop`. `develop` and `master` were each wired to the CI/CD of the staging and production environments respectively — `develop` for testing, `master` for delivery. Each development cycle, `develop` was merged into `master` once as a new version release.

## Two main branches, one sub-branch

- `master` (main)
- `develop` (main)
- `feature` (sub)

3. To ensure code quality, everyone had to open a `feature` branch off `develop` when implementing a requirement, and every merge back into `develop` required a Pull Request reviewed and merged by the Team Lead.

4. To keep my own code easy to review, if a refactor was needed during development I'd open a separate `feature` branch just for the refactor, and new features would be built on top of that refactor branch. One feature could be split across several PRs, keeping the number of files changed in each PR as small as possible.

5. With requirements piling up and the team growing again, to improve communication and stay in sync as the project expanded, everyone could Assign their PRs to relevant members (people who had touched this code before, or who were about to). The team's center became decentralized — everyone could comment on and Approve each other's code.

6. To keep coding style consistent, every fixed period we'd review the PRs raised during that period and document the coding style, so future hires could quickly understand the project and integrate into the team.

## Two main branches, two sub-branches

- `master` (main)
- `release` (sub)
- `develop` (main)
- `feature` (sub)

7. We used `develop` as the testing environment. When many people collaborate and unfinished code accidentally gets merged into `develop`, it disrupts the QA testers' work. So we added a `release` branch to take over `develop`'s testing role, moving the original staging CI/CD from `develop` to `release`. This way, merging a PR into `develop` no longer triggers a deploy — not only cutting unnecessary build time, but also, when a problem shows up on the `release` branch, we can promptly rebase `release` onto a known-good commit on `develop` so QA testing isn't affected. When testing hits a problem, fixes can be made on `release` right away — just remember to merge it back into the main `develop` branch in the end.

## Two main branches, three sub-branches (GitFlow)

- `master` (main)
- `hotfix` (sub)
- `release` (sub)
- `develop` (main)
- `feature` (sub)

8. Even after going through this whole flow, bugs still occasionally get deployed to production. When that happens, you need to open a `hotfix` branch off `master` for an emergency fix, and after confirming it's fine, merge it back into both major branches, `master` and `develop`. If you don't merge the `hotfix` into `develop`, the next cycle's deploy will very likely overwrite the fixed hotfix.

Do you have any reasons for not using Git Flow? Feel free to share in the comments below.
