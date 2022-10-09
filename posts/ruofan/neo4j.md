---
title: At a glance of Noe4j
date: 2022-10-09
tags: [back-end]
author: Ruofan
layout: layouts/post.njk
---


<!-- summary -->
Hi 大家好！ 前陣子到了新環境花了些時間適應，日常的學習是時候推進了。這篇文章會以 Neo4j 為例和大家分享什麼是 graph DB。



<!-- summary -->

<!-- more -->

>以下是這篇文章會談到的內容
[No sql overview](#no-sql-overview)
[Graph database](#graph-database)
[Neo4j](#neo4j)


## No sql overview

在談什麼是 graph DB 之前，先帶大家總覽不同類型的 database，有別於一般常見的關聯式資料庫，NoSQL (Not Only SQL) 依據不同的資料儲存型態又可細分為下方圖中的幾種類型。

![](/img/posts/ruofan/sql-no-sql.png)

## 什麼是 Graph ?

從歷史上最早可以追朔到數學家 Leonhard Euler 為了求證 Seven Bridges of Königsberg 問題後來發展成為了數學中的 graph theory。

![](/img/posts/ruofan/Konigsberg_bridges.png)

圖片資料來源：[Seven Bridges of Königsberg](https://en.wikipedia.org/wiki/Seven_Bridges_of_K%C3%B6nigsberg)

## Graph 應用場景 ？

先來釐清什麼樣的場景與需求適合使用 graph ？ 這邊舉出兩種情境分享給讀者。

情境一：商品推薦系統的應用。在顧客的購物品項數據中分析出購物模式相似的族群，以下方圖示為例在商品推薦系統上可以推薦 Jennie 一些 Lisa 曾經買過的品項。

![](/img/posts/ruofan/scenario-1-neo4j.png)

情境二：推薦路線系統的應用。在使用者的所在地與目的地中基於使用者選擇的偏好，舉例來說像是最佳路線, 轉乘次數最少等，推薦交通路線給使用者。

![](/img/posts/ruofan/scenario-2-neo4j.png)

## Graph database

在 graph database 中一個實體可以被當作一個 node，我們可以定義 node 的屬性, 分類, 標籤與關聯，以下圖示為例。

![](/img/posts/ruofan/node-graph.png)

## 如何在 graph database 中使用 query ？

這邊先帶大家認識 Cypher (query language)，下方是 [wikipedia](https://en.wikipedia.org/wiki/Cypher_(query_language)#:~:text=Cypher%20is%20a%20declarative%20graph,formerly%20Neo%20Technology) 中的介紹：

>Cypher is a declarative graph query language that allows for expressive and efficient data querying in a property graph.

```nosql
# 以下方 query 為例可以看到這邊寫了一個 query 去取得在 2005年之後發行的所有電影。
Match (m:Movie) where m.released > 2005 RETURN m

# Create unique node property constraints to ensure that property values are unique for all nodes with a specific label. Adding the unique constraint, implicitly adds an index on that property.
CREATE CONSTRAINT ON (n:Movie) ASSERT (n.title) IS UNIQUE
```


## Neo4j

下方是 [官方文件](https://neo4j.com/) 中的介紹：

>Neo4j is an open-source, NoSQL, native graph database that provides an ACID-compliant transactional backend for your applications that has been publicly available since 2007

## 一般 sql 跟 neo4j 的差別在哪 ?

從下方 query 與 圖示可以看到在 neo4j 中我們不需要特別定義 foreign key 或是 join tables 而是透過 index 快速找到 node 之間的關聯。

![](/img/posts/ruofan/relational-graph.png)

![](/img/posts/ruofan/sql-cypher.png)

圖片資料來源：[Intro to Cypher for the SQL Developer](https://www.youtube.com/watch?v=RIWuA_K7_GY)

## 哪些資料不適合使用 neo4j 儲存？

圖檔和影片檔 neo4j 官方建議處存在 aws s3，建議 node 儲存 s3 的 url 就好。


## 總結

閱讀文獻的過程中花了許多時間在理解 pwa 以及 service worker，整體來說蠻有趣的！
在閱讀文章時如果有遇到什麼問題，或是有什麼建議，都歡迎留言告訴我，謝謝。😃

## 參考資料
- [Youtube | Introduction to Neo4j - a hands-on crash course](https://www.youtube.com/watch?v=ou2st6FYxR8)
- [Podcast | Supper Club × Adam Cowley and Neo4j Database](https://syntax.fm/show/487/supper-club-adam-cowley-and-neo4j-database#t=04:54)
- [Youtube | Seven Bridges of Königsberg](https://www.youtube.com/watch?v=nZwSo4vfw6c)
- [wikipedia | Seven Bridges of Königsberg](https://en.wikipedia.org/wiki/Seven_Bridges_of_K%C3%B6nigsberg)
- [neo4j | Video and Photo Data Modeling](https://community.neo4j.com/t5/neo4j-graph-platform/video-and-photo-data-modeling/m-p/21282)
- [Youtube | Intro to Cypher for the SQL Developer](https://www.youtube.com/watch?v=RIWuA_K7_GY)
