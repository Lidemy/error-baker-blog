---
title: 我所理解的 GitFlow
date: 2021-10-28
tags: [git, flow]
author: tian
layout: layouts/post.njk
---

<!-- summary -->
公司開始 Run Git Flow 也已經超過 3 個月了，記錄一下，隨著團隊擴大，需求和用戶增加，版本控制流程的演變過程。
<!-- summary -->
這樣的流程有助於我們穩定地、持續地進行交付。
<!-- more -->

### 一條主分支 
> - master
1. Team Lead 的個人專案，也沒什麼用戶在使用， `master` 就是我的遊樂場，我想怎麼改怎麼改，反正改壞趁沒人發現的時候再改回來就好。

### 兩條主分支
> - master
> - develop
2. 業務需求增加，加入初期團隊成員。開始分 branch 分別是 `develop` 和 `master`，團隊成員直接在 `develop` 上做開發，`develop` 和 `master` 分別綁上測試和正式環境的 CI/CD，`develop`用於測試，`master`用於交付，每次開發週期將 `develop` 合併到 `master` 一次做為新版本發佈。

### 兩條主分支、一條副分支
> - master（主）
> - develop（主）
> - feature（副）

3. 為確保程式碼品質與，每個人在實作需求的時候都要從 `develop` 開啟 `feature` 分支，每次合併回 `develop` 都要發 Pull Request，由 Team Lead Review 合併。
4. 為了讓自己的 Code 容易 Review，如果開發的過程需要重構，另外開一個用於重構的 `feature` branch 來重構程式碼，新的功能則基於這個重構的 Branch 繼續做開發，一個功能可以分別發好幾個 PR，盡量減少每個 PR 改動檔案的數量，
5. 需求做不完，團隊人員再度增加，為增進團隊交流，保持同步，隨著專案擴大，每個人在發 PR 的時候都可以 Assign 給相關成員（曾經接觸過這裡的程式碼，或將要接觸這部分程式碼的人），團隊的中心分散，每個人都可以對彼此的 Code 發表評論與 Approved。
6. 同步 Coding Style，每隔固定週期，對這這個週期發送的 PR 做 Review，將 Coding Style 寫成文件，方便未來入職的人能快速的理解專案，並融入團隊。

### 兩條主分支、兩條副分支
> - master（主）
> - release (副)
> - develop（主）
> - feature（副）

7. 以 `develop` 作為測試環境，當多人協作，不小心有沒寫好的程式碼，被合到 `develop` 的時候，這時候就會影響測試人員 QA 做測試，我們新增了 `release` branch，來代替 `develop` 測試的功能，將原來的測試環境的 CI/CD 改從 `develop` 綁到 `release` 上面，這樣一來 PR 合併到 `develop` 的時候就不會部署，不僅減少不必要 build time，當 `release` branch 出現問題的時候，可以即時將 `release` rebase 到 `develop` 上面沒有問題的 commit 讓 QA 的測試不會被影響，當測試遇到問題也可以即時的在 `release` 上面做修正，只不過最後要記得再合併回主要的 `develop` 分支。

### 兩條主分支、三條副分支（GitFlow）
> - master（主）
> - hotfix（副）
> - release (副)
> - develop（主）
> - feature（副）

8. 即便走過這個流程，還是會有 Bug 被部署到正式環境的情況發生，這時候就需要從 `master` 開出一個 `hotfix` branch 做搶修，確認沒問題之後，也是要合併回 `master` 和 `develop` 兩個大分支，如果沒有將 `hotfix` 合併到 `develop`，在下個週期部署的時候，很可能會將修好的 hotfix 蓋掉。

你有什麼不使用 Git Flow 的理由嗎？，歡迎下面留言與我分享？

