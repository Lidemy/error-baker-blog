---
title: 在 AWS EB 上部署 Nodejs 網站的入門指南
date: 2021-10-05
tags: [back-end,nodejs,AWS]
author: sixwings
layout: layouts/post.njk
---

<!-- summary -->
<!-- 在 Heroku 上部署網站是一個愉快的體驗，但在 AWS 上面要怎樣使用類似的服務呢？ -->
<!-- summary -->
<!-- more -->

# 前言

這篇文章希望能夠以新手視角，大概說明怎麼在 AWS EB 上部署 Node.js 網站。AWS 包山包海的服務對於一開始接觸的人來說真的太多太複雜了，當初看 AWS 官方文件也覺得有段距離，是在自己實作、啃文件的過程慢慢理解到底這些東西在做什麼，所以想把這過程整理成一份入門指南。

# 先直接來

假設你已經註冊好 AWS 帳號，點下 [Elastic Beanstalk 管理主控台](https://ap-southeast-1.console.aws.amazon.com/elasticbeanstalk/home?region=ap-southeast-1#/welcome) ，右上角可以選擇你想要把主機放在哪個區域，因為主機建立之後是不可以改區域的，先確認好自己想要的區域然後點選新增應用程式

![選擇主機所在的區域](/img/posts/sixwings/aws-eb-setup/f1.png "選擇主機所在的區域")

![建立 Web 應用程式](/img/posts/sixwings/aws-eb-setup/f2.png "建立 Web 應用程式")

**應用程式標籤** 暫時用不到可以先忽略，然後程式碼也可以先用範例程式碼，要用自己的專案程式碼需要先壓縮打包才能上傳。

![建立應用程式](/img/posts/sixwings/aws-eb-setup/f3.png "建立應用程式")

等幾分鐘，環境建立好後應該會看到下面這個畫面

![自動建立環境](/img/posts/sixwings/aws-eb-setup/f4.png "自動建立環境")

![應用程式環境](/img/posts/sixwings/aws-eb-setup/f5.png "應用程式環境")

這時候就可以把你的 Nodejs 程式專案打包上傳部署
如果你是用 git 做版本控管的話，有一個方便的打包指令可以用

`git archive -o path-to-file/app.zip HEAD`

上傳檔案後，會進入部署過程，等待幾分鐘之後迎接你的會是這個畫面

![部署失敗](/img/posts/sixwings/aws-eb-setup/f6.png "部署失敗")

這時候就需要檢查一下發生什麼問題了

![查詢日誌](/img/posts/sixwings/aws-eb-setup/f7.png "查詢日誌")

一般點選右邊的「請求日誌▼」，點「下 100 行」，過一陣子會顯示可以下載的日誌檔案，然後就可以看看發生什麼錯誤。一開始對設定還不熟常常需要在這邊尋找線索。

# 調整細部設定

基本上這邊的過程就是遇到什麼錯誤就調整什麼，雖然方法很笨，但過程中也會比較知道到底整個部署過程經歷了哪些環節？下面列出我在部署時候遇到的幾個錯誤：

## Start script missing error when running npm start

這個錯誤是說你沒有在 package.json 的 scripts 裡面設定 start 對應的指令，因為部署完之後程式會主動呼叫 `npm start` 讓伺服器開始跑起來。

```json
{
  ...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js"
  },
  ...
}
```

## ERROR: connect ECONNREFUSED 127.0.0.1:3306

沒有設定好資料庫，這時候要到左側的環境點選組態，然後設定資料庫。捲到畫面最底下會看到資料庫，點選 **編輯**。

![環境>組態](/img/posts/sixwings/aws-eb-setup/f8.png "環境>組態")

設定好自己的資料庫平台，按下**套用**後是一段漫長的等待，建置資料庫通常都蠻久的，大概 10 ~ 15 分鐘，建議先仔細檢查設定有沒有寫錯的地方，不然要更改的話又要再等很久。

參考文件:
- [將資料庫新增至您的 Elastic Beanstalk 環境 - AWS Elastic Beanstalk](https://docs.aws.amazon.com/zh_tw/elasticbeanstalk/latest/dg/using-features.managing.db.html)
- [將 Amazon RDS 資料庫執行個體新增到您的 Node.js 應用程式環境 - AWS Elastic Beanstalk](https://docs.aws.amazon.com/zh_tw/elasticbeanstalk/latest/dg/create-deploy-nodejs.rds.html#nodejs-rds-connect)

## 無法透過 AWS EB cli 下指令 sequelize db:migrate

使用 heroku cli 的時候，我們可以透過 `heroku run <command>` 的方式去執行已經定義在 package.json scripts 裡面的指令。但 AWS EB cli 還沒有這種功能，也有可能我還沒找到之類的。但這個動作還蠻重要的，後來查了一下 npm script 的[說明文件](https://docs.npmjs.com/cli/v7/using-npm/scripts "scripts | npm Docs")

之後改成這樣

```json
{
  ...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "prestart": "npx sequelize-cli db:migrate && npx sequelize-cli db:seed:undo:all && npx sequelize-cli db:seed:all",
    "start": "node index.js"
  },
  ...
}
```

在 npm run start 之前，先跑 db:migrate 的指令，問題才算解決。
另外 db:seed:all 的指令沒辦法連續執行，所以折衷的作法是每次開始前清掉全部的 seed，然後再執行 db:seed:all。

## 讓 sequelize 的設定可以使用環境變數

參考官方文件的 [Dynamic Configuration](https://sequelize.org/v5/manual/migrations.html#using-environment-variables) 和 [Using Environment Variables](https://sequelize.org/v5/manual/migrations.html#using-environment-variables) 這兩個章節的說明完成。

AWS EB 主控台設定環境變數的地方放在一個不是很好找的地方，看了
[官方文件](https://docs.aws.amazon.com/zh_tw/elasticbeanstalk/latest/dg/environments-cfg-softwaresettings.html#environments-cfg-softwaresettings-console "環境屬性與其他軟體設定 - AWS Elastic Beanstalk") 才知道是在組態中的**軟體**類別最底下才找到。

如果想要透過 AWS EB cli 設定的話，指令是 `eb setenv <ENV_VAR_NAME>=<VALUE> <ENV_VAR_NAME>=<VALUE> <ENV_VAR_NAME>=<VALUE> ...`，詳細用法可參考[官方文件](https://docs.aws.amazon.com/zh_tw/elasticbeanstalk/latest/dg/eb3-setenv.html "eb setenv - AWS Elastic Beanstalk")

# 其他議題

## AWS EB cli

對整個 AWS EB 的操作大概熟悉之後，這邊就可以開始學習用 [AWS EB cli](https://docs.aws.amazon.com/zh_tw/elasticbeanstalk/latest/dg/eb-cli3-install.html) 了，主要是之後靠打指令部署程式碼還是比較便利。第一次用 cli 的時候 EB 會提示你要先[建立一個帳戶金鑰](https://docs.aws.amazon.com/zh_tw/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)，之後這筆金鑰會存在 `C:\Users\USERNAME\.aws\config` 底下，以後下指令的時候就是依靠這裏面的金鑰做身分識別。

常用指令:
`eb creat` 建立應用程式環境
`eb init` 初始化相關設定
`eb deploy` 把目前的專案部署到 AWS EB
`eb open` 打開網站
`eb logs` 檢查日誌

## 要如何透過 SSH 連線到 AWS EB 的 EC2 執行實體？

可以先參考這兩篇官方文件教學進行設定
- [使用 SSH 連線至您的 Linux 執行個體 - Amazon Elastic Compute Cloud](https://docs.aws.amazon.com/zh_tw/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html)
- [eb ssh - AWS Elastic Beanstalk](https://docs.aws.amazon.com/zh_tw/elasticbeanstalk/latest/dg/eb3-ssh.html)

AWS EB 會幫我們建立一個 EC2 的執行實體，我們需要有 EC2 金鑰對才可以透過 SSH 連線到執行實體。但是一開始在主控台建置應用程式的時候並沒有提示我們設定這個部分，事後要修改的話，一樣也是要透過修改組態的方式，但是修改組態之後又要等待一段漫長的時間。

但問題是用 AWS EB cli `eb inti  --interactive` 的方式建置應用程式環境的時候，又會遇到 win10 跳錯誤提示說 SSH 沒安裝之類的問題，也如同 [eb init](https://docs.aws.amazon.com/zh_tw/elasticbeanstalk/latest/dg/eb3-init.html) 說明的那樣，確認過自己電腦可以執行 `ssh-keygen` 但仍然一直鬼打牆無法順利執行 `eb init`。假如真的還是不行的話，可以用預先建立在 `C:\Users\USERNAME\.ssh\` 底下的金鑰對，或是在[主控台](https://ap-southeast-1.console.aws.amazon.com/ec2/v2/home?region=ap-southeast-1#KeyPairs:) 產生金鑰對，然後再去修改組態更新。

確認[自己的金鑰是不是跟上面的一致](https://docs.aws.amazon.com/zh_tw/AWSEC2/latest/UserGuide/ec2-key-pairs.html#verify-key-pair-fingerprints)？

![組態>安全](/img/posts/sixwings/aws-eb-setup/f9.png "組態>安全")

`eb ssh <app-env-name>`

## 要如何透過 Workbench 連線到 AWS EB 的 RDS 資料庫？

最關鍵的點是需要幫 RDS 的執行實體增加一個新的安全群組，然後編輯傳入規則。
![編輯傳入規則](/img/posts/sixwings/aws-eb-setup/f10.png "編輯傳入規則")

**連線與安全性** 裡面的 **可公開存取** 要設定「是」
![確認可否公開存取](/img/posts/sixwings/aws-eb-setup/f11.png "確認可否公開存取")

如果無法連線請參考以下兩篇文件排除問題
- [解決連線至 Amazon RDS 資料庫執行個體時發生的問題](https://aws.amazon.com/tw/premiumsupport/knowledge-center/rds-cannot-connect/)
- [Amazon RDS 故障診斷 - Amazon Relational Database Service](https://docs.aws.amazon.com/zh_tw/AmazonRDS/latest/UserGuide/CHAP_Troubleshooting.html#CHAP_Troubleshooting.Connecting)

## 設定 https

參考文件
- [為您的 Elastic Beanstalk 環境設定 HTTPS - AWS Elastic Beanstalk](https://docs.aws.amazon.com/zh_tw/elasticbeanstalk/latest/dg/configuring-https.html)
- [設定您 Elastic Beanstalk 環境的負載平衡器來實現 HTTPS - AWS Elastic Beanstalk](https://docs.aws.amazon.com/zh_tw/elasticbeanstalk/latest/dg/configuring-https-elb.html)
  官方說這是最容易實現的，但有些應用程式環境沒有提供負載平衡器，需要[重新設定環境](https://docs.aws.amazon.com/zh_tw/elasticbeanstalk/latest/dg/using-features-managing-env-types.html#using-features.managing.changetype)。
- [在執行 Node.js 的 EC2 執行個體上實現 HTTPS - AWS Elastic Beanstalk](https://docs.aws.amazon.com/zh_tw/elasticbeanstalk/latest/dg/https-singleinstance-nodejs.html)

建議一起設定
- [將 HTTP 設定為 HTTPS 重新導向 - AWS Elastic Beanstalk](https://docs.aws.amazon.com/zh_tw/elasticbeanstalk/latest/dg/configuring-https-httpredirect.html)
  這個請注意自己的環境上有沒有 Application Load Balancer 再使用裡面的 [https-redirect](https://github.com/awsdocs/elastic-beanstalk-samples/tree/master/configuration-files/aws-provided/security-configuration/https-redirect) ，然後用錯可能整個環境會爆炸而且修不回來。 **強烈建議: 對 nginx 的設定熟悉才使用裡面的檔案**
- [將私有金鑰安全地儲存於 Amazon S3 中 - AWS Elastic Beanstalk](https://docs.aws.amazon.com/zh_tw/elasticbeanstalk/latest/dg/https-storingprivatekeys.html)
  注意 S3 要關閉所有公開存取，不然還是會有問題

![封鎖公有存取權](/img/posts/sixwings/aws-eb-setup/f12.png "封鎖公有存取權")

以上這邊主要是用 nginx 設定，如果是採用 apache 的話，可以再查其他文件教學

# 結語

因為用了 AWS EB 的關係，對整個 AWS 服務的生態系終於有比較了解的感覺。 EC2 是虛擬主機、RDS 是虛擬資料庫，S3 是永久儲存服務。中間因為搞不太懂 VPC 的概念，也順便惡補了一下相關知識。經過這次 EB 部署經驗，有比較了解系統是怎麼運作和維護的，也感受到一個龐大系統如果沒依靠一些自動化工具輔助管理，真的會維護的很辛苦。


我是 sixwings，善於挖坑的程式人，我們下次見！