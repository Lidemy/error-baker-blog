---
title: 原始碼探索
date: 2021-09-18
tags: [back-end, JavaScript, sequelize]
author: cwc329
layout: layouts/post.njk
---

<!-- summary -->

在第一次用 sequelize 的時候，除了被開發的方便性震驚，同時也讓我更注意看 app 運作時的 logs。這也讓我想要去看看它的原始碼是怎麼產生與我要求的物件格式相符之資料。

<!-- summary -->

# Sequelize 與我的好奇

Sequelize 是一個 Node.js 的 ORM 套件，支援 MySQL, Postgres, MariaDB, SQLite 與 Microsoft SQL Server。這是一套方便開發的套件，使用 ORM 除了開發上方便可以不需要再寫 SQL 之外，依照套件的支援程度也可以無痛地轉移到各種 database engine。

初學 Sequelize 時，最令我驚豔的是 eager loading 的功能，只要我先將每個 model 之間的關係定義好，然後就可以使用物件的寫法，傳入我想要得到的資料結構，而且他可以做到 nested，也就是我可以寫很多層的關聯，Sequelize 就可以依照這些層層疊疊的關係把我想要的資料撈出來。

```js
const me = await Users.findOne({
  where: {
    username: req.jwtData.username,
  },
  attributes: ["username", "email", "isAdmin"],
  include: [
    {
      model: Podcasts,
      as: "subscriptions",
      attributes: ["id"],
      through: {
        attributes: [],
      },
    },
    {
      model: Playlists,
      as: "playlists",
      attributes: ["id", "name"],
      include: {
        model: Episodes,
        attributes: ["id"],
        through: {
          attributes: [],
        },
      },
    },
    {
      model: Records,
      as: "playedRecords",
      attributes: ["episodeId", "progress"],
    },
  ],
  order: [[{ model: Records, as: "playedRecords" }, "updatedAt", "DESC"]],
});
```

這個時候我就很好奇 Sequelize 到底是怎麼做到的，我曾經使用 app log 中它使用的 SQL 直接執行，不過結果並不是巢狀結構，而是個一維的 array of objects。這就讓我好奇它到底是怎麼將這些東西 parse 出如此複雜的結構。於是乎我就去找了原始碼來看。想說把我 trace code 的過程記錄下來，雖然有點流水帳，不過也算是一次不錯的經驗。

## 使用工具技巧與先備知識

基本上我就是從 github 將 Sequelize 的原始碼 git clone，然後使用我的 VS Code 編輯器看，平常工作時我也習慣使用 VS Code 去 trace code。在這邊我稍微介紹一下在 trace code 時好用的兩個快捷鍵與一個功能。快捷鍵分別是 `F12` 與 上一頁 (`Ctrl` + `-`)。前者可以直接帶你到這個變數被定義的地方，而後者會直接帶回到上一頁，游標上一個位置，基本上要看 code 這兩個鍵就足夠了。而功能就是全域搜尋，VS Code 支援在你所在的 Workspace 痊癒搜尋你所想要找的關鍵字。知道這三個技巧，就可以來看 code。

除了工具，這篇文章為了節省一些篇幅，預設讀者知道最基本的物件導向知識，都準備好就可以開始了。

## 第一次找，很隨便

根據上面的 code 我想要找的是 `findOne` 這個 function 到底做了什麼，
一開始我很直覺地全域搜尋 `findOne`，在眾多結果中，我找到一行 `static async findOne` 開頭的程式碼，我想這應該就是我要找的東西了。

```js
  static async findOne(options) {
    if (options !== undefined && !_.isPlainObject(options)) {
      throw new Error('The argument passed to findOne must be an options object, use findByPk if you wish to pass a single primary key value');
    }
    options = Utils.cloneDeep(options);

    if (options.limit === undefined) {
      const uniqueSingleColumns = _.chain(this.uniqueKeys).values().filter(c => c.fields.length === 1).map('column').value();

      // Don't add limit if querying directly on the pk or a unique column
      if (!options.where || !_.some(options.where, (value, key) =>
        (key === this.primaryKeyAttribute || uniqueSingleColumns.includes(key)) &&
          (Utils.isPrimitive(value) || Buffer.isBuffer(value))
      )) {
        options.limit = 1;
      }
    }

    // Bypass a possible overloaded findAll.
    return await this.findAll(_.defaults(options, {
      plain: true
    }));
  }
```

看著這段程式碼，如果我只專注在我想要找的東西，也就是如何 parse 資料，其實是一段滿好看懂的程式碼。首先是這些變數與函式的命名非常的簡潔明瞭，還有就是適時出現的註解，非常有效的減少我去理解這段 code 的用意。如果以空白行區分可以將這段 code 分成三份，第一份主要是在 function 一開始先做錯誤處理，不讓有不符規範的 option 執行。第二段則是去處理如果沒有 limit 選項時的狀況。而第三段是我在這邊的重點，也就是其實 `findOne` 是使用預先處理過的 option 去執行 `findAll`。所以我應該要再去找 `findAll`，把游標移到 `this.findAll` 然後按下 F12 就會帶我過去了。

```js
  static async findAll(options) {
    if (options !== undefined && !_.isPlainObject(options)) {
      throw new sequelizeErrors.QueryError('The argument passed to findAll must be an options object, use findByPk if you wish to pass a single primary key value');
    }

    if (options !== undefined && options.attributes) {
      if (!Array.isArray(options.attributes) && !_.isPlainObject(options.attributes)) {
        throw new sequelizeErrors.QueryError('The attributes option must be an array of column names or an object');
      }
    }

    this.warnOnInvalidOptions(options, Object.keys(this.rawAttributes));

    const tableNames = {};

    tableNames[this.getTableName(options)] = true;
    options = Utils.cloneDeep(options);

    _.defaults(options, { hooks: true });

    // set rejectOnEmpty option, defaults to model options
    options.rejectOnEmpty = Object.prototype.hasOwnProperty.call(options, 'rejectOnEmpty')
      ? options.rejectOnEmpty
      : this.options.rejectOnEmpty;

    this._injectScope(options);

    if (options.hooks) {
      await this.runHooks('beforeFind', options);
    }
    this._conformIncludes(options, this);
    this._expandAttributes(options);
    this._expandIncludeAll(options);

    if (options.hooks) {
      await this.runHooks('beforeFindAfterExpandIncludeAll', options);
    }
    options.originalAttributes = this._injectDependentVirtualAttributes(options.attributes);

    if (options.include) {
      options.hasJoin = true;

      this._validateIncludedElements(options, tableNames);

      // If we're not raw, we have to make sure we include the primary key for de-duplication
      if (
        options.attributes
        && !options.raw
        && this.primaryKeyAttribute
        && !options.attributes.includes(this.primaryKeyAttribute)
        && (!options.group || !options.hasSingleAssociation || options.hasMultiAssociation)
      ) {
        options.attributes = [this.primaryKeyAttribute].concat(options.attributes);
      }
    }

    if (!options.attributes) {
      options.attributes = Object.keys(this.rawAttributes);
      options.originalAttributes = this._injectDependentVirtualAttributes(options.attributes);
    }

    // whereCollection is used for non-primary key updates
    this.options.whereCollection = options.where || null;

    Utils.mapFinderOptions(options, this);

    options = this._paranoidClause(this, options);

    if (options.hooks) {
      await this.runHooks('beforeFindAfterOptions', options);
    }
    const selectOptions = { ...options, tableNames: Object.keys(tableNames) };
    const results = await this.queryInterface.select(this, this.getTableName(selectOptions), selectOptions);
    if (options.hooks) {
      await this.runHooks('afterFind', results, options);
    }

    //rejectOnEmpty mode
    if (_.isEmpty(results) && options.rejectOnEmpty) {
      if (typeof options.rejectOnEmpty === 'function') {
        throw new options.rejectOnEmpty();
      }
      if (typeof options.rejectOnEmpty === 'object') {
        throw options.rejectOnEmpty;
      }
      throw new sequelizeErrors.EmptyResultError();
    }

    return await Model._findSeparate(results, options);
  }
```

`findAll` 是個更複雜的 function，洋洋灑灑將近 100 行，不過有些地方不是我關心的，像是在真的下 SQL 前所要跑的 hooks 與對 option 做預處理都不是這次的重點，第一個重點出現在

```js
const results = await this.queryInterface.select(
  this,
  this.getTableName(selectOptions),
  selectOptions
);
```

這邊是他真的去拿資料的 function，我去看一下 parse 是不是在這裏面做的。不過這邊想要直接 F12 過去就沒這個簡單了，因為 `this.queryInterface.select` 的 `select` 找不到 definition，這個時候就要先從 `queryInterface` 下手。這邊可以看出這個 `queryInterface` 是這個物件的一個 attribute，在這邊 F12 就可以看到是怎麼產生的了。

```js
  static get queryInterface() {
    return this.sequelize.getQueryInterface();
  }
```

看起來這是從同個物件的 `sequelize` 這個 attribute 得到的，那這個 `sequelize` 又是怎麼來的？

```js
static init(attributes, options = {}) {
    if (!options.sequelize) {
      throw new Error('No Sequelize instance passed');
    }

    this.sequelize = options.sequelize;
    // a lot of code
}
```

是這個 static method 的 option 決定的，那從上方 js doc 可以看到 `option.sequelize` 是什麼。

```js
/**
 * @param {object}                  options These options are merged with the default define options provided to the Sequelize constructor
 * @param {object}                  options.sequelize Define the sequelize instance to attach to the new Model. Throw error if none is provided.
 */
```

所以這個會是一個 sequelize instance，那要去找 sequelize instance 到底是什麼。所謂 instance 就是把 class 具體化之後的實體，也就是說當 new 一個 class 時就會產生一個 instance，那在這邊我要找的其實就是 class sequelize。先全域搜尋碰碰運氣，還真的讓我找到了 sequelize.js 這個檔案定義了 class Sequelize。在這個檔案我搜尋 `getQueryInterface` 發現了這個 method。

```js
  getQueryInterface() {
    return this.queryInterface;
  }
```

那我們再去看一下在 class Sequelize 中的 queryInterface 是麼產生的。

```js
constructor(database, username, password, options) {
  // a lot of code
  this.queryInterface = this.dialect.queryInterface;
  // a lot of code
}
```

使用 F12 大法可以看到這個 `this.dialect` 是怎麼決定的。

```js
let Dialect;
// Requiring the dialect in a switch-case to keep the
// require calls static. (Browserify fix)
switch (this.getDialect()) {
  case "mariadb":
    Dialect = require("./dialects/mariadb");
    break;
  case "mssql":
    Dialect = require("./dialects/mssql");
    break;
  case "mysql":
    Dialect = require("./dialects/mysql");
    break;
  case "postgres":
    Dialect = require("./dialects/postgres");
    break;
  case "sqlite":
    Dialect = require("./dialects/sqlite");
    break;
  default:
    throw new Error(
      `The dialect ${this.getDialect()} is not supported. Supported dialects: mssql, mariadb, mysql, postgres, and sqlite.`
    );
}
this.dialect = new Dialect(this);
```

也就是說這邊是依照給進來的 dialect 不同去決定要使用哪個 class 去 new instance。因為我原本是用 MySQL，所以我就先去看一下 "./dialects/mysql"。

到這個檔案裡面，在 `class MysqlDialect` 的 `constructor` 中就可以找到

```js
class MysqlDialect extends AbstractDialect {
  constructor(sequelize) {
    super();
    this.sequelize = sequelize;
    this.connectionManager = new ConnectionManager(this, sequelize);
    this.queryGenerator = new QueryGenerator({
      _dialect: this,
      sequelize,
    });
    this.queryInterface = new MySQLQueryInterface(
      sequelize,
      this.queryGenerator
    );
  }
}
```

這邊是 new 一個 `MySQLQueryInterface`，接著看這個 class 裡只有三個 method，

```js
class MySQLQueryInterface extends QueryInterface {
  async removeColumn(tableName, columnName, options) {
    // a lot of code
  }

  async upsert(tableName, insertValues, updateValues, where, options) {
    // a lot of code
  }

  async removeConstraint(tableName, constraintName, options) {
    // a lot of code
  }
}
```

所以如果想要找 `queryInterface.select()` 要從 `QueryInterface` 下手。

```js
class QueryInterface {
  // a lot of code
  async select(model, tableName, optionsArg) {
    const options = { ...optionsArg, type: QueryTypes.SELECT, model };

    return await this.sequelize.query(
      this.queryGenerator.selectQuery(tableName, options, model),
      options
    );
  }
}
```

那我們就再去看一下 `query` 這個 method。

```js
async query(sql, options) {
  // a lot of code
  return retry(async () => {
    if (options.transaction === undefined && Sequelize._cls) {
      options.transaction = Sequelize._cls.get('transaction');
    }

    checkTransaction();

    const connection = await (options.transaction ? options.transaction.connection : this.connectionManager.getConnection(options));
    const query = new this.dialect.Query(connection, this, options);

    try {
      await this.runHooks('beforeQuery', options, query);
      checkTransaction();
      return await query.run(sql, bindParameters);
    } finally {
      await this.runHooks('afterQuery', options, query);
      if (!options.transaction) {
        await this.connectionManager.releaseConnection(connection);
      }
    }
  }, retryOptions);
}
```

前面都是對 sql 與 options 做處理，這邊重點在 `retry` 的 callback 裡面的 `query.run`。

```js
  async run(sql, parameters) {
    // a lot of code
    return this.formatResults(results);
  }
```

這邊代表他在 run return 的是已經 format 過的結果，那大概表示 parse 是在這邊做的。

```js
formatResults(data) {
  let result = this.instance;
  // a lot of code
  if (this.isSelectQuery()) {
    return this.handleSelectQuery(data);
  }
  // a lot of code
}
```

```js
handleSelectQuery(results) {
  let result = null;
  // Map raw fields to names if a mapping is provided
  if (this.options.fieldMap) {

  // Queries with include
  } else if (this.options.hasJoin === true) {
    results = AbstractQuery._groupJoinData(results, {
      model: this.model,
      includeMap: this.options.includeMap,
      includeNames: this.options.includeNames
    }, {
      checkExisting: this.options.hasMultiAssociation
    });

    result = this.model.bulkBuild(results, {
      isNewRecord: false,
      include: this.options.include,
      includeNames: this.options.includeNames,
      includeMap: this.options.includeMap,
      includeValidated: true,
      attributes: this.options.originalAttributes || this.options.attributes,
      raw: true
    });
  // Regular queries
  } else {

  }

  // return the first real model instance if options.plain is set (e.g. Model.find)
  if (this.options.plain) {
    result = result.length === 0 ? null : result[0];
  }
  return result;
}
```

看到這邊我猜想我應該快到終點了，

```js
  } else if (this.options.hasJoin === true) {
    results = AbstractQuery._groupJoinData(results, {...});
  }
```

關鍵應該就在 `_groupJoinData`，只要看完這個 function 我應該就能知道他是怎麼從原始的結果 parse 出巢狀結構的資料。

```js
  static _groupJoinData(rows, includeOptions, options) {

    /*
     * Author (MH) comment: This code is an unreadable mess, but it's performant.
     * groupJoinData is a performance critical function so we prioritize perf over readability.
     */
  }
```

原本我興高采烈終於可以知道原理了，不過看到這兩行我心就涼了，再往下看，那些 code 真的精美到我不知其所以然。
看來我這次 trace source code 就只能先到這邊了。

## 結語

其實這次雖然不能真的了解 Sequelize 是怎麼 parse 資料。不過在 trace 的過程中，我對於怎樣是好的 code 有更多理解。首先是資料夾的結構，他們每個資料夾與檔案是依照這個專案的架構去區分，檔案中幾乎都只有一個對應名稱的 class，除此之外就沒有其他東西。還有就是命名，class 中有一些 attribute 是其他 class，這時這些 attribute 就會和 class 一樣的名稱，如此一來在 trace code 的時候看到這些名稱就可以知道要去哪裡找對應的 class 看。

而當我第二次 trace 的時候，我覺得應該用一個更好的方式來做。當我們使用 Sequelize 時，如果把連線到資料庫這部分先不管，整體的流程應該像是：

> 1. 依照 code 建立 model instance。
> 2. 對這個 instance 下我們想要的指令。
> 3. instance 會依照指令 build SQL，然後透過連線向資料庫 query，接著 parse 資料再回傳。

所以如果真的想要理解整個 Sequelize 運作，一開始就全域搜尋可能是個不太好的行為，這樣會讓 trace code 時失去整體脈絡。比較好的作法可能會是從建立 model 相關的 code 開始，因為我第一次 trace 的時候，就在 `queryInterface` 卡了很久，當無頭蒼蠅瞎找好久之後才找到要從哪裡下手。所幸 Sequelize 的原始碼大部分的命名與撰寫方式還是很好閱讀的，雖然我第一次看這麼龐大的物件導向原始碼，但是還是滿快就進入狀況。

原本我上一期就想要寫 Sequelize 怎麼 parse 資料，但是當我 trace code 到那兩行 comment 讓我直接放棄，不過經過 huli 的提醒發現怎麼去看 code 好像也是個值得寫的題材，於是乎就把我怎麼找 code 的過程記錄下來。

感謝 huli，感謝 error baker。
