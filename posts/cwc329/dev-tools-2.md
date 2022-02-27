---
title: 優化舊有專案（二）：加入 CI/CD with github actions
date: 2022-02-27
tags: [back-end, 'CI/CD', 'github actions', heroku]
author: cwc329
layout: layouts/post.njk
---

<!-- summary -->

擺在我心中好久的計畫總算付諸行動，以往這個專案的部署都是我手動部署。
這次是要將舊的專案加上 CI/CD，從而減少我的工作量，達成我的懶人願望。

<!-- summary -->

# 使用的專案 - Podcastify

我使用的是我在 Lidemy 的期末專案，這是我與 [Kuan Yu](https://github.com/Yu040419) 以及 [Sophie Chang](https://github.com/sophiebetough) 一同合作開發。

[專案原始碼](https://github.com/Podcastify/Podcastify)

這篇文章會以建構簡單的 CI/CD 為主，
前端會使用 github page，而後端則是部署在 heroku 上。

## 帳戶搬遷以及部署環境變更

### Github
原本這個專案的原始碼都是放在我的 github 帳戶下面，不過這就有個問題了。

因為這個 github 帳戶是我自己的東西，當初因為是期末專案，而且最初後端以及環境設定幾乎都是我在處理，所以想說先暫時放在我底下。然而隨著時間過去，目前我們又想要重啟這個專案，我覺得繼續放在我的 github 帳戶下面不是辦法。

首先，因為這個帳戶是我的，也就是我其實擁有這個專案的生殺大權，而其他組員則無。如果今天我想要把整個專案刪掉，其餘組員也無從阻止。我們三個是這個專案的共同創作及擁有者，不應該只有我有這個專案的最高權限。

再者，假設這個專案需要與其他的服務作串接（比如我這次要使用 heroku），因為很多服務都有免費的額度，假設我自己也想要使用，但是卻因為這個專案吃掉我的額度，這對我以及專案都事件麻煩的事情。

基於以上兩點，我們討論後決定創一個專案的帳號，日常的開發及維護都是使用自己的帳號作為協作者。

### Deploy
這方面有兩個問題：domain 以及部署方案。

這個專案原本是部署在我的 AWS EC2 上，然而我的免費額度已經用完了，我目前也沒有打算要使用。 如果使用我自己的信用卡或者帳戶，分擔費用這點對我們來說有點麻煩。還有原本的網域名稱因為忘記續約已經被搶佔了。所以新的方案我們想要一次解決這兩個問題。

最後我們決定把前端頁面部署在 github pages，而後端的 API 則部署在 heroku 上。原本會這樣決定是因為我覺得 heroku 好像網址都會是亂數，而 github pages 則會是我們的專案名稱。如果把前端架在 heroku 上會無法有個有辨識度的網址 [^1]，這樣對於一個公開網頁來說不是好事。還有，我在上網查如何部署 heroku 時，發現要在一個 repo 下設定部署多個 app 有點複雜，因為有時程關係，這邊首要目的就是在短時間內把整個服務部署到網路上，所以我最後才提案這樣的配置。

## CI/CD

這邊先簡單說明一下 CI/CD。從 [wiki](https://en.wikipedia.org/wiki/CI/CD) 的定義，CI/CD 是指 continuous integration 以及 continuous delivery/deploy，這是連結開發以及維運部門的橋樑。軟體開發上流程大致上為：

```
開發 → 測試 → 封裝 → 部署 → 監控 → 開發 → ...
```

這樣的循環，CI/CD 重要的是 continuous 這一點，因為這些流程基本上都是不斷重複的，要如何能做到這整個流程非常地順暢，不被延誤。如果可以做到這點，就能在部署前提早發現問題，或者可以在產品上線之後盡快發現問題，將會對產品有重大的幫助。

自動化佈署其實只是完成 CI/CD 其中一項工作，之後還有監控、回報問題等動作要處理。不過這些動作基本上如果有用其它現成的方案都是包含在裡面的，像是 github actions 以及 heroku 都有自己的 CI/CD 服務，裡面也都會有各種設置可以讓使用者查看、搜尋 log 或者設定錯誤回報等等。

***以下是我個人的意見***：因為這些服務基本上只要把部署整合進去之後，就可以輕鬆的設定測試、監控等其他服務，所以現在大部分的 CI/CD 教學或者心得大部分都會聚焦在如何把自動化部署完成，因為只要能夠完成自動化部署的設定，剩下的只要知道如何使用服務即可。

### Github Actions & Github Pages

github actions 是 github 推出的 CI/CD 工具，透過 workflows 可以在 github repo 有異動的時候觸發特定的工作，例如自動測試、上標籤、打包映像檔以及部署等等。

使用者可以用 yaml 檔案去定義一個 workflow，包括這個 workflow 的名字、什麼條件會被執行、執行時的環境變數等。

而一個 workflow 中可以執行多的 actions，這些 actions 可以定義在同一個 repo 中，也可以使用自己其他 repo 的 actions，更可以使用其他人或者 github 官方打包好的 actions。

這次的前端部署我使用 github action [^2]，其實很簡單，我在裡面用了兩個 actions，一個是 github 的 [checkout](https://github.com/actions/checkout)，這個 actions 可以讓使用者在 workflow 中使用 github 上的專案原始碼。因為 github actions 是 launch 一台虛擬機執行程序，但是這台虛擬機不會有專案的原始碼，所以要使用這個去拿到原始碼。

我使用的第二個 actions 是 [peaceiris/actions-gh-pages@v3](https://github.com/peaceiris/actions-gh-pages)，這是一個第三方提供的 github pages 部署 actions，只要使用 github token，並且指定好 source branch 以及要部署到哪個 branch，就可以執行。

因為專案資料夾結構的關係，我在 yaml 中定義只有在 `ui/` 下面的 `*.js` 檔案有變化的時候才會執行部署 github pages。

### Heroku

後端我選擇部署在 heroku 上，這部分的設定就比較簡單了。

首先我參考 Lidemy 的 [heroku 教學](https://lidemy.com/courses/390625/lectures/24510403) 以及 [How to deploy a monorepo to multiple Heroku apps using GitHub Actions](https://blog.softup.co/how-to-deploy-a-monorepo-to-multiple-heroku-apps-using-github-actions/)，將我的 app 設定為部署 `api/` 底下的檔案。接著參照 Lidemy 的 [clearDB 教學](https://lidemy.com/courses/390625/lectures/24510404) 設定好我的 heroku app 環境變數，成功連結到資料庫。

不過最後我遇到一些小問題，我的 app 一直遇到 
```
Error: listen EACCES 0.0.0.0:80
```
我後來 google 到[這篇](https://stackoverflow.com/questions/52992258/nodejs-express-on-heroku-app-eacces-0-0-0-080)，原來是因為 heroku 在部署環境動態指定某個 port，所以如果自己指定 port 的話會有問題。於是我修改了一下原始碼就沒有問題了。

現在我只要更新 master 的 code，就會自動觸發部署 heroku。不過這邊還是有可以優化的空間，因為如果我的改動是 ui 的話，因為 master 上還是有變動，所以依舊會觸發 heroku 的自動部署，這邊應該要改成只有 api 有變動的時候再自動部署會比較好。

## 結論

在這一篇文章中，除了講解技術我也嘗試把為何選擇這些技術的原因寫出來。我自己工作一年的心得，有些大家公認的優良開發習慣或者規範，像是 TDD、clean code 等，又或者一些很厲害的技術，像是我自己這一整年都在學的 k8s，確實這些技術與規範可以為公司帶來成效，不過這也取決於公司目前狀況。假設公司目前只是要部署一個靜態的形象網站，上線之後基本上不會有大流量，即便斷線也不會造成鉅額損失，那個引入 k8s 感覺就有點多餘。同樣的，假設今天公司需要的是一個 MVP (minimum viable product)，可能要趕在一季甚至一個月內上線，而且不保證之後這個產品會持續發展，那麼堅持 clean code 而讓開發時程變長一兩倍可能就不是個好想法。這邊推薦最近 Dan 大的文章 [Goodbye, Clean Code](https://overreacted.io/goodbye-clean-code/)，我也沒有說這些技術或者規範都不用遵守，不過凡事都有其代價，要如何拿捏 trade off 我覺得是我這一年工作下來的一點小體悟，在這邊跟大家分享。

## 註腳

[^1]: 其實 heroku 是可以自訂 herokuapp.com 的 subdomain，也可以綁定其他 domain 在 app 上。

[^2]: [我的 deploy-ui workflow yaml 檔](https://github.com/Podcastify/Podcastify/blob/master/.github/workflows/deploy-ui.yaml)
