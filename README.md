# 使用说明

仅适用于1.0版本的Laf

## Laf云函数使用

添加最新版nw-lafjs依赖后，在云函数引入

```js
import nw from 'nw-laf' 

export async function main(ctx: FunctionContext) {
  ...
```

## 数据库

### 1.新增单条数据(add)

支持自定义_id

```js
/**
 * add(单条记录)
 * @description 将单条对象数据插入到集合中
 * 注意:使用此函数添加的数据会自动加上_add_time(添加当前时间戳) 和 _add_time_str(当前时间字符串格式)
 * event 请求参数 说明
 * @param {string} dbName   表名
 * @param {object} dataJson  需要添加的数据(json格式)
 * @param {boolean} cancelAddTime  取消自动生成 _add_time 和 _add_time_str 字段
 * @returns {string|null} res 返回值为添加数据的id,添加失败,则返回null
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
```

### 2.批量新增多条数据(add)

支持自定义_id

```js
/**
 * adds(多条记录)
 * @description 将数组对象插入到集合中
 * @param {string} dbName   表名
 * @param {Array.<object>} dataJson  需要添加的数据(json数组格式)
 * @param {boolean} cancelAddTime  取消自动生成 _add_time 和 _add_time_str 字段
 * @returns {string|null} res 返回值为添加数据的id,添加失败,则返回null
 * @example
  res.id = await nw.db.adds({
    dbName:dbName,
    dataJson:[]
  });
  */
```

### 3.根据条件删除记录(del)

```js
/**
 * del(根据条件删除记录)
 * @description 批量删除符合条件的记录,可批量删除
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
```

### 4.根据条件批量修改记录(update)

```js
/**
 * update(根据条件修改记录)
 * @description 批量修改符合条件的记录,可批量修改
 * @param {string} dbName   表名
 * @param {object} whereJson 条件
 * @param {object} dataJson  需要修改的数据(json格式)
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
```

### 5.根据条件分页查询记录(select)

```js
/**
 * select(根据条件查询记录)
 * @description 根据条件查询记录
 * @param {string} dbName  表名
 * @param {boolean} getCount 是否获取符合条件的总数量,默认不获取
 * @param {number} pageIndex 第几页,默认第1页
 * @param {number} pageSize  每页显示数量，默认10条
 * @param {object} whereJson 条件
 * @param {object} fieldJson 字段显示规则,要么都为0,要么都为1
 * @param {Array.<object>} sortArr 排序规则 1升序 -1降序
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
```

### 6.万能联表查询(selects)

```js
/**
* selects(万能联表,多表连查)
* @params {Object} event 请求参数
* event 请求参数 说明
* @params {esm} cloud   (必填)lafjs-cloud
* @params {String} dbName   (必填)表名
* @params {Object} whereJson (可选)主表where条件
* @params {Number} pageIndex (可选,默认1)第几页
* @params {Number} pageSize  (可选,默认10)每页显示数量
* @params {Number} getCount  (可选,默认false)true返回关联查询前主表查询总数量,false返回rows的数量
* @params {Object} fieldJson (可选)主表字段显示规则,只能指定要返回的字段或者不要返回的字段
* @params {Array(Object)} sortArr (可选)主表排序规则
* @params {Array(Object)} foreignDB (可选)连表规则
* foreignDB 参数说明 数组内每一个对象代表一个连表规则
* @params {String} dbName (必填)副表表名
* @params {String} localKey (必填)主表外键名
* @params {String} foreignKey (必填)副表外键名
* @params {Number} limit (可选)关联查询的数量,1时为对象,大于1为数组
* @params {String} as  (必填)副表连表结果的别名
* @params {Object} whereJson  (可选)副表 where 条件
* @params {Object} fieldJson  (可选)副表字段显示规则
* @params {Array(Object)} sortArr  (可选)副表排序规则
* res 返回值
* @params {Number} code 0代表查询成功
* @params {Number} total getCount为true返回关联查询前主表查询总数量,false返回rows的数量
* @params {Array(Object)} rows 列表
* @params {Boolean} hasMore 分页需要 true 还有下一页 false 无下一页
* @params {Number} pageIndex 当前所在页数
* @params {Number} pageSize  每页显示数量
* 调用示例:
res = await nw.db.selects({
  cloud:cloud,
  dbName: "users",
  getCount: false,
  pageIndex: 1,
  pageSize: 10,
  // 主表where条件
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
      dbName: "order",//副表order
      localKey:"_id",
      foreignKey: "user_id",
      as: "orderList",
      limit: 10,
      // 副表where条件
      whereJson: {},
      // 副表字段显示规则
      fieldJson: {},
      // 副表排序规则
      sortArr: [{ "name": "time","type": "desc" }],
    },
    {
      dbName: "vip",//副表vip
      localKey:"_id",
      foreignKey: "user_id",
      as: "vipInfo",
      limit: 1,
    }
  ]
});
*/
```

### 7、根据whereJson查询对象(findByWhereJson)

不能分页，分页请用select

```js
/**
 * findByWhereJson
 * @description 根据whereJson查询对象
 * @param {string} dbName  表名
 * @param {object} fieldJson 字段显示规则
 * @param {object} whereJson 查询条件
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
```

### 8、根据 _id 查询记录(findById)

```js
/**
 * findById
 * @description 根据 _id 查询记录
 * @params {String} dbName  表名
 * @params {String} id   id
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
```

### 9.根据条件查询记录数量(count)

```js
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
```

### 10.根据条件求和(sum)

```js
/**
 * sum(根据条件求和)
 * @description 根据条件求和
 * 注意:
 * 1.字段必须是数值类型
 * 2.若数据条数大于10万以上,可能会有问题
 * @param {string} dbName  表名
 * @param {string} fieldName   需求求和的字段名(比如是数值类型的字段)
 * @param {object} whereJson 条件
 * @returns {number|null} res 返回值，失败返回null
 * @example
  res = await nw.db.sum({
   dbName:dbName,
   fieldName:"money",
    whereJson:{
     _add_time: _.gte(time).lte(time + 1000),
   }
  });
 */
```

### 11.根据条件求平均值(avg)

```js
/**
 * avg(根据条件求平均值)
 * @description 根据条件求平均值
 * 注意:
 * 1.字段必须是数值类型
 * 2.若数据条数大于10万以上,可能会有问题
 * @param {string} dbName  表名
 * @param {string} fieldName   需求求和的字段名(比如是数值类型的字段)
 * @param {object} whereJson 条件
 * @returns {number|null} res 返回值，失败返回null
 * @example
  res = await nw.db.avg({
   dbName:dbName,
   fieldName:"money",
   whereJson:{
     _add_time: _.gte(time).lte(time + 1000),
   }
  });
 */
```

### 12.根据条件求最大值(max)

```js
/**
 * max(根据条件求最大值)
 * @description 根据条件求最大值
 * 注意:
 * 1.字段必须是数值类型
 * 2.若数据条数大于10万以上,可能会有问题
 * @param {string} dbName  表名
 * @param {string} fieldName   需求求和的字段名(比如是数值类型的字段)
 * @param {object} whereJson 条件
 * @returns {number|null} res 返回值，失败返回null
 * @example
  res = await nw.db.max({
   dbName:dbName,
   fieldName:"money",
   whereJson:{
      _add_time: _.gte(time).lte(time + 1000),
   }
  });
 */
```

### 13.根据条件求最小值(min)

```js
/**
 * min(根据条件求最小值)
 * @description 根据条件求最小值
 * 注意:
 * 1.字段必须是数值类型
 * 2.若数据条数大于10万以上,可能会有问题
 * @param {string} dbName  表名
 * @param {string} fieldName   需求求和的字段名(比如是数值类型的字段)
 * @param {object} whereJson 条件
 * @returns {number|null} res 返回值，失败返回null
 * @example
  res = await nw.db.min({
   dbName:dbName,
   fieldName:"money",
   whereJson:{
     _add_time: _.gte(time).lte(time + 1000),
   }
  });
 */
```

## 工具库

### 1、对象删除指定的字段,返回新的对象

```js
 /**
 * 对象删除指定的字段,返回新的对象
 * @param {Object} data  操作对象
 * @param {Array<String>} deleteKeys 需要删除的键名(数组形式)
 * @returns {Object} 返回新的对象
 * @example
 * nw.util.deleteObjectKeys({ name: "张三", age: 18 }, ["age"]);
 * // { name: "张三" }
 */
```

### 2、日期对象转字符串

```js
/**
 * 日期对象转字符串
 * @param {Date | number | string} date 需要转换的时间
 * @param {number} type 为0时格式为：2020-08-01 12:12:12 ， 为1时格式为:20200801121212
 * @returns {string} 返回字符串
 * @example
  nw.util.getFullTime(new Date(), 0);
  // 2020-08-01 12:12:12
  nw.util.getFullTime(new Date(), 1);
  // 20200801121212
  nw.util.getFullTime(1596278400000, 0);
  // 2020-08-01 12:12:12
  nw.util.getFullTime(1596278400000, 1);
  // 20200801121212
  nw.util.getFullTime("2020-08", 0);
  // 2020-08-01 12:12:12
  nw.util.getFullTime("2020-08", 1);
  // 20200801121212
  nw.util.getFullTime("2020-08-24", 0);
  // 2020-08-24 12:12:12
  nw.util.getFullTime("2020-08-24", 1);
  // 20200824121212
  nw.util.getFullTime("2020-08-24 12:12:12", 0);
  // 2020-08-24 12:12:12
  nw.util.getFullTime("2020-08-24 12:12:12", 1);
  // 20200824121212
 */
```

### 3、正则校验字符串类型

```js
/**
 * 正则校验字符串类型
 * @param {string} str 需要校验的字符串
 * @param {string} type 校验类型
 * @param {string} type mobile 手机号码
 * @param {string} type tel 座机
 * @param {string} type card 身份证
 * @param {string} type mobileCode 6位数字验证码
 * @param {string} type username 账号以字母开头，长度在6~18之间，只能包含字母、数字和下划线
 * @param {string} type pwd 密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
 * @param {string} type payPwd 6位数字支付密码
 * @param {string} type postal 邮政编码
 * @param {string} type QQ QQ号
 * @param {string} type money 金额(小数点2位)
 * @param {string} type email 邮箱
 * @param {string} type URL 网址
 * @param {string} type IP IP地址
 * @param {string} type date 格式为：2019-10-10 年-月-日的时间
 * @param {string} type time 格式为：12:00:00 小时:分钟:秒的时间
 * @param {string} type dateTime 格式为：2019-10-10 12:00:00 年-月-日 小时:分钟:秒的时间
 * @param {string} type number 数字
 * @param {string} type english 英文
 * @param {string} type chinese 中文
 * @param {string} type lower 小写
 * @param {string} type upper 大写
 * @param {string} type HTML HTML标记
 * @returns {boolean} 返回布尔值
 * @example
  nw.util.checkStr("123456", "mobile");
  // false
 */
```

### 4、金额转换器

```js
/**
* 金额转换器
* @description 分转换为元
* @param n 金额
* @returns 转换后的金额
* @example
 nw.util.priceFilter(100)
*/
```

### 5、对象属性拷贝(浅拷贝)

```js
/**
 * 对象属性拷贝(浅拷贝)
 * @description 将 obj2 的属性赋值给 obj1 (如果obj1中有对应的属性,则会被obj2的属性值覆盖)
 * @param {object} obj1
 * @param {object} obj2
 * @returns {object} 返回一个新的对象
 * @example
  nw.util.objectAssign({a:1,b:2},{b:3,c:4})
  // {a:1,b:3,c:4}
  nw.util.objectAssign({a:1,b:2},{b:3,c:4}) === {a:1,b:3,c:4}
  // false
 */
```

### 6、复制一份对象

```js
 /**
 * 复制一份对象-没有映射关系
 * @description 主要用于解除映射关系
 * @param {object} obj
 * @returns {object} 返回一个新的对象
 * @example
  nw.util.copyObject({a:1,b:2})
  // {a:1,b:2}
  nw.util.copyObject({a:1,b:2}) === {a:1,b:2}
  // false
  nw.util.copyObject({a:1,b:2}) == {a:1,b:2}
  // false
  nw.util.copyObject({a:1,b:2}) === nw.util.copyObject({a:1,b:2})
  // false
 */
```

### 7、将字符串格式的时间转为时间戳

```js
/**
 * 将字符串格式的时间转为时间戳
 * @description 传入的时间格式为:2020-08-08 12:12:12
 * @param {string} dateString
 * @returns {number} 返回一个时间戳
 * @example
  nw.util.toTimeLong("2020-08-08 12:12:12")
  // 1596862732000
 */
```

### 8、两个(元素为对象)的数组合并,并去除重复的数据

```js
/**
 * 两个(元素为对象)的数组合并,并去除重复的数据
 * @description 两个数组合并,并去除重复的数据
 * @param {Array} arr1 第一个数组(arr1和aar2没有顺序要求)
 * @param {Array} aar2 第二个数组
 * @param {String} flag 判断标识,默认用id来判断,若flag传-1,代表不去除重复数据
 * @returns {Array} 返回一个新的数组
 * @example
  nw.util.arr_concat([{id:1,name:"张三"},{id:2,name:"李四"}],[{id:2,name:"李四"},{id:3,name:"王五"}])
  // [{id:1,name:"张三"},{id:2,name:"李四"},{id:3,name:"王五"}]
 */
```

### 9、字符串路径找对象的属性值

```js
/**
 * 字符串路径找对象的属性值
 * @description 自动根据字符串路径获取对象中的值支持.和[] , 且任意一个值为undefined时,不会报错,会直接返回undefined
 * @param {object} dataObj
 * @param {string} name
 * @returns {any} 返回一个新的数组
 * @example
  nw.util.getData({a:{b:{c:1}}},"a.b.c")
  // 1
 */
```

### 10、字符串路径设置对象的属性值

```js
/**
 * 字符串路径设置对象的属性值
 * @description 自动根据字符串路径设置对象中的值 支持.和[]
 * @param {object} dataObj
 * @param {string} name
 * @param {any} object
 * @example
  nw.util.setData({a:{b:{c:1}}},"a.b.c",2)
  // {a:{b:{c:2}}}
  nw.util.setData({a:{b:{c:1}}},"a.b.c[0]",2)
  // {a:{b:{c:[2]}}}
 */
```

### 11、检测任意参数是否为空

```js
/**
 * 检测任意参数是否为空
 * @description 检测参数是否为空 其中 undefined、null、{}、[]、"" 均为空值 ,不要传布尔值
 * @param {any} value
 * @example
  nw.util.isNull(value);
 */
```

### 12、检测任意参数是否无值

```js
/**
 * 检测任意参数是否无值
 * @description 检测参数是否无值 结果与 nw.util.isNull 相反
 * @param {any} value
 * @returns {boolean}
 * @example
  nw.util.isNotNull(value);
  // true
  nw.util.isNotNull(undefined);
  // false
 */
```

### 13、检测所有参数 - 是否全部不为空

```js
/**
 * 检测所有参数 - 是否全部不为空
 * @param {any} strS 传多个参数
 * @returns {boolean}
 * @example
  nw.util.isNotNullAll(value1,value2,value3);
  // true
  nw.util.isNotNullAll(value1,value2,undefined);
  // false
  nw.util.isNotNullAll(value1,value2,"");
  // false
  nw.util.isNotNullAll(value1,value2,[]);
  // false
  nw.util.isNotNullAll(value1,value2,{});
  // false
  nw.util.isNotNullAll(value1,value2,null);
  // false
 */
```

### 14、检测所有参数 - 是否全部为空

```js
/**
 * 检测所有参数 - 是否全部为空
 * @param {any} strS 传多个参数
 * @returns {boolean}
 * @example
  nw.util.isNullAll(value1,value2,value3);
  // false
  nw.util.isNullAll(value1,value2,undefined);
  // true
  nw.util.isNullAll(value1,value2,"");
  // true
  nw.util.isNullAll(value1,value2,[]);
  // true
  nw.util.isNullAll(value1,value2,{});
  // true
  nw.util.isNullAll(value1,value2,null);
  // true
 */
```

### 15、检测所有参数 - 是否全部都不为空

```js
/**
 * 检测所有参数 - 是否全部都不为空
 * @param {any} strS 传多个参数
 * @returns {boolean}
 * @example
  nw.util.isNotNullAll(value1,value2,value3);
  // true
  nw.util.isNotNullAll(value1,value2,undefined);
  // false
  nw.util.isNotNullAll(value1,value2,"");
  // false
  nw.util.isNotNullAll(value1,value2,[]);
  // false
  nw.util.isNotNullAll(value1,value2,{});
  // false
  nw.util.isNotNullAll(value1,value2,null);
  // false
 */
```

### 16、获取对象数组中的某一个item,根据指定的键值

```js
/**
 * 获取对象数组中的某一个item,根据指定的键值
 * @param {Array} list 对象数组
 * @param {string} key 键
 * @param {string} value 值
 * @returns {Object} item
 * @example
  nw.util.getListItem([{"_id": "001"},{"_id": "002"}], "_id", "001");
  // {"_id": "001"}
 */
```

### 17、数组操作 - 将对象数组转成json

```js
/**
 * 数组操作 - 将对象数组转成json
 * @param {Array} list 对象数组
 * @param {string} key 键
 * @returns {Object} json
 * @example
  如[{"_id":"001","name":"name1","sex":1},{"_id":"002","name":"name2","sex":2}]
  转成
  {"001",{"_id":"001","name":"name1","sex":1},"002":{"_id":"002","name":"name2","sex":2}}
  nw.util.listToJson(list, "_id");
 */
```

### 18、产生指定位数的随机数

```js
/**
 * 产生指定位数的随机数
 * @param {number} length 长度
 * @param {string} str 随机数的字符集 "a-z,A-Z,0-9"
 * @returns {string} 随机数
 * @example
  nw.util.random(6);
  nw.util.random(6, "a-z,0-9");
  nw.util.random(6, "A-Z,0-9");
  nw.util.random(6, "a-z,A-Z,0-9");
 */
```

### 19、将字符串id转化为指定位数的纯数字字符串id(会重复)

```js
/**
 * 将字符串id转化为指定位数的纯数字字符串id(会重复)
 * @param {string} str 字符串id
 * @param {number} length 长度
 * @returns {string} 纯数字字符串id
 * @example
  nw.util.stringIdToNumberId(uid,6);
 */
```

### 20、计算运费

```js
 /**
 * 计算运费
 * @param {Object} freightsItem 运费模板
 * @param {number} weight 重量
 * @returns {number} 运费
 * @example
  freightsItem 运费模板
 {
     first_weight Integer 首重 单位KG,
    first_weight_price Integer 首重 首重价格
    continuous_weight Integer  续重 单位KG
    continuous_weight_price Integer 续重价格 单位分 100 = 1元
    max_weight Integer 重量达到此值时,会多计算首重的价格,并少一次续重的价格 倍乘(相当于拆分多个包裹)
  }
 weight 运费重量
 nw.util.calcFreights(freightsItem, weight);
*/
```

### 21、判断B常量数组是否至少有一个元素在A常量数组中存在(两数组有交集)

```js
/**
 * 判断B常量数组是否至少有一个元素在A常量数组中存在(两数组有交集)
 * @param {Array} arr1 常量数组
 * @param {Array} arr2 常量数组
 * @returns {boolean} 是否有交集
 * @example
  nw.util.checkArrayIntersection(arr1, arr2);
 */
```

### 22、判断arr是否为一个数组，返回一个bool值

```js
 /**
 * 判断arr是否为一个数组，返回一个bool值
 * @param {Array} arr
 * @returns {boolean} 是否为数组
 * @example
  nw.util.isArray(arr);
 */
```

### 23、深度克隆

```js
/**
 * 深度克隆
 * @param {object} obj
 * @returns {object} 克隆后的对象
 * @example
  nw.util.deepClone(obj);
 */
```

### 24、数组结构转树形结构

```js
/**
   * 数组结构转树形结构
   * @param {Array} originalArrayData 原始数组
   * @param {Object} treeProps 转换树形结构的属性
   * @returns {Array} 转换后的树形结构
   * @example
  nw.util.arrayToTree(arrayData,{
    id: "id",  // 自己的id字段,必填
    parent_id: "pid", // 父级id字段,必填
    children : "children", // 转换树形结构后的子级的属性值,可选,不填默认children
    need_field : ["title"] // 除id、parent_id、children外显示的属性,可选,不填默认全部显示
  });
  */
```

### 25、最简单数组去重法

```js
/**
 * 最简单数组去重法
 * @param {Array} array
 * @returns {Array} 去重后的数组
 * @example
  nw.util.uniqueArr(array);
 */
```

### 26、将树形结构转成数组结构

```js
/**
 * 将树形结构转成数组结构
 * @param {Array} treeData  数据源
 * @param {Object} treeProps 树结构配置 { id : "menu_id", children : "children" }
 * @returns {Array} 转换后的数组
 * @example
  nw.util.treeToArray(treeData,{
    id : "menu_id", // 自己的id字段,必填
    parent_id : "parent_id", // 父级id字段,必填
    children : "children", // 转换树形结构后的子级的属性值,可选,不填默认children
  });
 */
```
