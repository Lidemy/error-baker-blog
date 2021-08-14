---
title: 從本地到雲端，淺談部署和各種部署姿勢
date: 2021-08-12
tags: [deploy]
author: Lavi
layout: layouts/post.njk
---

## Deploy 是什麼

<!-- summary -->
如果拿 Server 來舉例（本篇主要講的內容也是指 server）， server 基本上就是一個程式，而這個程式運行之後其他人就可以透過網路連線到 Server 來拿資料。而 Deploy，也就是部署，可以視為將已經寫好的程式使其運行的過程。

<!-- summary -->
<!-- more -->

可以這樣想，你今天在工廠製造了一台飲料販賣機，把這台販賣機搬到它應該被使用的位置，可能是籃球場旁邊，或者是河濱公園。但你的任務並不只是把它搬過去而已，所以你可能還要找電源幫它插電，甚至第一次還會需要幫它補充飲料，做一些設定等等。這些流程都在部署的範圍。

但是在軟體上面的部署不用插電，而是需要設定我們使用的電腦，像是安裝作業意系統等，並且在電腦上處理好執行軟體需要的一些設定、或者是執行環境，最後在電腦上執行自己開發的程式。


## 部署方式的影響
延續剛剛的比喻，你的飲料販賣機可能以不同的方式供電，`220V` 或者是 `110V`，甚至也可能可以吃直流電（比喻），但這些都不影響販賣機的功能還有提供的服務。不過不同的供電方式可能會帶來不同的優缺點像是攜帶性、經濟性等等。部署也一樣，不同的方式帶來的差異並不會影響 Server 的功能，但會影響到的會是：

- 你的荷包或者說你老闆的荷包
- 可擴充性
- 部署的複雜度
- 穩定度
- 還有很多很多...

而這些就是在選擇部署方式時需要去做的 Trade-off。那下面會簡單的介紹不同部署方式的一些特性，以及提一下有哪些產品屬於這些方式。

## 各種不同的部署方式

### 本地

簡單說就是部署在你自己的電腦，一台真正你看得到、摸的到，還要幫它插電插網路線的電腦。當然現在已經比較少人這麼幹，大家都丟在各種雲端服務上面，但這麼 old school 的方式還是有他永遠無法取代的特點。

> 你擁有自己的程式，而不是掌控在別人的手上

把自己的東西緊握在手中，難道不是一種浪漫嗎？

當然，浪漫要付出的代價可不小，得處理很多問題：像最初需要面臨的就是固定 IP、找個不會被踢到的地方放你的電腦、穩定的供電來源等等。其實如果能解決，部署一些小型的服務像 Blog 等並不是太差的選擇，而且還可以真正的去學習如何去設定 Linux、安裝環境等。

但如果你只是想要簡單弄一個部落格，甚至是有商業上的需求，這已經不是推薦的作法了。畢竟雲端部署已經方便的太多。

### 雲端主機

這就是很常聽到的 IaaS （Infrastructure as a Service，基礎建設即服務），基本上就是租電腦。你不用真正買一台電腦，選好自己需要的規格，像是 CPU 的核心數、記憶體的容量、硬碟的容量等，就能夠建立 instance（instance 就是我們租的電腦）。就像自己的電腦一樣，可以讓 server、資料庫或者是任何的程式在上面運行，雲端有很多好處：

1. 方便，你不用插電。辦個會員填個信用卡資料就好
2. 可靠性，你不會踢到插頭或者是機櫃
3. 便宜，同樣規格的主機你自己買起來至少也要破千
4. 彈性，想關就關、想擴充就擴充
5. 幫你弄好固定 IP，甚至還有 https

而雲端主機的服務有：
- AWS 的 EC2（Amazon Elastic Compute Cloud）
- Google 的 Compute engine
- Azure Virtual Machined
- DigitalOcean Droplets
- Linode  

當然還有很多很多，族繁不及備載。

雲端主機就像自己的電腦一樣。大部份的雲端主機都是會安裝好 OS 的，使用者可以透過 ssh 連線到 instance，然後使用 CLI 介面操作，來設定對應的執行環境，例如 node 等等。如果是當作網站的 Server 使用的話，還會需要設定像是防火牆，網路連線等等的東西才能夠讓外部網路連線雲端主機。然而這些設定並不容易，尤其是對於 Linux 生態不熟悉的使用者來說。

除此之外，擴展性也是個問題，畢竟這就是一台電腦，就像如果你想要幫你的電腦換 CPU 或者是更大的 RAM，你就必須把主機關機，而雲端主機同樣的也需要主動的 terminate instance（終止實例，就是電腦關機），而關機就代表著無法提供 Server 的服務。（當然，可以透過多台電腦維持服務不中斷，不過不是這裡討論的範疇。）

IaaS 雲端主機可以說是其他部署服務的基礎。在 IaaS 的基礎上，服務幫你多做一些事情，而想要建立下一個 Facebook 的你就可以少做一些事情，還能夠有更高的擴展性、更方便的佈署方式。這就是接下來的其他服務。

![Azure 的雲端服務類型](https://azurecomcdn.azureedge.net/cvt-665f0680393306b6d0a912671748e5cca6b061d55ecee48d4f985eaa8e15e6bf/images/page/overview/what-is-iaas/iaas-paas-saas.png)

### PaaS

PaaS，Platform as a Service，平台即服務。設定環境真的很麻煩，我們都懂。有沒有一個地方能夠只讓我丟上去程式碼就可以執行，減少設定環境方面等等的事情？

在 PaaS 服務裡面你不會需要親自去下載那些環境（例如 node），透過描述檔的方式來設定，而 PaaS 的服務就會依照你的描述檔幫你安裝環境，處理前面提到的網路連線等等的問題，並自動部署運行在前面提到的雲端主機上。

環境的描述檔就像是這樣：
```yaml
# [START django_app]
runtime: python37

handlers:
# This configures Google App Engine to serve the files in the app's static
# directory.
- url: /static
  static_dir: static/

# This handler routes all requests not caught above to your main app. It is
# required when static routes are defined, but can be omitted (along with
# the entire handlers section) when there are no static files defined.
- url: /.*
  script: auto
# [END django_app]
```

此外因為服務會自動幫你執行，所以能夠作到自動擴展。在你的 Server 需要的記憶體不夠時，能夠從 2G 自動升級 4G，在過剩時又能夠降回 2G。可以作到以時間，甚至流量為分割粒度來設定需求。

總而言之，你只是把你的程式「部署」（某方面來說，甚至可以看做是簡單的「上傳」）到服務上，並寫好環境的描述檔，服務就會幫你處理好一切，Magic～

而這類型的服務有：
- GCP App engine
- AWS Elastic Beanstalk
- Azure App Service
- Heroku
- Vercel
- 還有很多很多...

但這種很方便的東西一定是有 trade-off 的，一個是這樣的服務能提供的環境類型有限，如果有一位大神用 C++ 寫 Server，那這樣冷門的環境服務就大部分沒辦法提供，再來環境類型有限也意味著控制程度有限，沒辦法作到更詳細的設定。

面對這樣的問題，容器化技術（Containerization）正好可以解決這樣的問題，而目前最知名的就是大名鼎鼎的 Docker。那什麼是 Docker 呢？

#### 容器化技術與 Docker

在過去，想要開一家餐廳就必須租一間店面、牽水電、弄灶台流理台櫃台、放置座椅等等。而如果我們的店要搬遷絕對是非常麻煩的事情，光設備就很有可能一台卡車搬不完了，更何況到新的店面還是需要牽水電、佈置電燈之類的。

但如果只是要開一家小店，可能不用那麼累？我們都看過在路邊賣著漢堡而且讓你流口水的美式餐車，餐車可以使用發電機、攜帶水箱，還有使用攜帶式的爐灶。重點是，這些東西都被放在一台可愛的小卡車上，想去哪裡開店，就去哪裡開店。

Docker 也是一樣的道理。我們可以把部署所需要的程式碼以及對應的環境，包含作業系統（ubuntu、Debian、Arch ...）、語言的執行環境（Node...）等等。通通包在一起丟到一個容器裡面，就像餐車把需要的設備通通放在卡車上一樣。有了這個容器，我們就不需要再設定環境了，想去哪台 server ，直接執行包好的容器就 OK 。

這個概念特別適合 PaaS 的服務，原本 PaaS 只能提供特定環境，但有了 Docker，就可以脫離服務的限制，隨心所欲的將自己需要的環境包進 Docker，就能作到想幹嘛就幹嘛。

大部分 PaaS 服務也除了內建的環境以外，都會提供使用 Docker 來作到更彈性的設定，像 GCP App engine 就可以使用下面的設定來使用 Docker。

```yaml
runtime: flex
```

而 AWS 的 Elastic Beanstalk 也能夠設定[使用 Docker Image 來部署](https://docs.aws.amazon.com/zh_tw/elasticbeanstalk/latest/dg/create_deploy_docker.html)，如果想要更精準的控制容器像是停止、啟動等等，則可以使用 [Elastic Container Service](https://aws.amazon.com/tw/ecs/faqs/)。

#### Kubernetes

Kubernetes，唸作哭ㄅ捏題絲，簡稱 K8s。講到 Docker 就會有人提到 K8s，然後就會有人說：

> You don't F**kin need Kubernetes

沒有很了解說具體 K8s 能作到哪些，但簡單可以想像成管理多個 Docker 的工具。各大廠也提供了服務，能夠執行 K8s 的 CaaS（Container as a Service）服務。像是：

- Google Kubernetes Engine
- Amazon Elastic Kubernetes Service
- Azure Kubernetes

### FaaS

PaaS 還是有他的問題在。過去我們使用 Server 會讓 Server 運行，等待 Request 後再回傳 Response。但在沒有接收到 Request 時，就 Server 只是待命而已，並沒有實際的使用。但主機的錢還是照樣計算，要知道在雲端上，每一秒都是錢阿！

於是就有了 FaaS （Function as a Service）的出現。這樣的服務同樣幫你做好環境了，也同樣只需要上傳程式碼。但不同的是，Function 並不是常時運行的。Function 能夠依照特定的事件（像是定時、或者是 Request 等）來去執行你設定好的程式。

這樣的模式已經離和我們過去的方式大不相同了。過去我們有點像我們開一台機器持續的運轉，已經開好了，等待需要來就立即運作並提供需要的服務。而 FaaS 的方式就像每次需要的時候再開啟機器。這樣還是沒概念的話，平常使用的飲水機先把熱水燒好並且持續保溫，有需要就按下按鍵自動出水。但有一種瞬熱式飲水機，在有需要用熱水的時候才會瞬間加熱，並沒有常時的在保溫。

這樣的模式會帶來什麼樣好處？

- 相對便宜，畢竟有需要才會使用，執行的時間減少了。

不過相對的也會帶來問題。每次都重新執行

- 不適用於需要持久性連結的協議，例如 websocket
- 每次的 function 之間是無狀態的，執行時的狀態（或者說資料）若不另外儲存，無法讓下一次的執行使用。
- Cold start：服務會有很高的延遲，因為每次執行時都是從頭開始執行，重新執行程式碼。
- 畢竟是服務幫你設置環境的，所以控制權較低...？等等！

環境控制權的問題有點既視感，沒錯，在 PaaS 也有同樣的問題，但這樣的問題也一樣能夠透過 Docker 來解決。

這類型的服務有
- GCP cloud functions/ cloud run
- AWS Lambda / AWS Fargate
- Azure Functions Serverless Compute

## 結語

這些不同的部署方式絕對不是越後面就越潮，什麼東西都用最潮 FaaS 服務來做絕對會非常痛苦（甚至根本做不出來）。在技術上的選用永遠是老話一句：選擇自己需求來決定說要使用哪些技術。

消毒一下，這篇文章的解釋非常粗淺，要是希望用比較好懂的方式來解釋各種不同的部署方式還有雲端服務。還有舉例部份，並不代表完全列出該類型的服務，像是 FaaS 可能在 AWS 上不只有 Lambda 和 Fargate 這兩個服務，畢竟每家公司的產品五花八門，自己也沒有全盤的了解，沒辦法全部列出。

如果解釋上有任何的問題，或者是舉例的錯誤也歡迎指出，會盡速做修改！感謝打給的收看～

參考資料：

- [7 Ways to Deploy a Node.js App](https://www.youtube.com/watch?v=uEVmD6n8Il0&t=1s)：簡單易懂解釋不同的 Deploy 方式
- [Compare AWS and Azure services to Google Cloud](https://cloud.google.com/free/docs/aws-azure-gcp-service-comparison)
- [带您玩转Lambda，轻松构建Serverless后台！](https://aws.amazon.com/cn/blogs/china/lambda-serverless/)
- [雲端計算 IaaS、PaaS、SaaS 與 FaaS](https://cynthiachuang.github.io/Difference-between-IaaS-PaaS-SaaS-and-FaaS/)
- [何謂 PaaS？](https://azure.microsoft.com/zh-tw/overview/what-is-paas/)