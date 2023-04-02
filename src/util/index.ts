const util = {
  /**
   * 对象删除指定的字段,返回新的对象
   * @param {Object} data  操作对象
   * @param {Array<String>} deleteKeys 需要删除的键名(数组形式)
   * @returns {Object} 返回新的对象
   * @example
   * nw.util.deleteObjectKeys({ name: "张三", age: 18 }, ["age"]);
   * // { name: "张三" }
   */
  deleteObjectKeys: <T extends Record<string, any>>(
    data: T,
    deleteKeys: Array<keyof T> = []
  ) => {
    const newData = {} as Partial<T>;
    if (data) {
      for (const key in data) {
        if (deleteKeys.indexOf(key as keyof T) === -1) {
          newData[key] = data[key];
        }
      }
    }
    return newData;
  },

  /**
   * 日期对象转字符串
   * @param {Date | number | string} date 需要转换的时间
   * @param {number} type 为0时格式为：2020-08-01 12:12:12 ， 为1时格式为:20200801121212
   * @returns {string} 返回字符串
   * @example
   * nw.util.getFullTime(new Date(), 0);
   * // 2020-08-01 12:12:12
   * nw.util.getFullTime(new Date(), 1);
   * // 20200801121212
   * nw.util.getFullTime(1596278400000, 0);
   * // 2020-08-01 12:12:12
   * nw.util.getFullTime(1596278400000, 1);
   * // 20200801121212
   * nw.util.getFullTime("2020-08", 0);
   * // 2020-08-01 12:12:12
   * nw.util.getFullTime("2020-08", 1);
   * // 20200801121212
   * nw.util.getFullTime("2020-08-24", 0);
   * // 2020-08-24 12:12:12
   * nw.util.getFullTime("2020-08-24", 1);
   * // 20200824121212
   * nw.util.getFullTime("2020-08-24 12:12:12", 0);
   * // 2020-08-24 12:12:12
   * nw.util.getFullTime("2020-08-24 12:12:12", 1);
   * // 20200824121212
   */
  getFullTime: (date: Date | number | string, type = 0): string => {
    console.log(typeof date);

    if (typeof date === "number" || typeof date === "string") {
      date = new Date(date);
    } else if (typeof date === "object") {
      let str = "";
      let options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      str = date.toLocaleString("zh-CN", options);
      // 去除非数字
      str = str.replace(new RegExp(/[^\d.]/, "g"), "");
    }
    let YYYY = date.getFullYear() + "";
    let MM =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let mm =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let ss =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    if (type === 1) {
      return YYYY + MM + DD + hh + mm + ss;
    } else {
      return YYYY + "-" + MM + "-" + DD + " " + hh + ":" + mm + ":" + ss;
    }
  },

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
   * nw.util.checkStr("123456", "mobile");
   * // false
   */
  checkStr: (str: string, type: string) => {
    switch (type) {
      case "mobile": //手机号码
        return new RegExp(/^1[3|4|5|6|7|8|9][0-9]{9}$/).test(str);
      case "tel": //座机
        return new RegExp(/^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/).test(str);
      case "card": //身份证
        return new RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(str);
      case "mobileCode": //6位数字验证码
        return new RegExp(/^[0-9]{6}$/).test(str);
      case "username": //账号以字母开头，长度在6~18之间，只能包含字母、数字和下划线
        return new RegExp(/^[a-zA-Z]([-_a-zA-Z0-9]{5,17})$/).test(str);
      case "pwd": //密码长度在6~18之间，只能包含字母、数字和下划线
        return new RegExp(/^([a-zA-Z0-9_]){6,18}$/).test(str);
      case "payPwd": //支付密码 6位纯数字
        return new RegExp(/^[0-9]{6}$/).test(str);
      case "postal": //邮政编码
        return new RegExp(/[1-9]\d{5}(?!\d)/).test(str);
      case "QQ": //QQ号
        return new RegExp(/^[1-9][0-9]{4,9}$/).test(str);
      case "email": //邮箱
        return new RegExp(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/).test(str);
      case "money": //金额(小数点2位)
        return new RegExp(/^\d*(?:\.\d{0,2})?$/).test(str);
      case "URL": //网址
        return new RegExp(
          /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
        ).test(str);
      case "IP": //IP
        return new RegExp(
          /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        ).test(str);
      case "date": //日期 2014-01-01
        return new RegExp(
          /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
        ).test(str);
      case "time": //时间 12:00:00
        return new RegExp(/^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/).test(str);
      case "dateTime": //日期+时间 2014-01-01 12:00:00
        return new RegExp(
          /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/
        ).test(str);
      case "number": //数字
        return new RegExp(/^[0-9]*$/).test(str);
      case "english": //英文
        return new RegExp(/^[a-zA-Z]+$/).test(str);
      case "chinese": //中文
        return new RegExp(/^[\u4E00-\u9FA5]+$/).test(str);
      case "lower": //小写
        return new RegExp(/^[a-z]+$/).test(str);
      case "upper": //大写
        return new RegExp(/^[A-Z]+$/).test(str);
      case "HTML": //HTML标记
        return new RegExp(/<("[^"]*"|'[^']*'|[^'">])*>/).test(str);
      default:
        return "不存在该类型验证规则";
    }
  },

  /**
   * 金额转换器
   * @description 分转换为元
   * @param n 金额
   * @returns 转换后的金额
   * @example
   * nw.util.priceFilter(100)
   */
  priceFilter: (n: string | number) => {
    if (typeof n == "string") {
      n = parseFloat(n);
    }
    return (n / 100).toFixed(2);
  },

  /**
   * 对象属性拷贝(浅拷贝)
   * @description 将 obj2 的属性赋值给 obj1 (如果obj1中有对应的属性,则会被obj2的属性值覆盖)
   * @param {object} 	obj1
   * @param {object} 	obj2
   * @returns {object} 返回一个新的对象
   * @example
   * nw.util.objectAssign({a:1,b:2},{b:3,c:4})
   * // {a:1,b:3,c:4}
   * nw.util.objectAssign({a:1,b:2},{b:3,c:4}) === {a:1,b:3,c:4}
   * // false
   */
  objectAssign: (obj1: object, obj2: object) => {
    return Object.assign(obj1, obj2);
  },

  /**
   * 复制一份对象-没有映射关系
   * @description 主要用于解除映射关系
   * @param {object} obj
   * @returns {object} 返回一个新的对象
   * @example
   * nw.util.copyObject({a:1,b:2})
   * // {a:1,b:2}
   * nw.util.copyObject({a:1,b:2}) === {a:1,b:2}
   * // false
   * nw.util.copyObject({a:1,b:2}) == {a:1,b:2}
   * // false
   * nw.util.copyObject({a:1,b:2}) === nw.util.copyObject({a:1,b:2})
   * // false
   */
  copyObject: (obj: object) => {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * 将字符串格式的时间转为时间戳
   * @description 传入的时间格式为:2020-08-08 12:12:12
   * @param {string} dateString
   * @returns {number} 返回一个时间戳
   * @example
   * nw.util.toTimeLong("2020-08-08 12:12:12")
   * // 1596862732000
   */
  toTimeLong: (dateString: string) => {
    if (!dateString) {
      return "";
    }
    dateString = dateString.substring(0, 19);
    dateString = dateString.replace(new RegExp(/-/, "g"), "/");
    var time: any = new Date(dateString).getTime();
    if (isNaN(time)) {
      time = "";
    }
    return time;
  },
  /**
   * 两个(元素为对象)的数组合并,并去除重复的数据
   * @description 两个数组合并,并去除重复的数据
   * @param {Array} arr1 第一个数组(arr1和aar2没有顺序要求)
   * @param {Array} aar2 第二个数组
   * @param {String} flag 判断标识,默认用id来判断,若flag传-1,代表不去除重复数据
   * @returns {Array} 返回一个新的数组
   * @example
   * nw.util.arr_concat([{id:1,name:"张三"},{id:2,name:"李四"}],[{id:2,name:"李四"},{id:3,name:"王五"}])
   * // [{id:1,name:"张三"},{id:2,name:"李四"},{id:3,name:"王五"}]
   */
  arr_concat: (arr1: string | any[], arr2: any, flag: string | number) => {
    if (!flag) flag = "id"; // 默认用id来判断是否是同一个对象元素
    var arr3: any = arr1.concat(arr2); // 新旧数据合并
    var arr = []; // 定义一个临时数组 存放对象
    if (flag != -1) {
      var arr_id = []; // 定义一个临时数组 存放id
      for (var i in arr3) {
        // 循环遍历当前数组
        // 判断当前数组下标为i的元素是否已经保存到临时数组
        // 如果已保存，则跳过，否则将此元素保存到临时数组中
        if (arr_id.indexOf(arr3[i][flag]) == -1) {
          arr_id.push(arr3[i][flag]); // 添加id到数组
          arr.push(arr3[i]); // 添加对象到数组
        }
      }
    } else {
      arr = arr3;
    }
    return arr;
  },
  /**
   * 字符串路径找对象的属性值
   * @description 自动根据字符串路径获取对象中的值支持.和[] , 且任意一个值为undefined时,不会报错,会直接返回undefined
   * @param {object} dataObj
   * @param {string} name
   * @returns {any} 返回一个新的数组
   * @example
   * nw.util.getData({a:{b:{c:1}}},"a.b.c")
   * // 1
   */
  getData: (dataObj: object, name: string): any => {
    var newDataObj = JSON.parse(JSON.stringify(dataObj));
    var k = "",
      d = ".",
      l = "[",
      r = "]";
    name = name.replace(/\s+/g, k) + d;
    var tstr = k;
    for (var i = 0; i < name.length; i++) {
      var theChar = name.charAt(i);
      if (theChar != d && theChar != l && theChar != r) {
        tstr += theChar;
      } else if (newDataObj) {
        if (tstr != k) newDataObj = newDataObj[tstr];
        tstr = k;
      }
    }
    return newDataObj;
  },
  /**
   * 字符串路径设置对象的属性值
   * @description 自动根据字符串路径设置对象中的值 支持.和[]
   * @param {object} dataObj
   * @param {string} name
   * @param {any} object
   * @example
   * nw.util.setData({a:{b:{c:1}}},"a.b.c",2)
   * // {a:{b:{c:2}}}
   * nw.util.setData({a:{b:{c:1}}},"a.b.c[0]",2)
   * // {a:{b:{c:[2]}}}
   */
  setData: (dataObj: { [key: string]: any }, name: string, value: any) => {
    // 通过正则表达式查找路径数据
    const regex: RegExp = /([\w$]+)|\[(:\d)\]/g;
    const patten: RegExpMatchArray | null = name.match(regex);

    // 遍历路径，逐级查找，最后一级用于直接赋值
    for (let i = 0; patten && i < patten.length - 1; i++) {
      const key: string = patten[i];
      dataObj = dataObj[key];
    }
    if (patten) {
      dataObj[patten[patten.length - 1]] = value;
    }
  },
  /**
   * 检测任意参数是否为空
   * @description 检测参数是否为空 其中 undefined、null、{}、[]、"" 均为空值 ,不要传布尔值
   * @param {any} value
   * @example
   * nw.util.isNull(value);
   */
  isNull: (value: any) => {
    let key = false;
    if (
      typeof value == "undefined" ||
      Object.prototype.toString.call(value) == "[object Null]" ||
      JSON.stringify(value) == "{}" ||
      JSON.stringify(value) == "[]" ||
      value === "" ||
      JSON.stringify(value) === undefined
    ) {
      key = true;
    }
    return key;
  },
  /**
   * 检测任意参数是否无值
   * @description 检测参数是否无值 结果与 nw.util.isNull 相反
   * @param {any} value
   * @returns {boolean}
   * @example
   * nw.util.isNotNull(value);
   * // true
   * nw.util.isNotNull(undefined);
   * // false
   */
  isNotNull: (value: any) => {
    return !util.isNull(value);
  },
  /**
   * 检测所有参数 - 是否全部不为空
   * @param {any} strS 传多个参数
   * @returns {boolean}
   * @example
   * nw.util.isNotNullAll(value1,value2,value3);
   * // true
   * nw.util.isNotNullAll(value1,value2,undefined);
   * // false
   * nw.util.isNotNullAll(value1,value2,"");
   * // false
   * nw.util.isNotNullAll(value1,value2,[]);
   * // false
   * nw.util.isNotNullAll(value1,value2,{});
   * // false
   * nw.util.isNotNullAll(value1,value2,null);
   * // false
   */
  isNullOne: (...strS: any) => {
    let key = false;
    for (let i = 0; i < strS.length; i++) {
      let str = strS[i];
      if (util.isNull(str)) {
        key = true;
        break;
      }
    }
    return key;
  },
  /**
   * 检测所有参数 - 是否全部为空
   * @param {any} strS 传多个参数
   * @returns {boolean}
   * @example
   * nw.util.isNullAll(value1,value2,value3);
   * // false
   * nw.util.isNullAll(value1,value2,undefined);
   * // true
   * nw.util.isNullAll(value1,value2,"");
   * // true
   * nw.util.isNullAll(value1,value2,[]);
   * // true
   * nw.util.isNullAll(value1,value2,{});
   * // true
   * nw.util.isNullAll(value1,value2,null);
   * // true
   */
  isNullAll: (...strS: any) => {
    let key = true;
    for (let i = 0; i < strS.length; i++) {
      let str = strS[i];
      if (util.isNotNull(str)) {
        key = false;
        break;
      }
    }
    return key;
  },
  /**
   * 检测所有参数 - 是否全部都不为空
   * @param {any} strS 传多个参数
   * @returns {boolean}
   * @example
   * nw.util.isNotNullAll(value1,value2,value3);
   * // true
   * nw.util.isNotNullAll(value1,value2,undefined);
   * // false
   * nw.util.isNotNullAll(value1,value2,"");
   * // false
   * nw.util.isNotNullAll(value1,value2,[]);
   * // false
   * nw.util.isNotNullAll(value1,value2,{});
   * // false
   * nw.util.isNotNullAll(value1,value2,null);
   * // false
   */
  isNotNullAll: (...strS: any) => {
    return !util.isNullOne(...strS);
  },
  /**
   * 获取对象数组中的某一个item,根据指定的键值
   * @param {Array} list 对象数组
   * @param {string} key 键
   * @param {string} value 值
   * @returns {Object} item
   * @example
   * nw.util.getListItem([{"_id": "001"},{"_id": "002"}], "_id", "001");
   * // {"_id": "001"}
   *
   */
  getListItem: (
    list: Array<object | any>,
    key: string,
    value: string
  ): object => {
    let item;
    for (let i in list) {
      if (list[i][key] === value) {
        item = list[i];
        break;
      }
    }
    return item;
  },
  /**
   * 数组操作 - 将对象数组转成json
   * @param {Array} list 对象数组
   * @param {string} key 键
   * @returns {Object} json
   * @example
   * 如[{"_id":"001","name":"name1","sex":1},{"_id":"002","name":"name2","sex":2}]
   * 转成
   * {"001",{"_id":"001","name":"name1","sex":1},"002":{"_id":"002","name":"name2","sex":2}}
   * nw.util.listToJson(list, "_id");
   */
  listToJson: (list: Array<any>, key: string): object => {
    let json: any = {};
    for (let i in list) {
      let item = list[i];
      json[item[key]] = item;
    }
    return json;
  },
  /**
   * 产生指定位数的随机数
   * @param {number} length 长度
   * @param {string} str 随机数的字符集 "a-z,A-Z,0-9"
   * @returns {string} 随机数
   * @example
   * nw.util.random(6);
   * nw.util.random(6, "a-z,0-9");
   * nw.util.random(6, "A-Z,0-9");
   * nw.util.random(6, "a-z,A-Z,0-9");
   */
  random: (length: number, str: string) => {
    let s = "";
    let list = "123456789";
    //0123456789QWERTYUIPASDFGHJKLZXCVBNM
    if (util.isNotNull(str)) {
      if (str == "a-z,0-9") {
        str = "abcdefghijklmnopqrstuvwxyz0123456789";
      } else if (str == "A-Z,0-9") {
        str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      } else if (str == "a-z,A-Z,0-9" || str == "A-Z,a-z,0-9") {
        str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      }
      list = str;
    }
    for (let i = 0; i < length; i++) {
      let code = list[Math.floor(Math.random() * list.length)];
      s += code;
    }
    return s;
  },
  /**
   * 将字符串id转化为指定位数的纯数字字符串id(会重复)
   * @param {string} str 字符串id
   * @param {number} length 长度
   * @returns {string} 纯数字字符串id
   * @example
   * nw.util.stringIdToNumberId(uid,6);
   */
  stringIdToNumberId: (str: string, length: number): string => {
    let s: string = "";
    const list: string = "0123456789";
    for (let i = 0; i < length; i++) {
      if (str.length > i) {
        let index: number = str[i].charCodeAt(0) % 10;
        s += list[index];
      } else {
        s = "0" + s;
      }
    }
    return s;
  },
  /**
   * 计算运费
   * @param {Object} freightsItem 运费模板
   * @param {number} weight 重量
   * @returns {number} 运费
   * @example
   * freightsItem 运费模板
   {
       first_weight 						Integer 首重 单位KG,
      first_weight_price 			Integer 首重 首重价格
      continuous_weight 				Integer	续重 单位KG
      continuous_weight_price 	Integer 续重价格 单位分 100 = 1元
      max_weight								Integer 重量达到此值时,会多计算首重的价格,并少一次续重的价格 倍乘(相当于拆分多个包裹)
  }
  * weight	运费重量
  * nw.util.calcFreights(freightsItem, weight);
  */
  calcFreights: (freightsItem: any, weight: number) => {
    let {
      first_weight,
      first_weight_price,
      continuous_weight,
      continuous_weight_price,
      max_weight = 100000000,
    } = freightsItem;

    let money = 0; // 运费
    let packagesNum = 0; // 包裹数量
    let packagesSurplusWeight = max_weight; // 包裹剩余重量
    let first_weight_key = false; // 是否已减过首重
    let continuous_weight_count = 0; // 续重次数
    let logArr = [];
    let logRun = false;
    while (weight > 0) {
      if (!first_weight_key) {
        // 首重
        first_weight_key = true;
        packagesNum++;
        packagesSurplusWeight = max_weight; // 还原包裹剩余重量
        weight -= first_weight;
        packagesSurplusWeight -= first_weight;
      } else {
        // 续重
        continuous_weight_count++;
        weight -= continuous_weight;
        packagesSurplusWeight -= continuous_weight;
      }
      if (logRun)
        logArr.push({
          总重量剩余: weight,
          当前包裹重量剩余: packagesSurplusWeight,
          当前第几个包裹: packagesNum,
          续重计算次数: continuous_weight_count,
        });

      if (packagesSurplusWeight <= 0) {
        // 需要增加一个新的包裹
        first_weight_key = false; // 新包裹设置没有减过首重
      }
    }
    if (logRun) console.log(JSON.stringify(logArr));
    money =
      packagesNum * first_weight_price +
      continuous_weight_price * continuous_weight_count;
    return money;
  },
  /**
   * 判断B常量数组是否至少有一个元素在A常量数组中存在(两数组有交集)
   * @param {Array} arr1 常量数组
   * @param {Array} arr2 常量数组
   * @returns {boolean} 是否有交集
   * @example
   * nw.util.checkArrayIntersection(arr1, arr2);
   */
  checkArrayIntersection: (arr1 = [], arr2 = []) => {
    let checkKey = false;
    for (let i = 0; i < arr2.length; i++) {
      if (arr1.indexOf(arr2[i]) > -1) {
        checkKey = true;
      }
    }
    return checkKey;
  },
  /**
   * 判断arr是否为一个数组，返回一个bool值
   * @param {Array} arr
   * @returns {boolean} 是否为数组
   * @example
   * nw.util.isArray(arr);
   */
  isArray: (arr: Array<any>): boolean => {
    return Object.prototype.toString.call(arr) === "[object Array]";
  },
  /**
   * 深度克隆
   * @param {object} obj
   * @returns {object} 克隆后的对象
   * @example
   * nw.util.deepClone(obj);
   */
  deepClone: (obj: any) => {
    if (typeof obj !== "object" && typeof obj !== "function") {
      //原始类型直接返回
      return obj;
    }
    var o: any = util.isArray(obj) ? [] : {};
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        o[i] = typeof obj[i] === "object" ? util.deepClone(obj[i]) : obj[i];
      }
    }
    return o;
  },
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
  arrayToTree: (originalArrayData: Array<any>, treeProps: any): Array<any> => {
    let arrayData = util.deepClone(originalArrayData);
    let {
      id = "_id",
      parent_id = "parent_id",
      children = "children",
      deleteParentId = false,
      need_field,
    } = treeProps;
    let result = [];
    let temp: any = {};
    for (let i = 0; i < arrayData.length; i++) {
      temp[arrayData[i][id]] = arrayData[i]; // 以id作为索引存储元素，可以无需遍历直接定位元素
    }
    for (let j = 0; j < arrayData.length; j++) {
      let currentElement = arrayData[j];
      let newCurrentElement = {};
      if (need_field) {
        need_field = util.uniqueArr(
          need_field.concat([id, parent_id, children])
        );
        for (let keyName in currentElement) {
          if (need_field.indexOf(keyName) === -1) {
            delete currentElement[keyName];
          }
        }
      }
      let tempCurrentElementParent = temp[currentElement[parent_id]]; // 临时变量里面的当前元素的父元素
      if (tempCurrentElementParent) {
        // 如果存在父元素
        if (!tempCurrentElementParent[children]) {
          // 如果父元素没有children键
          tempCurrentElementParent[children] = []; // 设上父元素的children键
        }
        if (deleteParentId) {
          delete currentElement[parent_id];
        }
        tempCurrentElementParent[children].push(currentElement); // 给父元素加上当前元素作为子元素
      } else {
        // 不存在父元素，意味着当前元素是一级元素
        result.push(currentElement);
      }
    }
    return result;
  },

  /**
   * 最简单数组去重法
   * @param {Array} array
   * @returns {Array} 去重后的数组
   * @example
   * nw.util.uniqueArr(array);
   */
  uniqueArr: (array: Array<any>) => {
    let n = []; //一个新的临时数组
    //遍历当前数组
    for (let i = 0; i < array.length; i++) {
      //如果当前数组的第i已经保存进了临时数组，那么跳过，
      //否则把当前项push到临时数组里面
      if (n.indexOf(array[i]) == -1) n.push(array[i]);
    }
    return n;
  },
  /**
   * 将树形结构转成数组结构
   * @param {Array} treeData  数据源
   * @param {Object} treeProps 树结构配置 { id : "menu_id", children : "children" }
   * @returns {Array} 转换后的数组
   * @example
   * nw.util.treeToArray(treeData,{
   * id : "menu_id", // 自己的id字段,必填
   * parent_id : "parent_id", // 父级id字段,必填
   * children : "children", // 转换树形结构后的子级的属性值,可选,不填默认children
   * });
   */
  treeToArray: (treeData: Array<any>, treeProps: object) => {
    let newTreeData = util.deepClone(treeData);
    return treeToArrayFn(newTreeData, treeProps);
  },

};

export default util;

function treeToArrayFn (
  treeData: Array<any>,
  treeProps: any = {},
  arr: any = [],
  current_parent_id?: any
)  {
  let {
    id = "_id",
    parent_id = "parent_id",
    children = "children",
    deleteChildren = true,
  } = treeProps;
  for (let i in treeData) {
    let item: any = treeData[i];
    if (current_parent_id) item[parent_id] = current_parent_id;
    arr.push(item);
    if (item[children] && item[children].length > 0) {
      arr = treeToArrayFn(item[children], treeProps, arr, item[id]);
    }
    if (deleteChildren) {
      delete item[children];
    }
  }
  return arr;
}