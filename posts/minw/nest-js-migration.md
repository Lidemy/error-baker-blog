---
title: 實作 Nest.js 中的 Migration 與 Seeder
date: 2021-09-05
tags: [back-end]
author: minw
layout: layouts/post.njk
---

<!-- summary -->

這一篇文章是上一篇 [Nest.js 初探 CRUD](https://minw.blog/node-nest-intro) 的補充，由於 Typeorm + Nestjs 實在有太多坑可以踩，這邊紀錄在實作 Migration 跟 Seeder 的過程。

<!-- summary -->
<!-- more -->

## Migration & Seeder

Migration 的用途是用來紀錄 Table 的變動，通常結構上會分為 up 跟 down 分別在裡面撰寫進行更動的程式與需要復原更動的程式，而 Seeder 也是類似 Migration 的概念，差別在 Seeder 專指替 Table 塞入假資料的程式。

而在 Typeorm 中，有原生提供的 Migration 並且可以根據 Entity 自動產生，然而 Seeder 並不在原生方案之中，在探索可以怎麼實作 Seeder 時，也有看到 typeorm-seeding [^1] 但有鑒於上一次更新時間已是 2020 年中，加上也想要藉此更了解 TypeORM 的運作，所以沒有使用，以下則會分享用原生 Migration 實作 Seeder 的過程，相關的專案設置可以參考 [上一篇 CRUD](https://minw.blog/node-nest-intro) 的設置。

## TypeORM & Entity

首先針對 TypeORM 的 `ormconfig.json` 我們將預設的 src 改為 build，這是因為實際執行 migration 檔案的時候是執行 js 檔，而 Nest 編譯後才會將  js 丟在 build 之中（預設有有可能是 dist） 之中，所以將設置的參考位置改如下：

```json
{
   ...
   "entities": [
      "build/**/*.{ts,js}"
   ],
   "migrations": [
      "build/db/migration/**/*.{ts,js}"
   ],
   "subscribers": [
      "build/db/subscriber/**/*.{ts,js}"
   ],
   "cli": {
      "entitiesDir": "build/modules",
      "migrationsDir": "build/db/migration",
      "subscribersDir": "build/db/subscriber"
   }
}
```

接著我們開始設定對應資料的 Entity，在 TypeORM 中 Entity 是可以代表 Table 的 Class，將定義資料類型的過程拉了出來，這讓我們操作 Table 的內容的時候，是基於這個中間 Class 產生出的 Instance，而不是直接的資料。以常見的 User 為例，這是一個有關聯到 Role 的 User Table，我們先建立好 User 的 Entity：

```ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  roleId: number;

  @ManyToOne(() => RoleEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId', referencedColumnName: 'id' })
  role: RoleEntity;

  @CreateDateColumn()
  createdAt: Date;
}
```

而 User 有關聯的 Role Entity 也是。

```ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
```

接著我們執行 Build，確定 Build 中已有相關的 Entity js 檔案，再來就進到我們的重頭戲：Migration。

## Migration

在執行 migration 指令之前，我們先安裝 `ts-node` 確保在 node 環境下可以順利使用我們的 ts 檔案：

```shell
yarn add -D ts-node
```

接著在 package.json 中，加入 TypeORM cli 的指令，讓我們之後可以居於 `ts-node` 去使用 TypeORM [^3]。

```json
"script": {
  ...
  "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js"
  ...
}
```

接下來，我們可以如常的透過 TypeORM cli 指令來自動產生根據 Entity 的 Migration，這是最理想的狀態，我們不需要自己去重新寫一次 Table 的定義，舉例來說：

```shell
yarn typeorm migration:create -n CreateUser
```

然而實際產生出來會是像這樣的 Migration：

```ts
import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUser1630222102818 implements MigrationInterface {
    name = 'CreateUser1630222102818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \\`learning-casino\\`.\\`role\\` (\\`id\\` int NOT NULL AUTO_INCREMENT, \\`name\\` varchar(255) NOT NULL, PRIMARY KEY (\\`id\\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \\`learning-casino\\`.\\`user\\` (\\`id\\` int NOT NULL AUTO_INCREMENT, \\`nickname\\` varchar(255) NOT NULL, \\`email\\` varchar(255) NOT NULL, \\`password\\` varchar(255) NOT NULL, \\`points\\` int NOT NULL, \\`roleId\\` int NOT NULL, \\`createdAt\\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\\`id\\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
	 await queryRunner.query(`ALTER TABLE \\`learning-casino\\`.\\`user\\` DROP FOREIGN KEY \\`FK_c28e52f758e7bbc53828db92194\\``);
        await queryRunner.query(`DROP TABLE \\`learning-casino\\`.\\`user\\``);
        await queryRunner.query(`DROP TABLE \\`learning-casino\\`.\\`role\\``);
    }

}
```

在使用上產生出的結果不是很直覺，尤其要 debug Foreign Key 跟加入 seeder 的時候也不太好維護，於是這邊做了一個取捨，另外再維護一份 Migration 的 table 設定，改為使用比較直覺的語法去建立 Table，然這樣的缺點是，要同步確認 Entity 的改動有沒有同步到 Migration 之中，但考量到如果原先的 Migration 也是由 Entity 自動產生而來，後續 Entity 修改也需要重新 Revert 並執行產生的指令，這樣的缺點還可以接受。

於是在 Migration Up 的部分，我們透過 createTable 去新增 Role, User Table 並設定他的參數，並透過 createForeignKey 來設定關聯的 Foreign Key。其中，這邊 `createTable` 與 `createForeignKey` 都是 Query 層級，可以理解成這邊的指令都是直接對 DB 進行操作。

```ts
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.createTable(
    new Table({
      name: 'role',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'name',
          type: 'varchar',
        },
      ],
    }),
    true,
  );
  await queryRunner.createTable(
    new Table({
      name: 'user',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'nickname',
          type: 'varchar',
          default: null,
        },
        {
          name: 'email',
          type: 'varchar',
        },
        {
          name: 'password',
          type: 'varchar',
        },
        {
          name: 'points',
          type: 'integer',
          default: 0,
        },
        {
          name: 'roleId',
          type: 'integer',
          default: 4,
        },
        {
          name: 'createdAt',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    }),
    true,
  );
  await queryRunner.createForeignKey(
    'user',
    new TableForeignKey({
      columnNames: ['roleId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'role',
      onDelete: 'CASCADE',
    }),
  );
}
```

接著在 Down 的部分，我們要刪除原先建立的 Foreign Key 並且刪除 Table：

```ts
public async down(queryRunner: QueryRunner): Promise<void> {
  const table = await queryRunner.getTable('user');
  const foreignKey = table.foreignKeys.find(
    (fk) => fk.columnNames.indexOf('roleId') !== -1,
  );
  await queryRunner.dropForeignKey('user', foreignKey);
  await queryRunner.dropColumn('user', 'roleId');
  await queryRunner.dropTable('user');
  await queryRunner.dropTable('role');
}
```

那當我們設置好 Migration 後，就可以 Build 確定 Migration 編譯成 js 進到 Build 檔案夾，並且執行 `yarn typeorm migration:run`，執行 migration run 的時候，TypeORM 會幫我們在 DB 裏面開一個新的 Migration Table 紀錄我們使用的 Migration，並且執行我們 Migration 中的 Up Function，如果今天需要退回到上一個 Migration，也可以透過  `yarn typeorm migration:revert` 就可以回到上一個版本的 Migration，而同樣的 TypeORM 也會執行我們 Migration 中的 Down Function 來復原。

這邊要注意的是，由於 TypeORM 預設執行 Migration 的時候吃的 Config 檔是 ormconfig.json，如果有另外的 config 被包成物件在 src 中，這樣的方式 TypeORM CLI 可能吃不到設定檔，會需要另外讀取 config 的位置，或將物件的 config 內容取自於 ormconfig.json 中。

## Seeder

現在有 Table 了但我們還沒有相關的資料，於是我們可以開一個 Role 的 Seed 檔案：

```ts
export const RoleSeed = [
  {
    id: 1,
    name: 'admin',
  },
  {
    id: 2,
    name: 'user',
  }
]
```

由於 TypeORM 不像 Sequelize 有原生提供 seeding 的功能，這邊我們可以使用 Migration 來實作，非常簡單的，只要在 createTable 之後，透過 TypeORM Repository 來對 DB 進行操作就可以了 [^2]：

```ts
const roleRepository = getRepository('role');
await Promise.all(RoleSeed.map((role) => roleRepository.save(role)));
```

這邊由於開始使用 Repository，Typeorm 如果要關聯到對應的 Table 建立 Repository 時，會需要我們建立好的 Entity Class，所以這邊我們在 getRepositoty 中帶入前面 Entity name。

以上步驟都完成後，在一次 Build 執行 `yarn typeorm migration:run` 就可以了。

## TypeORM 觀念

### Repository Pattern

一開始摸 Entity 的時候覺得不太好對應到其他使用過的 ORM e.g. Sequelize 去想像，這次重新閱讀了 Typeorm 跟 Sequelize 的文件，在 Sequelize 中，Model 事實上是將 Entity + 取資料的邏輯結合在一起，舉例來說，下方是一段 sequelize init 時會產生出來的 model index.js 以及我們自己撰寫的 model.js [^5]:

```js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nickname: DataTypes.STRING,
    email: DataTypes.STRING,
    status: DataTypes.ENUM(['active', 'inactive'])
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Role)
  };
  return User;
};
```

接著可以看到 Sequelize 將我們的 Model 設定檔 import 之後，直接放入 DB Object 中，在往後的操作中我們直接由 Model 進行操作：

```js
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```

而我們 Model 定義檔就類似於 Entity 的效果，但實際效果上，TypeORM 的 Entity 更為純粹，並透過 Repository Pattern 將取資料的部分分開，需要做資料操作的時候透過 Repository：

```ts
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  ...
}
```
而也可以將 Entity 作為資料的 Instance，舉例來說：repository 回傳的資料 class 會是 UserEntity：
```ts
  async getUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }
```

相較於原本 Model 將 Entity 與執行綁在一起的做法，Entity 的彈性更大。

### Foreign Key 運作

由於在開發 revert 的時候踩到了很多 ForeignKey 衝突的雷，這邊花了一些時間去了解 MySQL Foreign Key 的運作方式。

Foreign Key 是為了實現 Model Relation 的一個機制，而在講 Model Relation 之前就要先介紹三種 Relation [^7]「一對一」、「一對多」跟「多對多」，以一個社群軟體為例：

一對一：每個使用者只有一個大頭貼。
```text
// user has one avatar
User {
  id
  nickname
  avatar_id
}

// avatar belongs to user
Avatar {
  id
  img_url
}
```

一對多：一個使用者有很多貼文。

```text
// user has many post
User {
  id
  nickname
  post_id
}

// post belongs to user
Post {
  id
  content
}
```

多對多：一個使用者可以有很多粉專、而粉專也可以被很多使用者擁有。
```text
// user has many userpage ~ has many page
User {
  id
  nickname
}

// page has many userpage ~ has many user
Page {
  id
  url
}

// userpage belongs to user & page
UserPage {
  id
  page_id
  user_id
}
```

而 Foreign Key (FK) 就是指那些對應到其他 Table 的 Key e.g. page_id, user_id, avatar_id ...，而為什麼要特別指定 Foreign Key 而不直接 JOIN 就好？

事實上 MySQL 預設引擎中也沒有提供 FK 的功能，而是需要使用 InnoDB 儲存引擎才有。之所以有 FK 是因為於 DB 的角度並不會知道這個欄位的特殊意義，反之在 Table 指定 FK 可以讓 DB 知道資料的連動性，並警示能不能新增跟刪除，甚至設定更新跟刪除的連動動作：`CASCADE`, `SET NULL`, `NO ACTION` 與 `RESTRICT`。

但既然有額外去設定為 FK，MySQL 也有另外做一些處理，這些關聯性的資料會被存在 MySQL 的系統 DB information_schema 中的 `KEY_CONLUMN_USAGE` table 中，會定義所有 key 的名稱、類型跟連結方式。所以 revert 的 drop FK 不單單只是刪除而已，也包含在這個 table 中將關聯的資訊刪除 [^8]。

## 小結

踩坑的過程覺得幾個是 debug 的關鍵點：

- Migration 的連線設定吃的是哪一段？要吃的檔案到底在哪裡？有更新到嗎？
- 階段執行的層級是什麼？ 是 Query 還是 Repository？
- Revert 有完全抹消 Run 的執行嗎？除了資料之外 Foreign Key 有清除嗎？

以上是這次踩坑一個機會了解 ORM 跟 DB 之間的互動方式。

## 參考資料

- [初探用 Nest.js 做出一個 CRUD 服務 | min](https://minw.blog/node-nest-intro)
- [typeorm/docs at master · typeorm/typeorm](https://github.com/typeorm/typeorm/tree/master/docs)
- [^1]: [typeorm-seeding - npm](https://www.npmjs.com/package/typeorm-seeding)
- [^2]: [TypeORM how to seed database - Stack Overflow](https://stackoverflow.com/questions/51198817/typeorm-how-to-seed-database)
- [^3]: [node.js - TypeORM commands return nothing - Stack Overflow](https://stackoverflow.com/questions/66604876/typeorm-commands-return-nothing)
- [^5]: [Manual | Sequelize](https://sequelize.org/master/manual/model-basics.html)
- [^6]: [sql - Why use Foreign Key constraints in MySQL? - Stack Overflow](https://stackoverflow.com/questions/3433975/why-use-foreign-key-constraints-in-mysql)
- [^7]: [Model 關連性 為你自己學 Ruby on Rails | 高見龍](https://railsbook.tw/chapters/18-model-relationship.html)
- [^8]: [mysql - How do I see all foreign keys to a table or column? - Stack Overflow](https://stackoverflow.com/questions/201621/how-do-i-see-all-foreign-keys-to-a-table-or-column)