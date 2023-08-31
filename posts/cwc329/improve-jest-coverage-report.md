---
title: 改善 CI/CD 中的 jest-coverage-report
date: 2023-03-26
tags: [devops, 'github actions', 'CI/CD']
author: cwc329
layout: layouts/post.njk
---

# 改善 CI/CD 中的 jest-coverage-report
<!-- summary -->

兩個月前的 1 on 1 中不知死活的我跟 lead 說最近在開發上感覺任務沒有突破，感覺沒什麼挑戰。
於是 lead 給我一個題目：「我們 CI/CD 中的 test coverage report 跑的有點太久了，你有什麼除了加大機器以外的加速方法嗎？我們下個月討論一下。」

<!-- summary -->

## 碰到的問題

首先太慢到底是多慢呢？由於我們公司所有產品幾乎都在同一個 monorepo 中，大家都用 typescript 開發以及 jest 作測試框架。

我先盤點一下目前大概有 600 個 test suites，總共大概有 6000 個單元測試，這個量級其實還好，在 M1 Macbook pro 13" 上大概執行 5 分鐘。

不過同樣的東西放到 CI/CD 上面就要跑 40 分鐘起跳，這個速度嚴重拖慢開發的速度以及節奏，有的時候 PR approved 想說應該可以 merge 了，才發現 test coverage report 沒有過，在 local 改完之後推上去又要再等 40 分鐘。

更別說有的時候會遇到 github 或者 yarn 伺服器失靈導致 job fail，這個時候

## 我的解法

首先我先從 jest 官方文件下手，在 [troubleshooting](https://jestjs.io/docs/troubleshooting#tests-are-extremely-slow-on-docker-andor-continuous-integration-ci-server) 就有人曾經遇到在 CI/CD 環境執行過慢的狀況。

這是因為 CI/CD 的機器通常沒有開發用的電腦好，核心數通常不多，有的甚至只有雙核，官方有的 cli option `--runInBand` 可以用。

根據說明，jest 預設會平行執行測試並且自動分配電腦資源，會預留一個 core 作為 master，其他所有 core 則為 worker。

而 `--runInBand` 其實就是取消平行執行，改成一次執行一個測試，這在資源比較小的機器上可以大幅增加執行速度，不過詳細原因在文件以及討論中都沒有提到。

看到這個我想：「竟然這麼簡單就解決了！？」我立刻發了個 PR 更新 test coverage report 的設定檔，用了一個 POC 的 workflow 測試，結果執行時間馬上減少一半。

我興高采烈的跟 lead 報告，lead 也 approve PR，整個流程大概只花了我一個禮拜，而且都是用開發之餘的瑣碎時間，一切實在是太順利了！

## Nice Try

我的 workflow 進主線之後兩天，我比較了一下前後的差異，問題出現了，test coverage report 的執行時間根本沒有減少。

我萬般不解，我之前的 POC 的確執行時間只有一半，而且我跑了五次結果都差不多，不可能出現這樣的事情啊。

我再 google 一個下午 jest 優化，發現沒有其他適合的解法，這時我想如果無法從 jest 下手，那是否可以從 github action 找看看有沒有機會呢？

我們的 test coverage report 其實是使用 github market 的 [Jest coverage report](https://github.com/marketplace/actions/jest-coverage-report)，我直接去看他們的[文件以及原始碼](https://github.com/ArtiomTr/jest-coverage-report-action)，總算讓我發現為何我的 action 執行時間沒有減少。

這個 action 可以提供這個 PR 的 HEAD 相較於 base 其測試涵蓋率變化，而為了要做出比較 action 會需要 HEAD 以及 base 的測試報告。

這就是問題所在，兩份測試報告就會需要跑兩次測試，但是我的 POC 並不是在 PR 的條件下跑，所以只有執行 HEAD 的 coverage report，所以這樣測試當然不準確。

而 `--runInBand` 這個 flag 之所以沒有幫助是因為目前所用的 runner 是雙核心的機器，在 jest 預設下保留一個 core 作為 master，也就只剩一個 worker，有沒有這個 flag 都是一樣的結果。

## 重新來過

第一次嘗試失敗了，我得再想出一個解法。我把腦筋動到 Jest coverage report 這個 GitHub action 上面。

我翻閱文件，發現他有提供一個選項 [base-coverage-report](https://github.com/ArtiomTr/jest-coverage-report-action#use-existing-test-reports)，用這個選項可以指定 base branch 的 coverage report 在哪裡，從而跳過執行 base branch 的測試。

原本我想說要不要使用 git hook 的方式，在 push 之前強制大家都要跑 test，不過馬上就被否決，這樣等於每次推 code 都要五分鐘以上，這無疑是阻塞開發流程。

這時一個想法在我腦中閃過：目前 test coverage report 每次只要推 code 上去都會跑，但是其實 base branch 幾乎沒有變，如果我能保留 base branch 的 coverage report，這樣不就可以省下一半的時間了？

於是我參考了之前 lead 在 CI/CD 中使用 yarn cache 的方式，在我們的 test coverage report 的 workflow 中加入一個 job，這個 job 就是先去找有沒有 base branch coverage report 的快取，如果有那就直接抓下來，沒有的話就生成一份，然後存成快取。

這次模擬我除了改動 workflow 的設定檔，同時改動了一些 test file 去觸發 test coverage report。

結果如我所料，當 base branch 沒有已經建立的 coverage report 時，整個的執行時間跟之前差不多，大概是 40 分鐘；不過當第二次執行的時候，整體時間減少一半，只要 20 分鐘左右就完成。

在新的 workflow 進入開發主現後，我觀察三天，執行時間明顯下降，這階段的任務算是達成了

但是有個小問題，目前的方法，當主線有更新時並不會自動產生新的 coverage report 快取，而是要等 PR 的 test coverage report 觸發才會產生。這樣會導致當新的 base coverage report 快取還沒有建立的時候，在短時間內很多 PR 都有更新，這時這些 PR 產生 base coverage report 的 job 都會被觸發，不過這些 job 都是重工。

## 小結

上面這些弄完也差不多到了下一次 1 on 1，lead 對著上個月的 memo 說：「這次你算是有達成一些東西了，雖然和我預想的解法不太一樣。」說話的同時 lead 點開 [swc](https://swc.rs) 的網站。「你知道這個嗎？」

我回答：「這個我知道，但是我那個時候並沒有想到這個解法，同時也沒有意識到有這個進路可以想。」

lead 的思路是 jest 原本是用 babel 作語法轉換，而 babel 已經知道有效能問題，swc 則是這個效能問題的一個解決方法。這個解法能達到的[效果](https://www.jameslmilner.com/posts/speeding-up-typescript-jest-tests/)應該會比我的好，而且是更大範圍更根本的解決方法。

而我沒有意識到主要是因為我其實對於 jest 的底層實作不熟悉，我只能從我知道的工具下手。lead 對於我使用不同的進路表示這就是軟體工程，同樣的目標可以用不同的方式達成。

接著 lead 把 swc 放進這次的 memo，我大概知道我之後要做什麼事情了。
