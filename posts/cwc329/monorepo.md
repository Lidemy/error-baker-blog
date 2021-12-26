---
title: monorepo 之我見
date: 2021-12-26
tags: [monorepo]
author: cwc329
layout: layouts/post.njk
---

<!-- summary -->

公司這半年陸續將專案架構由 polyrepo 轉為 monorepo，這項改變對於開發以及維運都有影響，這篇文章想要解釋 polyrepo 與 monorepo 這兩個詞，並且寫出在工作上筆者感受到的差異。

<!-- summary -->

## Monorepo & Polyrepo

根據 wiki，monorepo 與 polyrepo 是不同的軟體開發策略。

mono 的意思是 single，repo 是 repository 的縮寫，這個意思就是在軟體開發過程中，使用一個 repository 開發多個模組、專案的方式；而 polyrepo 則是將不同的專案分為不同的 repository 管理。

以前後端分離的 web 開發為例，monorepo 就是把前端與後端的原始碼都放在同個 repository；而 polyrepo 則是把前端與後端分為兩個不同的 repository。

**_monorepo_**

```
.
├── docs                # Documents
│   ├── api             # API spec
│   ├── archived        # Archived documents
│   └── ...
├── README.md
├── services
│   ├── ui
│   ├── api
│   └── ...
├── packages
│   ├── util
│   ├── core
│   └── ...
└── package.json

```

**_polyrepo_**

```
ui
├── docs                # Documents
│   └── ...
├── README.md
├── src
│   ├── util
│   ├── components
│   ├── containers
│   └── ...
└── package.json

api
├── docs                # Documents
│   └── ...
├── README.md
├── src
│   ├── util
│   ├── router
│   ├── model
│   └── ...
└── package.json
```

上面兩個 file structure 應該可以看出 monorepo 以及 polyrepo 的基本不同。

## 開發上的差異

入職的前半年，公司是使用 polyrepo，產品分為十幾個不同的 repo，前端、後端、mqtt、cron job 以及 devOps 等不論是產品、開發以及維運等原始碼都拆分為不同的 repository。今年八月開始將部份 repository 導入 monorepo，如今公司所有軟體相關的專案已經都整合進 monorepo。

筆者在公司的職位是後端工程師，除了寫後端 API 之外也負責部分 devOps 的工作，先簡述在兩個環境下開發的情境，之後再比較異同。

### polyrepo

開發上，首先是開發環境的建立，polyrepo 的架構下，如果只是單純的前後端開發，不牽扯到 mqtt 或者 cron job 的話，只要把前後端的 repo clone 下來即可，開發上不需要用到的 repository 是可以不用拉到 local 的。
而進入到功能開發階段，前端與後端基本上是各寫各的，各自用各自 team 慣用的 branch naming 與 commit convention，當要整合測試的時候，就把數個專案切換到對應的 branch 對接。

公司有自己的 library，讓多個專案使用，在 polyrepo 下做法是包成 private npm package，需要 library 的專案就用 npm install 的方式將 library 當作 npm package 引入。而 package 的專案設有自動發佈到 npm 的 CI/CD 流程。

至於 operating 方面，公司有 dev, staging 以及 prod 三個環境，這三個環境是以 branch 作為區分。如果需要更新 staging 的版本，就要在十幾個 repository 將 dev 的 code 進到 staging，重複十幾次的動作。
在設定 CI/CD 時也是，如果今天 CI/CD 流程有所變動，也需要更改所有的 repository 的 CI/CD 設定檔。

### monorepo

開發上，monorepo 只要把一個 repository clone 到 local 就好了，這個 repository 就會包含所有的專案，是一包非常龐大、檔案架構複雜且非常多層的原始碼。
前後端開發雖然也是各寫各的，不過功能開發都會在同一個 feature branch 下共同開發。branch naming 會一致，不過 commit convention 差異較大。feature 在整合測試的時候直接使用 feature branch 即可。
當 feature 開發完成，需要將所有專案的 feature branch 都進到主線，整個功能才會正常上線。

有一些比較底層的 util function 或者公司自己的 library 則是放在 monorepo 的 package 中作為 shared package 讓所有專案調用。而透過一些 monorepo 的工具，在 build image 的時候就會把用到的 util function 以及 library 打包進去，就不需要再透過 npm package 的方式引入。

operating 方面，更新版本就是把一個 repository 的 dev 進到 staging，這一個動作就會包含這次所有的變動。
CI/CD 設定則可以透過模組化的方式，讓需要類似流程的專案使用同樣的一個 workflow，如果需要更改某個流程只要更改那個流程的設定，這樣就會直接套用到那些專案上面。

### 差異

開發環境上，polyrepo 建立上較不花資源，比如說今天只要開發 web 前後端，就只需要兩個 repository 就可以了，其餘不相關的專案就不需要一起 clone。但是在 monorepo 下，不論需要一個還是多個專案，都要把所有的原始碼都 clone 下來。如果在 git hook 有跑一些全域檢查，並且條件設定沒有做好的話，可能每一次 commit 都會是漫長的等待。

在功能開發上的差異，筆者認為比較顯著是在後面的整合上。polyrepo 的架構，會需要將不同的專案切換到對應的 branch 才行，如果 team 之間沒有溝通好 branch naming，那麼就會需要去記專案、功能與 branch name 的對應關係，這在 local 測試或者 pre-dev site 架設上都多一份工，多一次出錯的機會。有的時候一些 bug 只是因為某個專案並不是在正確的 branch 上。
而 monorepo 因為所有團隊都是在同一個 branch 上開發，就不要再費心力去讓所有的專案都在對的 branch 上，local 測試或者 pre-dev 只要確認是在 feature branch 上即可。功能要上線時，只要把 feature branch 進入主線即可。

在原始碼維護上，polyrepo 可能會出現相同或者類似的程式碼在多個專案都出現，這從 util function 到與資料庫對接的程式碼都有。這些程式碼可能連命名都一樣，但是在不同專案可能會相同或者不同，這在開發遇到跨專案時，可能會造成問題。筆者就曾經遇到名稱相同的 function 在不同專案接收 argument 的方式不同而有 bug，還需要 trace 到最底層才發現是 argument 的問題。
不過在 monorepo 的架構下，可以把 util function 以及比較底層的程式碼都放在 shared package，這樣除了可以減少重複的程式碼，也可以讓這些底層 function 的使用方式一致，在開發上就比較不容易出現因為這種命名相同但是使用方式不同的狀況。

而 operating 方面，最顯著的就是花在更新版本的人工時間大幅減少。polyrepo 下筆者需要到所有的 repo 檢查並且進版本；而在 monorepo 下僅需在一個 repository 裡進版本即可，不過這是建立在 monorepo 建立時較為複雜的前期設置，需要用到比較多的開發工具，以及較為複雜的 workflow condition，不過這些前期投資筆者認為是值得的。

雖然這樣看起來，筆者好像認為 monorepo 與 polyrepo 相較是前者較優，不過這也是有各種考量的。筆者認為首先 monorepo 的一些好處是建立在 monorepo 建立時較為繁瑣的前置設定，筆者公司在導入之時，除了評估，也是由資深的工程師測試各項設定，統整不同專案的設定，找出各個專案可以共通的基本設定，前前後後花好長一段時間才完成初期設定並且開始慢慢將舊專案導入。
以及目前公司的結構還算扁平，每個開發人員的權限相近，不會有哪些專案只允許特定開發人員的狀況，如果有專案權限管理著需求，monorepo 就不會是個好選擇，因為只要在 monorepo 裡的專案，基本上能看到 monorepo 的人都可以去檢視並且修改。

## 結語

不知道各位的公司或者組織是使用 monorepo 還是 polyrepo，還是兩者都有。
筆者認為自己能夠在入職第一年就體驗到這兩種不同的管理方式是滿新奇的體驗，希望這篇簡介以及個人意見能讓各位對於 monorepo 以及 polyrepo 有一些理解，也歡迎在留言指正以及分享。感謝！

## 參考資料

[wiki](https://en.wikipedia.org/wiki/Monorepo)
