---
title: Use Fireorm to interact with Cloud Firestore
date: 2022-12-17
tags: [back-end]
author: Ruofan
layout: layouts/post.njk
image: /img/posts/ruofan/cloud-firestore.png
---
<!-- summary -->

Hi，大家好！ 前陣子在研究專案上從 MySQL migrate 到 Cloud Firestore 的可能性，選擇了 Fireorm 作為這次的主題，這篇文章會帶著大家認識 Fireorm 的基本操作。

<!-- summary -->
<!-- more -->

## 什麼是 Cloud Firestore ?
以下為 Cloud Firestore [官方文件](https://firebase.google.com/docs/firestore) 上對自己的介紹：

> Cloud Firestore is a flexible, scalable database for mobile, web, and server development from Firebase and Google Cloud.

簡單來說，Cloud Firestore 是一個有彈性與擴展性的 NoSQL cloud database。想了解更多的話，推薦看 Cloud Firestore [官方文件](https://firebase.google.com/docs/firestore)。

## 什麼是 Fireorm ?
以下為 Fireorm [官方文件](https://fireorm.js.org/#/) 上對自己的介紹：

> Fireorm is a tiny wrapper on top of firebase-admin that makes life easier when dealing with a Firestore database.

> Fireorm is heavily inspired by other orms such as TypeORM and Entity Framework. The idea is that we:
1- define our model as a simple JavaScript class,
2- decorate our model with fireorm’s Collection decorator to represent a Firestore collection
3- use our model’s repository to do CRUD operations on your Firestore database.

#### 可以不使用 Fireorm 嗎？
筆者認為，Fireorm 不一定要用。這邊使用的原因單純是因為 fireorm 可以簡便的定義 schema。
值得注意的是，在 Fireorm 的 [Roadmap](https://github.com/wovalle/fireorm/issues/1) 還有很多 功能 pending 中。

## Firebase 環境設定

首先，先進入 firebase console 開啟一個新的專案，接著在 firestore database 按下開啟使用。最後到專案設定中 把 project 名稱跟 service account key 的 json 先記下來，待會會使用到。
![](/img/posts/ruofan/firestore-1.png)

## 開始實作！

先來看一下如何 initialize firebase。

> 這邊特別值得注意的是 筆者使用的 firebase-admin 版本是 v10，引用的方法跟 v9 有些許的不同，想了解更多的話，推薦看 [官方文件](https://firebase.google.com/docs/admin/migrate-node-v10)。

剛剛記下來的 project 名稱跟 service account key 這邊使用在 initialize firebase。
```typescript
import * as functions from "firebase-functions";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as fireorm from "fireorm";
import { Request, Response, NextFunction } from "express";
import express = require("express");
import routes from "./routes";


const serviceAccount = require("../firestore.creds.json");
const app = express();
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: `https://${process.env.API_PROJECT}.firebaseio.com`,
});
const firestore = getFirestore();
firestore.settings({
  timestampsInSnapshots: true,
  ignoreUndefinedProperties: true,
});
fireorm.initialize(firestore, {
  validateModels: true,
});

app.use("/fire/", routes);
// error handling middleware
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  //console.log(err);
  res.status(422).send({ error: err.message });
});

// listen for requests
app.listen(process.env.port || 4000, function () {
  console.log("Ready to Go!");
});

```

#### 實作 schema
這邊把 每個 document 都會有的 Timestamp 整理做一個統整。
```typescript
import { Timestamp } from 'firebase-admin/firestore';

export abstract class AbstractSchema {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;

  constructor() {
    this.createdAt = Timestamp.now();
    this.updatedAt = Timestamp.now();
    this.deletedAt = null;
  }

  public async paranoid(): Promise<void> {
    this.deletedAt = Timestamp.now();
  }
}

```

```typescript
import { Collection } from 'fireorm';

import { AbstractSchema } from './abstractSchema';
import { ICompanySchema } from '../interfaces/company.interface';
@Collection('companys')
export default class CompanySchema
  extends AbstractSchema
  implements ICompanySchema
{
  id: string;
  uuid: string;
  name: string;

  stores: Array<string>;
}

```

#### 實作 interface
```typescript
export interface ICompanySchema {
  id: string;
  uuid: string;
  name: string;

  stores: Array<string>;
}

export interface createCompanyReq
  extends Omit<
    ICompanySchema,
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'paranoid'
    | 'id'
  > {
  isMainStore: boolean;
}

export interface createCompanyRes
  extends Omit<
    ICompanySchema,
    'createdAt' | 'updatedAt' | 'deletedAt' | 'paranoid'
  > {

}
```
#### 實作 repository

##### 什麼是 InversifyJS ?
以下為 InversifyJS [官方文件](https://inversify.io/) 上對自己的介紹：

> InversifyJS is a lightweight (4KB) inversion of control (IoC) container for TypeScript and JavaScript apps. A IoC container uses a class constructor to identify and inject its dependencies.

簡單來說，InversifyJS 讓我們可以簡便的實作 Dependency injection。想了解更多的話，推薦看 InversifyJS [官方文件](https://inversify.io/)。

##### 什麼是 Dependency injection ?

> Dependency injection (DI) is a very simple concept that aims to decouple components of your software and ease their integration and testing.

簡單來說，Dependency injection 的概念是讓我們在設計架構上可以提高可測試性與重用性 。想了解更多的話，推薦看 [Introduction to Design Patterns and Dependency Injection](https://hackernoon.com/introduction-to-design-patterns-and-dependency-injection)。

```typescript
import {
  getRepository,
  BaseFirestoreRepository,
  runTransaction,
} from 'fireorm';
import { injectable } from 'inversify';
import CompanySchema from '../schemas/company';
import {
  ICompanySchema
  createCompanyRes,
} from '../interfaces/company.interface';

export interface ICompanyRepository {
  create(name: string): Promise<createCompanyRes>;
  findOne(name: string): Promise<ICompanySchema>;
}
@injectable()
export class CompanyRepository implements ICompanyRepository {
  private companyCollection: BaseFirestoreRepository<CompanySchema>;

  constructor() {
    this.companyCollection = getRepository(CompanySchema);
  }

  public async create(name: string): Promise<createCompanyRes> {
    let company = new CompanySchema();
    return await runTransaction(async (tran) => {
      const companyTranRepository = tran.getRepository(CompanySchema);
      company.name = name;
      return await companyTranRepository.create(company);
    });
  }
  public async findOne(id: string): Promise<ICompanySchema> {
    const company = await this.companyCollection.findById(id);
    return company;
  }
}

```

#### 實作 service

```typescript
import { CompanyRepository } from '../repositories/companyRepository';
import { injectable, inject } from 'inversify';

import {
  ICompanySchema,
  createCompanyReq,
  createCompanyRes,
} from '../interfaces/company.interface';

@injectable()
export class CompanyService implements ICompanyService {
  constructor(
    @inject('CompanyRepository') private companyRepository: CompanyRepository
  ) {
    this.companyRepository = new CompanyRepository();
  }
  async firnOrCreateCompany(
    companyUuid: string,
    companyName: string
  ) {
    try {
      let company;
      let isMainStore: boolean = false;
      /* find or create company by uuid */
      if (companyUuid) {
        company = await this.companyRepository.findOne(companyName);
      } else {
        company = await this.companyRepository.create(companyName);
        isMainStore = true;
      }

      return { company, isMainStore };
    } catch (error) {
      throw error;
    }
  }
}

```

#### 實作 inversify config

```typescript
import 'reflect-metadata';
import { Container } from 'inversify';
import { CompanyService } from '../services/companyService';
import { CompanyRepository } from '../repositories/companyRepository';
const container = new Container();

// Services
container.bind<CompanyService>('CompanyService').to(CompanyService);

// Repositories
container.bind<CompanyRepository>('CompanyRepository').to(CompanyRepository);

export default container;

```

#### 實作 controller

```typescript
import { NextFunction, Request, Response } from 'express';
import container from '../config/inversify.config';
import { CompanyService } from '../services/companyService';

export class StoreController {

  public static async buildStore(
    req: Request & Express.CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyName: string = req.body.companyName; // option
      /* clarify the type for companyUuid while assign value */
      let companyUuid: string = req.headers.companyuuid!; // option

      const companyService = await container.get<CompanyService>(
        'CompanyService'
      );

      /* find or create company */
      const {company, isMainStore} = await companyService.firnOrCreateCompany(
        companyUuid,
        companyName
      );

      return res.status(200).json({
        code: 200,
        message: '執行成功',
      });
    } catch (e) {
      console.log(e);

      next(e);
    }
  }
}
export default StoreController;

```
#### 實作 route

```typescript
import { Router } from 'express';
import StoreController from '../controller/storeController';

const router: Router = Router();
require('dotenv').config();

// create store
router.post(
  '/store',
  StoreController.buildStore
);

export default router;

```

## 小結

這次實作的過程認識了不同的架構設計概念，整體來說蠻有趣的！
在閱讀文章時如果有遇到什麼問題，或是有什麼建議，都歡迎留言告訴我，謝謝。😃

- [Github | Repo: express-firestore](https://github.com/ruofanwei/express-firestore)

## 參考資料

- [Documentation | firestore](https://firebase.google.com/docs/firestore)
- [Documentation | fireorm](https://fireorm.js.org/#/)
- [Documentation | inversify](https://inversify.io/)
- [Hackernoon | design-patterns](https://hackernoon.com/introduction-to-design-patterns-and-dependency-injection)
