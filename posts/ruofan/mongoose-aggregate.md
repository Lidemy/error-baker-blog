---
title: mongoose 中的 aggregate
date: 2021-10-03
tags: [back-end]
author: Ruofan
layout: layouts/post.njk
image: /img/posts/ruofan/mongoose.png
---

<!-- summary -->

## 前言

Hi，大家好！前陣子在研究專案上從 MySQL migrate 到 MongoDB 的可能性，選擇了 Mongoose 作為這次的主題，這篇文章會帶著大家認識 aggregate 的基本操作。

<!-- summary -->

## 什麼是 Mongoose？
以下為 Mongoose 官方文件上對自己的介紹：
> elegant mongodb object modeling for node.js.

> writing MongoDB validation, casting and business logic boilerplate is a drag. That's why we wrote Mongoose.

簡單來說，Mongoose 是基於 node.js 的 Object Data Modeling (ODM)，讓我們可以優雅的操作 MongoDB 中的資料。

## Aggregate
在進入介紹前，先和大家分享一下在 Mongoose v6.0.7 版本之前使用 Aggregate 會出現下方錯誤資訊。
```js
Error: Method "collection.aggregate()" accepts at most two arguments

MongoInvalidArgumentError: Method "collection.aggregate()" accepts at most two arguments
    at Collection.aggregate (/home/dave/projects/asd/node_modules/mongodb/lib/collection.js:367:19)
    at NativeCollection.<computed> [as aggregate] (/home/dave/projects/asd/node_modules/mongoose/lib/drivers/node-mongodb-native/collection.js:200:33)
    at NativeCollection.Collection.doQueue (/home/dave/projects/asd/node_modules/mongoose/lib/collection.js:135:23)
    at /home/dave/projects/asd/node_modules/mongoose/lib/collection.js:82:24
    at processTicksAndRejections (internal/process/task_queues.js:77:11)
```
這個 [issue](https://github.com/Automattic/mongoose/issues/10722) 前幾天被修正了，在實作時可以注意一下 Mongoose 的版本。

## $match & $project
$match 可以讓我們篩選資料，$project 可以組合出最後 output 的資料。
來看看下面的範例。
```js
async function getStoreInfo(storeUuid) {
  const ObjectId = mongoose.Types.ObjectId
  const [result] = await Store.aggregate([
    { $match: { uuid: ObjectId(storeUuid) } },
    {
      $project: {
        _id: 0,
        uuid: "$uuid",
        name: "$info.name",
        servicePhone: "$info.servicePhone",
        address: "$info.address",
      },
    },
  ])
  return result
}
```
如果印出上方的 result 會得到下方資料。
```json
{
    "uuid": "6123456e1787b96a05123456",
    "name": "Error Baker",
    "servicePhone": "0287878787",
    "address": "台北市中正區羅斯福路一段2號",
}
```

## $lookup & $unwind
$lookup 可以讓我們使用 JOIN 從其他 collection 拿資料，$unwind 可以拆分資料。
來看看下面的範例。
```js
async function getRoleWithUserByStoreId(storeId) {
  const ObjectId = mongoose.Types.ObjectId;
  const result = await Role.aggregate([
    { $match: { store: ObjectId(storeId) } },
    {
      $lookup: {
        from: "storeuserroles",
        pipeline: [
          {
            $lookup: {
              from: "users", // Collection name
              localField: "user",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: "$user",
          },
          {
            $project: {
              _id: 0,
              id: { $toString: "$user._id" },
              uuid: { $toString: "$user.uuid" },
              name: "$user.name",
              email: "$user.email",
              phone: "$user.phone",
              photoUrl: "$user.photoUrl",
              intro: "$user.intro",
            },
          },
        ],
        as: "users",
      },
    },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        name: "$name",
        users: "$users",
      },
    },
  ]);

  return result;
}

```
如果印出上方的 result 會得到下方資料。
```json
[
  {
    "id": "6123456d87bee84123456887",
    "name": "errorBaker筆者",
     "users": [
        {
          "id": "6151234567bee84077654321",
          "uuid": "615528412345674072b40887",
          "name": "ruofan",
          "email": "errorBaker@gmail.com",
          "phone": "0987878787",
          "photoUrl": null,
          "intro": null
        },
        {
          "id": "6123450058bee87072012345",
          "uuid": "61552123450ee84072b40870",
          "name": "xiang",
          "email": "errorBaker@gmail.com",
          "phone": "0978787878",
          "photoUrl": null,
          "intro": null
        }
      ]
  },
  {
    "id": "6123456d87bee80073456801",
    "name": "errorBaker管理員",
     "users": [
        {
          "id": "6151234567bee84077654302",
          "uuid": "615528412345674070020887",
          "name": "huli",
          "email": "errorBaker@gmail.com",
          "phone": "0987878787",
          "photoUrl": null,
          "intro": null
        },
        {
          "id": "6123450058bee87072012303",
          "uuid": "61552123450ee84000340870",
          "name": "clay",
          "email": "errorBaker@gmail.com",
          "phone": "0978787878",
          "photoUrl": null,
          "intro": null
        }
      ]
  }
]

```
## $cond
$cond  可以讓我們在 $project 中加上條件判斷。
來看看下面的範例。
```js
async function getUserByType(storeId, userType = null) {
  const ObjectId = mongoose.Types.ObjectId;
  const result = await StoreUserRole.aggregate([
    { $match: { store: ObjectId(storeId) } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "role",
      },
    },
    { $unwind: "$role" },
    {
      $project: {
        _id: 0,
        uuid: { $toString: "$user.uuid" },
        name: "$user.name",
        email: "$user.email",
        phone: "$user.phone",
        photoUrl: "$user.photoUrl",
        intro: "$user.intro",
        role: {
          id: 0,
          id: { $toString: "$role._id" },
          name: "$role.name",
          isSuperAdmin: {
            $cond: [
              { $eq: [userType, null] },
              "$role.isSuperAdmin",
              "$$REMOVE",
            ],
          },
        },
      },
    },
  ]);
  return result;
}
```
如果沒有傳入 userType 印出上方的 result 會得到下方資料。
```json
[
    {
      "role": {
        "id": "6878784d58bee12345640801",
        "name": "errorBaker筆者",
        "isSuperAdmin": false,
      },
      "uuid": "6878784d58bee12345640887",
      "name": "ruofan",
      "email": "errorBaker@gmail.com",
      "phone": "0987878787",
      "photoUrl": null,
      "intro": null
    },
    {
      "role": {
        "id": "6878784d58bee12345640801",
        "name": "errorBaker管理員",
        "isSuperAdmin": true,
      },
      "uuid": "6878784d58bee12345640887",
      "name": "huli",
      "email": "errorBaker@gmail.com",
      "phone": "0988878787",
      "photoUrl": null,
      "intro": null
    }
],
```
## 小結
Aggregate 中有非常多方法可以讓我們整理與操作資料，在研究的過程中即便踩了一些坑也還是覺得挺有趣的！推薦給大家！

在閱讀文章時如果有遇到什麼問題，或是有什麼建議，都歡迎留言告訴我，謝謝。😃

- [Github | Repo: express-mongoose](https://github.com/ruofanwei/express-mongoose)

## 參考資料

- [Documentation | mongoDB: Aggregation Pipeline Operators](https://mongoing.com/docs/reference/operator/aggregation.html)
- [Documentation | mongoose](https://mongoosejs.com/)
