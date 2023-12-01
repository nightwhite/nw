import cloud from "@lafjs/cloud";
import { ObjectId } from 'mongodb';
const db = cloud.database();
const _ = db.command;
const $ = _.aggregate;

const timeOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

interface DataJson {
  _add_time?: number;
  _add_time_str?: string;
  [key: string]: any; // 允许添加任意属性
}

type DataJsonArray = DataJson[];

interface ForeignDB {
  dbName: string;
  foreignKey: string;
  localKey: string;
  localKeyType?: string;
  as: string;
  limit: number;
  whereJson?: object;
  fieldJson?: object;
  sortArr?: Array<{ name: string; type?: string }>;
}

const Dao = {
  /**
   * add(单条记录)
   * @description 将单条对象数据插入到集合中
   * 注意：使用此函数添加的数据会自动加上_add_time(添加当前时间戳) 和 _add_time_str(当前时间字符串格式)
   * event 请求参数 说明
   * @param {string} dbName  	表名
   * @param {object} dataJson  需要添加的数据 (json 格式)
   * @param {boolean} cancelAddTime  取消自动生成 _add_time 和 _add_time_str 字段
   * @returns {string|null} res 返回值为添加数据的 id，添加失败，则返回 null
   * @example 
    res.id = await nw.db.add({
      dbName:dbName,
      dataJson:{
        "_id": "1",
        "money": 1,
        "kehuid": "001"
      },
      cancelAddTime : true
    });
    console.log(JSON.stringify(res))
    */
  add: async ({
    cancelAddTime,
    dbName,
    dataJson,
  }: {
    cancelAddTime?: boolean;
    dbName: string;
    dataJson: DataJson;
  }) => {
    // 数据库查询开始----------------------------------------------------------
    if (!dataJson._add_time && !cancelAddTime) {
      const date = new Date();
      dataJson._add_time = date.getTime();
      dataJson._add_time_str = date.toLocaleString("zh-CN", timeOptions);
    }
    if (!dataJson._id){
      const res = await db.collection(dbName).add(dataJson);
      return res.id ? res.id : null;
    }else{
      dataJson._id = dataJson._id.toString();
      const res = await cloud.mongo.db.collection(dbName).insertOne(dataJson);
      return res.insertedId ? res.insertedId : null;
    }
    // 数据库查询结束----------------------------------------------------------
  },

  /**
   * adds(多条记录)
   * @description 将数组对象插入到集合中
   * @param {string} dbName   表名
   * @param {Array.<object>} dataJson  需要添加的数据 (json 数组格式)
   * @param {boolean} cancelAddTime  取消自动生成 _add_time 和 _add_time_str 字段
   * @returns {string|null} res 返回值为添加数据的 id，添加失败，则返回 null
   * @example
    res.id = await nw.db.adds({
      dbName:dbName,
      dataJson:[]
    });
    */
  adds: async ({
    dbName,
    dataJson,
    cancelAddTime,
  }: {
    cancelAddTime?: boolean;
    dbName: string;
    dataJson: DataJsonArray;
  }): Promise<number | null> => {
    // 数据库查询开始----------------------------------------------------------
    const date = new Date();
    const _add_time = date.getTime();
    const _add_time_str = date.toLocaleString("zh-CN", timeOptions);
    let arr:any; // 不带 ID 的数据
    for (const i in dataJson) {
      if (
        !dataJson[i]._add_time &&
        (typeof cancelAddTime === "undefined" || !cancelAddTime)
      ) {
        dataJson[i]._add_time = _add_time;
        dataJson[i]._add_time_str = _add_time_str;
      }
      // 如果有_id，则转换为字符串
      if (dataJson[i]._id) {
        dataJson[i]._id = dataJson[i]._id.toString();
      }
      arr.push(dataJson[i]);
    }
    const res = await cloud.mongo.db.collection(dbName).insertMany(arr);
    const arr_num = res.insertedCount;
    return arr_num;
    // 数据库查询结束----------------------------------------------------------
  },

  /**
   * del(根据条件删除记录)
   * @description 批量删除符合条件的记录，可批量删除
   * @param {string} dbName   表名
   * @param {object} whereJson 条件
   * @returns {number} res 返回值为删除的记录数量
   * @example
    res.num = await nw.db.del({
      dbName:dbName,
      whereJson:{
        _id:"1"
      }
    });
  */
  del: async ({ dbName, whereJson }: { dbName: string; whereJson: object }) => {
    // 数据库查询开始----------------------------------------------------------
    let num = 0;
    if (whereJson && JSON.stringify(whereJson) !== "{}") {
      const res: any = await db
        .collection(dbName)
        .where(whereJson)
        .remove({ multi: true });
      if (res) {
        num = res.deleted;
      } else {
        console.error(res.errMsg);
        num = -1;
      }
    } else {
      console.error("whereJson 条件不能为空");
    }
    return num;
    // 数据库查询结束----------------------------------------------------------
  },

  /**
   * update(根据条件修改记录)
   * @description 批量修改符合条件的记录，可批量修改
   * @param {string} dbName   表名
   * @param {object} whereJson 条件
   * @param {object} dataJson  需要修改的数据 (json 格式)
   * @returns {number} res 返回值为修改的记录数量
   * @example
    res.num = await nw.db.update({
      dbName:dbName,
      whereJson:{
        _add_time: _.gte(time).lte(time + 1000),
      },
      dataJson:{
        kehuid:"001"
      }
    });
    */
  update: async ({
    dbName,
    whereJson,
    dataJson,
  }: {
    dbName: string;
    whereJson: object;
    dataJson: object;
  }) => {
    // 数据库查询开始----------------------------------------------------------
    let num = 0;
    if (whereJson && JSON.stringify(whereJson) !== "{}") {
      const res: any = await db
        .collection(dbName)
        .where(whereJson)
        .update(dataJson, { multi: true });
      if (res) {
        num = res.updated;
      } else {
        console.error((res as any).errMsg);
        num = -1;
      }
    } else {
      console.error("whereJson 条件不能为空");
    }
    return num;
    // 数据库查询结束----------------------------------------------------------
  },

  /**
   * select(根据条件查询记录)
   * @description 根据条件查询记录
   * @param {string} dbName  表名
   * @param {boolean} getCount 是否获取符合条件的总数量，默认不获取
   * @param {number} pageIndex 第几页，默认第 1 页
   * @param {number} pageSize  每页显示数量，默认 10 条
   * @param {object} whereJson 条件
   * @param {object} fieldJson 字段显示规则，要么都为 0，要么都为 1
   * @param {Array.<object>} sortArr 排序规则 asc 升序 desc 降序
   * @returns {object} res 返回值
   * @returns {Array.<object>} res.rows 列表
   * @returns {boolean} res.hasMore 分页需要 true 还有下一页 false 无下一页
   * @returns {number} res.pageIndex 当前所在页数
   * @returns {number} res.pageSize  每页显示数量
   * @example
    res = await nw.db.select({
      dbName:dbName,
      getCount:true,
      pageIndex:1,
      pageSize:100,
      whereJson:{
        _add_time: _.gte(time).lte(time + 1000),
      },
      fieldJson:{
        _id:1,
        kehuid:1,
      },
      sortArr:[{
        _add_time:-1
      }]
    });
  */
  select: async ({
    dbName,
    whereJson,
    sortArr,
    fieldJson,
    pageSize = 10,
    pageIndex = 1,
    getCount = false,
  }: {
    dbName: string;
    whereJson?: object;
    sortArr?: { name: string; type: "asc" | "desc" }[];
    fieldJson?: object;
    pageSize?: number;
    pageIndex?: number;
    getCount?: boolean;
  }) => {
    if (!whereJson || JSON.stringify(whereJson) == "{}") {
      whereJson = { _id: _.neq("___") };
    }
    // 数据库查询开始----------------------------------------------------------
    pageSize = pageSize > 0 ? pageSize : 999999999;
    if (pageSize > 1000 || pageSize < 1) {
      // 若查询大于1000记录,则使用selectAll
      return await selectAll({
        dbName,
        whereJson,
        sortArr,
        fieldJson,
        pageSize,
        pageIndex,
        getCount,
      });
    }
    // 获取select对象开始-----------------------------------------------------------
    const selectDataObj = await getSelectData({
      dbName,
      whereJson,
      sortArr,
      fieldJson,
      pageSize,
      pageIndex,
      getCount,
    });
    let result: any = selectDataObj.result; // 结果集
    const hasMore = selectDataObj.hasMore; // 是否还有数据
    const total = selectDataObj.total; // 总记录数
    // 获取select对象结束-----------------------------------------------------------
    result = result.skip((pageIndex - 1) * pageSize).limit(pageSize);
    // 对查询结果排序开始-----------------------------------------------------------
    if (sortArr && JSON.stringify(sortArr) != "{}") {
      for (const i in sortArr) {
        const g = sortArr[i];
        const name = g.name;
        const type = g.type;
        result = result.orderBy(name, type);
      }
    }
    // 对查询结果排序结束-----------------------------------------------------------
    // 字段显示规则开始-----------------------------------------------------------
    if (fieldJson && JSON.stringify(fieldJson) != "{}") {
      result = result.field(fieldJson);
    }
    // 字段显示规则结束-----------------------------------------------------------
    const res = await result.get();
    const json: any = {
      rows: res.data,
      hasMore,
      total,
      code: 0,
      pageIndex,
      pageSize,
    };
    return json;
    // 数据库查询结束----------------------------------------------------------
  },

  /**
   * count(根据条件查询记录数量)
   * @description 根据条件查询记录数量
   * @param {string} dbName  表名
   * @param {object} whereJson 条件
   * @returns {number|null} res 返回值，失败返回null
   * @example
    res = await nw.db.count({
    dbName:dbName,
    whereJson:{
      _add_time: _.gte(time).lte(time + 1000),
    }
    });
  */
  count: async ({
    dbName,
    whereJson,
  }: {
    dbName: string;
    whereJson?: object;
  }) => {
    if (!whereJson || JSON.stringify(whereJson) == "{}") {
      whereJson = { _id: _.neq("___") };
    }
    // 数据库查询开始----------------------------------------------------------
    try {
      const res = await db.collection(dbName).where(whereJson).count(); // 集合总数
      return res.total; // 总记录数
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  /**
   * sum(根据条件求和)
   * @description 根据条件求和
   * 注意：
   * 1.字段必须是数值类型
   * 2.若数据条数大于 10 万以上，可能会有问题
   * @param {string} dbName  表名
   * @param {string} fieldName   需求求和的字段名 (比如是数值类型的字段)
   * @param {object} whereJson 条件
   * @returns {number|null} res 返回值，失败返回 null
   * @example
    res = await nw.db.sum({
    dbName:dbName,
    fieldName:"money",
      whereJson:{
      _add_time: _.gte(time).lte(time + 1000),
    }
    });
  */
  sum: async ({
    dbName,
    fieldName,
    whereJson,
  }: {
    dbName: string;
    fieldName: string;
    whereJson?: object;
  }) => {
    if (!whereJson || JSON.stringify(whereJson) == "{}") {
      whereJson = { _id: _.neq("___") };
    }
    // 数据库查询开始----------------------------------------------------------
    try {
      const res = await db
        .collection(dbName)
        .aggregate()
        .match(whereJson)
        // .skip(0)
        // .limit(100000)
        .group({
          _id: null,
          num: $.sum("$" + fieldName),
        })
        .end();
      return res.data[0].num;
    } catch (e) {
      console.error(e);
      return null;
    }
    // 数据库查询结束----------------------------------------------------------
  },

  /**
   * avg(根据条件求平均值)
   * @description 根据条件求平均值
   * 注意：
   * 1.字段必须是数值类型
   * 2.若数据条数大于 10 万以上，可能会有问题
   * @param {string} dbName  表名
   * @param {string} fieldName   需求求和的字段名 (比如是数值类型的字段)
   * @param {object} whereJson 条件
   * @returns {number|null} res 返回值，失败返回 null
   * @example
    res = await nw.db.avg({
    dbName:dbName,
    fieldName:"money",
    whereJson:{
      _add_time: _.gte(time).lte(time + 1000),
    }
    });
  */
  avg: async ({
    dbName,
    fieldName,
    whereJson,
  }: {
    dbName: string;
    fieldName: string;
    whereJson?: object;
  }) => {
    if (!whereJson || JSON.stringify(whereJson) == "{}") {
      whereJson = { _id: _.neq("___") };
    }
    // 数据库查询开始----------------------------------------------------------
    try {
      const res = await db
        .collection(dbName)
        .aggregate()
        .match(whereJson)
        .group({
          _id: null,
          num: $.avg("$" + fieldName),
        })
        .end();
      return res.data[0].num;
    } catch (e) {
      console.error(e);
      return null;
    }
    // 数据库查询结束----------------------------------------------------------
  },

  /**
   * max(根据条件求最大值)
   * @description 根据条件求最大值
   * 注意：
   * 1.字段必须是数值类型
   * 2.若数据条数大于 10 万以上，可能会有问题
   * @param {string} dbName  表名
   * @param {string} fieldName   需求求和的字段名 (比如是数值类型的字段)
   * @param {object} whereJson 条件
   * @returns {number|null} res 返回值，失败返回 null
   * @example
    res = await nw.db.max({
    dbName:dbName,
    fieldName:"money",
    whereJson:{
        _add_time: _.gte(time).lte(time + 1000),
    }
    });
  */
  max: async ({
    dbName,
    fieldName,
    whereJson,
  }: {
    dbName: string;
    fieldName: string;
    whereJson?: object;
  }) => {
    if (!whereJson || JSON.stringify(whereJson) == "{}") {
      whereJson = { _id: _.neq("___") };
    }
    // 数据库查询开始----------------------------------------------------------
    try {
      const res = await db
        .collection(dbName)
        .aggregate()
        .match(whereJson)
        .group({
          _id: null,
          num: $.max("$" + fieldName),
        })
        .end();
      return res.data[0].num;
    } catch (e) {
      console.error(e);
      return null;
    }
    // 数据库查询结束----------------------------------------------------------
  },

  /**
   * min(根据条件求最小值)
   * @description 根据条件求最小值
   * 注意：
   * 1.字段必须是数值类型
   * 2.若数据条数大于 10 万以上，可能会有问题
   * @param {string} dbName  表名
   * @param {string} fieldName   需求求和的字段名 (比如是数值类型的字段)
   * @param {object} whereJson 条件
   * @returns {number|null} res 返回值，失败返回 null
   * @example
    res = await nw.db.min({
    dbName:dbName,
    fieldName:"money",
    whereJson:{
      _add_time: _.gte(time).lte(time + 1000),
    }
    });
  */
  min: async ({
    dbName,
    fieldName,
    whereJson,
  }: {
    dbName: string;
    fieldName: string;
    whereJson?: object;
  }) => {
    if (!whereJson || JSON.stringify(whereJson) == "{}") {
      whereJson = { _id: _.neq("___") };
    }
    // 数据库查询开始----------------------------------------------------------
    try {
      const res = await db
        .collection(dbName)
        .aggregate()
        .match(whereJson)
        .group({
          _id: null,
          num: $.min("$" + fieldName),
        })
        .end();
      return res.data[0].num;
    } catch (e) {
      console.error(e);
      return null;
    }
    // 数据库查询结束----------------------------------------------------------
  },

  /**
  * selects(万能联表，多表连查)
  * @description 万能联表，多表连查
  * @param {string} dbName  	主表名
  * @param {boolean} getCount   是否获取总条数
  * @param {number} pageIndex   页码
  * @param {number} pageSize   每页条数
  * @param {object} whereJson   主表 where 条件
  * @param {object} fieldJson   主表字段显示规则
  * @param {array} sortArr   主表排序规则
  * @param {array} foreignDB   副表列表
  * @returns {object|null} res 返回值，失败返回 null
  * @example
  res = await nw.baseDao.selects({
    dbName: "uni-id-users",
    getCount: false,
    pageIndex: 1,
    pageSize: 10,
    // 主表 where 条件
    whereJson: {

    },
    // 主表字段显示规则
    fieldJson: {
      token: false,
      password: false,
    },
    // 主表排序规则
    sortArr: [{ "name": "_id","type": "desc" }],
    // 副表列表
    foreignDB: [
      {
        dbName: "order",
        localKey:"_id",
        foreignKey: "user_id",
        as: "orderList",
        limit: 10,
        // 副表 where 条件
        whereJson: {},
        // 副表字段显示规则
        fieldJson: {},
        // 副表排序规则
        sortArr: [{ "name": "time","type": "desc" }],
      },
      {
        dbName: "vip",
        localKey:"_id",
        foreignKey: "user_id",
        as: "vipInfo",
        limit: 1, // 当 limit = 1 时，以对象形式返回，否则以数组形式返回
      }
    ]
  });
  */
  selects: async function ({
    dbName,
    whereJson = {},
    pageIndex = 1,
    pageSize = 10,
    getCount = false,
    sortArr = [],
    fieldJson = {},
    foreignDB = [],
    lastWhereJson = {},
    lastSortArr = []
  }: {
    dbName: string;
    whereJson?: object;
    pageIndex?: number;
    pageSize?: number;
    getCount?: boolean;
    sortArr?: Array<object>;
    fieldJson?: object;
    foreignDB?: ForeignDB[];
    lastWhereJson?: object;
    lastSortArr?: Array<object>;
  }) {
    // 获取全部的 as
    let ass: any = [];
    for (const l in foreignDB) {
      const { as } = foreignDB[l];
      ass.push(as);
    }
    // 数据库 API 开始----------------------------------------------------------
    if (JSON.stringify(whereJson) === "{}") {
      whereJson = {
        _id: _.neq("___"),
      };
    }
    if (pageSize == -1) {
      pageIndex = 1;
      pageSize = 999999999;
      getCount = false;
    }
    let total = 0;
    let hasMore = false; // 提示前端是否还有数据

    if (getCount) {
      const countResult = await db.collection(dbName).where(whereJson).count(); // 集合总数
      total = countResult.total; // 总记录数
      const totalPage = Math.ceil(total / pageSize);
      if (pageIndex < totalPage) {
        hasMore = true;
      }
    }
    const res: any = {};
    let result: any = db.collection(dbName).aggregate();
    // 主表where条件
    if (whereJson && JSON.stringify(whereJson) !== "{}") {
      result = result.match(whereJson);
    }
    // 主表字段显示规则
    if (fieldJson && JSON.stringify(fieldJson) !== "{}") {
      result = result.project(fieldJson);
    }
    // 主表排序规则
    if (sortArr && JSON.stringify(sortArr) !== "[]") {
      const sortJson: any = {};
      for (const i in sortArr) {
        const g: any = sortArr[i];
        const name = g.name;
        let type = g.type;
        if (type == undefined || type == "" || type == "asc") {
          type = 1;
        } else {
          type = -1;
        }
        sortJson[name] = type;
      }
      result = result.sort(sortJson);
    }
    // 分页数据
    result = result.skip((pageIndex - 1) * pageSize).limit(pageSize);
    // 连表开始-----------------------------------------------------------
    for (const i in foreignDB) {
      let {
        dbName,
        foreignKey,
        localKey,
        localKeyType = null,
        as,
        limit,
        whereJson,
        fieldJson,
        sortArr,
      } = foreignDB[i];
      if (!as) as = dbName;
      let pipelineJson: any = $.pipeline().match(
        _.expr($.and([$.eq(["$" + foreignKey, "$$localKey" + localKey])]))
      );
      // 如果关联主键是数组
      if(localKey && localKeyType == "array"){
        pipelineJson = $.pipeline().match(
          _.expr($.in(["$" + foreignKey, "$$localKey" + localKey]))
        );
      }
      // 副表where条件
      if (whereJson && JSON.stringify(whereJson) !== "{}") {
        pipelineJson = pipelineJson.match(whereJson);
      }
      // 副表限制查询条数,若值为1,则返回的是对象,否则返回的是数组
      if (limit) {
        pipelineJson = pipelineJson.limit(limit);
      }
      // 副表字段显示规则
      if (fieldJson && JSON.stringify(fieldJson) !== "{}") {
        pipelineJson = pipelineJson.project(fieldJson);
      }
      // 副表排序规则
      if (sortArr && JSON.stringify(sortArr) !== "[]") {
        const sortJson: any = {};
        for (const i in sortArr) {
          const sortItem = sortArr[i];
          const name = sortItem.name;
          let type: any = sortItem.type;
          if (type == undefined || type == "" || type == "asc") {
            type = 1; // 升序
          } else {
            type = -1; // 降序
          }
          sortJson[name] = type;
        }
        pipelineJson = pipelineJson.sort(sortJson);
      }
      pipelineJson = pipelineJson.done();
      const letJson: any = {};
      letJson["localKey" + localKey] = "$" + localKey;
      const lookupJson = {
        from: dbName,
        let: letJson,
        pipeline: pipelineJson,
        as: as,
      };
      result = result.lookup(lookupJson);
    }
    // 连表结束-----------------------------------------------------------
    
    // 处理 lastWhereJson
    if (lastWhereJson && JSON.stringify(lastWhereJson) !== "{}") {
        result = result.match(lastWhereJson);
    }
    
    // 在此处添加 lastSortArr 的处理
    // lastSortArr 排序规则
    if (lastSortArr && JSON.stringify(lastSortArr) !== "[]") {
      const sortJson: any = {};
      for (const i in lastSortArr) {
        const sortItem: any = lastSortArr[i];
        const name = sortItem.name; 
        let type: any = sortItem.type;
        if (type === undefined || type === "" || type === "asc") {
          type = 1; // 升序
        } else {
          type = -1; // 降序
        }
        sortJson[name] = type;
      }
      result = result.sort(sortJson);
    }
    
    // 获取结果
    result = await result.end();
    let rows: any = result.data;
    for (const i in rows) {
      for (const j in foreignDB) {
        const { as, limit }: { as?: any; limit?: any } = foreignDB[j];
        if (limit === 1) {
          if (rows[i][as] && rows[i][as].length > 0) {
            rows[i][as] = rows[i][as][0];
          } else {
            rows[i][as] = {};
          }
        }
      }
    }
   
    for (const ii in rows) {
      for (const jj in foreignDB) {
        const { as }: { as?: any } = foreignDB[jj];
        if (Array.isArray(rows[ii][as]) && rows[ii][as].length === 0) {
           //去掉都为 [] 的了连表数据
          delete result.data[ii][as];
        } else {
          rows = rows.filter((data: any) => {
            var NeedDelNum = [];
            for (let iii in ass) {
              let as = ass[iii];
              if (data[as].length == 0) {
                NeedDelNum.push(iii);
              }
              if (NeedDelNum.length == ass.length) {
                return false;
              }
            }
            return true;
          });
        }
      }
    }
    ass = [];
    res.code = 0;
    if (getCount) {
      res.hasMore = hasMore;
      res.total = total;
    } 
    res.rows = rows; // 两表连接合并后的数据
    return res;
    // 数据库 API 结束----------------------------------------------------------
  },

  /**
   * findByWhereJson
   * @description 根据 whereJson 查询对象
   * @param {string} dbName  	表名
   * @param {object} fieldJson 字段显示规则
   * @param {object} whereJson 查询条件
   * @param {Array.<object>} sortArr 排序规则 asc 升序 desc 降序
   * @returns res 返回值为单行记录
   * @example
    res = await nw.db.findByWhereJson({
      dbName:"users",
      fieldJson:{
        token:0,
        password:0,
      },
      whereJson:{
        nickname:"nw"
      }
    });
   */
  findByWhereJson: async ({
    dbName,
    whereJson,
    sortArr,
    fieldJson,
  }: {
    dbName: string;
    whereJson?: object;
    sortArr?: { name: string; type: "asc" | "desc" }[];
    fieldJson?: object;
  }) => {
    // 数据库查询开始----------------------------------------------------------
    try {
      if (whereJson && JSON.stringify(whereJson) != "{}") {
        let result: any = db.collection(dbName).where(whereJson);
        // 对查询结果排序开始-----------------------------------------------------------
        if (sortArr && JSON.stringify(sortArr) != "{}") {
          for (const i in sortArr) {
            const g = sortArr[i];
            const name = g.name;
            const type = g.type;
            result = result.orderBy(name, type);
          }
        }
        // 对查询结果排序结束-----------------------------------------------------------
        // 字段显示规则开始-----------------------------------------------------------
        if (fieldJson && JSON.stringify(fieldJson) != "{}") {
          result = result.field(fieldJson);
        }
        // 字段显示规则结束-----------------------------------------------------------
        const res = await result.limit(1).get();

        if (res.data && res.data.length > 0) {
          return res.data[0];
        } else {
          return null;
        }
      } else {
        console.error("whereJson 条件不能为空");
      }
    } catch (e) {
      console.error(e);
      return null;
    }
    // 数据库查询结束-----------------------------------------------------------
  },

  /**
   * findListByWhereJson
   * @description 根据 whereJson 查询多条记录（不分页）
   * @param {string} dbName  	表名
   * @param {object} fieldJson 字段显示规则
   * @param {object} whereJson 查询条件
   * @param {Array.<object>} sortArr 排序规则 asc 升序 desc 降序
   * @returns res 返回值为多行记录
   * @example
    res = await nw.db.findListByWhereJson({
      dbName:"users",
      fieldJson:{
        token:0,
        password:0,
      },
      whereJson:{
        nickname:"nw"
      }
    });
   */
  findListByWhereJson: async ({
    dbName,
    whereJson,
    sortArr,
    fieldJson,
  }: {
    dbName: string;
    whereJson?: object;
    sortArr?: { name: string; type: "asc" | "desc" }[];
    fieldJson?: object;
  }) => {
    // 数据库查询开始----------------------------------------------------------
    try {
      if (whereJson && JSON.stringify(whereJson) != "{}") {
        let result: any = db.collection(dbName).where(whereJson);
        // 对查询结果排序开始-----------------------------------------------------------
        if (sortArr && JSON.stringify(sortArr) != "{}") {
          for (const i in sortArr) {
            const g = sortArr[i];
            const name = g.name;
            const type = g.type;
            result = result.orderBy(name, type);
          }
        }
        // 对查询结果排序结束-----------------------------------------------------------
        // 字段显示规则开始-----------------------------------------------------------
        if (fieldJson && JSON.stringify(fieldJson) != "{}") {
          result = result.field(fieldJson);
        }
        // 字段显示规则结束-----------------------------------------------------------
        const res = await result.get();

        if (res.data && res.data.length > 0) {
          return res.data;
        } else {
          return null;
        }
      } else {
        console.error("whereJson 条件不能为空");
      }
    } catch (e) {
      console.error(e);
      return null;
    }
    // 数据库查询结束-----------------------------------------------------------
  },

  /**
   * 根据 _id 查询记录
   * @description 根据 _id 查询记录
   * @params {String} dbName  	表名
   * @params {String} id   			id
   * @params {Object} fieldJson 字段显示规则 只能指定要返回的字段或者不要返回的字段
   * @returns res 返回值为单行记录
   * @example
   res = await nw.db.findById({
      dbName:dbName,
      id:_id,
      fieldJson: {
        _id: 0,
        name: 0,
      },
    });
   */
  findById: async ({
    dbName,
    id,
    fieldJson,
  }: {
    dbName: string;
    id: string;
    fieldJson?: object;
  }) => {
    // 数据库查询开始----------------------------------------------------------
    try {
      let result: any = db.collection(dbName).doc(id);
      if (fieldJson) {
        result = result.field(fieldJson);
      }
      const res = await result.get();
      // return res.data[0];
      return res.data;
    } catch (e) {
      console.error(e);
      return null;
    }
    // 数据库查询结束-----------------------------------------------------------
  },
   /**
   * 根据根据数组对象批量更新
   * @description 根据 根据数组对象批量更新
   * @param {string} dbName  	表名
   * @param {array} dataArr  	数据数组
   * @param {boolean} upsert  	没找到符合条件的是否自动插入一条新数据
   * @param {string} id  	查询条件
   * @returns res 更新结果
   * @example
  res = await nw.db.updateMany({
    dbName:dbName,
    dataArr: [
      {
      _id: "5f7b9b9b5f9b9b0001e8b1a1",
      name: "nw",
      },
      {
        _id: "5f7b9b9b5f9b9b0001e8b1a2",
        name: "nw",
      },
    ],
    id: "_id", // 如果是别的字段，可以自己指定，如 id: "name"
    upsert: true, //默认为 false
  });
  */
  updateMany: async ({  
    dbName,
    dataArr,
    upsert = false,
    id,
  }: {
    dbName: string;
    dataArr: Array<any>;
    upsert?: boolean;
    id: string;
  }) => {
    // 数据库查询开始----------------------------------------------------------
    try {
      console.log(id);
      const bulkOps = dataArr.reduce((ops, obj) => {
        const update: any = {};
        Object.keys(obj).forEach(key => {
          if (key !== '_id') {
            update[key] = obj[key];
          } else {
            update['_id'] = obj[key].toString();
          }
        });
        delete update._id;
        const updateWithoutId = Object.assign({}, update);
        ops.push({
          updateOne: {
            filter: { [id]: obj[id] },
            update: { $set: updateWithoutId },
            upsert: upsert,
          },
        });
        return ops;
      }, []);
  
      const result = await cloud.mongo.db.collection(dbName).bulkWrite(bulkOps);
      return result
    }
    catch (e) {
      console.error(e);
      return null;
    }
    // 数据库查询结束-----------------------------------------------------------
  }

};

export default Dao;

// 封装 selectAll 分次获取全部数据 每次 1000 条
async function selectAll(event: any) {
  const dbName = event.dbName; // 表名
  const json: any = {};
  // 数据库查询开始----------------------------------------------------------
  const MAX_LIMIT = 1000; // 最大一次获取 1000 条数据

  let pageSize = event.pageSize ? event.pageSize : 10; // 默认 10 条数据
  pageSize = pageSize > 0 ? pageSize : 999999999;

  // 获取 select 对象开始-----------------------------------------------------------
  const selectDataObj = await getSelectData(event);
  const {
    result, // 结果集
    hasMore, // 是否还有数据
    total, // 总记录数
    getCount, // 是否需要分页
    pageIndex, // 当前页码
  } = selectDataObj;
  // 获取 select 对象结束-----------------------------------------------------------

  // 计算需分几次获取数据
  let t1 = total;
  if (pageSize < total) {
    t1 = pageSize;
  }
  const batchTimes = Math.ceil(t1 / MAX_LIMIT);

  // 承载所有读操作的 promise 的数组
  const tasks = [];
  const n0 = (pageIndex - 1) * pageSize; // 数据起始值
  const n0_2 = n0 + pageSize;
  for (let i = 0; i < batchTimes; i++) {
    const n1 = n0 + i * MAX_LIMIT;
    let n2 = MAX_LIMIT;
    const n2_2 = n1 + MAX_LIMIT;
    if (n2_2 > n0_2) {
      n2 = n0_2 - n1;
    }
    const promise = result.skip(n1).limit(n2).get();
    tasks.push(promise);
  }
  // 等待所有
  let res: any = {};
  try {
    res = (await Promise.all(tasks)).reduce((acc: any, cur) => ({
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }));
  } catch (e) {
    console.error("selectAll-异常", event, e);
    res = {
      data: [],
    };
  }

  json.rows = res.data; // 总结果集
  json.code = 0; // 请求成功
  json.hasMore = hasMore; // 是否还有数据
  json.pageIndex = pageIndex;
  json.pageSize = pageSize;
  if (getCount) {
    json.total = total;
  } else {
    json.total = res.data ? res.data.length : 0;
  }
  return json;
  // 数据库查询结束----------------------------------------------------------
}

// 获取 select 需要的参数
async function getSelectData(event: any) {
  let { dbName, whereJson } = event;
  if (!whereJson || JSON.stringify(whereJson) == "{}") {
    whereJson = { _id: _.neq("___") };
  }
  // 封装数据参数开始----------------------------------------------------------
  let pageIndex = event.pageIndex ? event.pageIndex : 1; // 默认第一页开始
  let pageSize = event.pageSize ? event.pageSize : 10; // 默认 10 条数据
  let getCount = event.getCount ? event.getCount : false; // 是否获取总数量
  if (pageSize == -1) {
    pageIndex = 1;
    pageSize = 999999999;
    getCount = true;
  }
  const sortArr = event.sortArr; // 排序数组
  const fieldJson = event.fieldJson; // 需要返回的字段，若 field 不传，则默认返回全部字段
  let total = 0;
  let hasMore = false; // 提示前端是否还有数据
  // console.log("whereJson:",whereJson);
  if (getCount) {
    const countResult = await db.collection(dbName).where(whereJson).count(); // 集合总数
    total = countResult.total; // 总记录数
    const totalPage = Math.ceil(total / pageSize);
    if (pageIndex < totalPage) {
      hasMore = true;
    }
  }
  let result: any = db.collection(dbName);
  if (fieldJson) {
    result = result.field(fieldJson);
  }
  if (whereJson) {
    result = result.where(whereJson);
  }
  if (sortArr) {
    // 这里用数组形式是为了有序
    for (const i in sortArr) {
      const g = sortArr[i];
      const name = g.name;
      let type = g.type;
      if (type == undefined || type == "") {
        type = "asc";
      }
      result = result.orderBy(name, type);
    }
  }
  return {
    result: result, // 结果集
    dbName: dbName, // 数据库表名
    whereJson: whereJson, // 判断条件
    pageIndex: pageIndex, // 当前页码
    pageSize: pageSize, // 每页大小
    getCount: getCount, // 是否需要分页
    sortArr: sortArr, // 需要排序对象
    fieldJson: fieldJson, // 参数选择对象
    total: total, // 总记录数
    hasMore: hasMore, // 是否还有数据
  };
  // 封装数据参数结束----------------------------------------------------------
}
