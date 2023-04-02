import cloud from "@lafjs/cloud";
const db = cloud.database();
const _ = db.command;
const $ = _.aggregate;

const Dao = {
    /**
     * add(单条记录)
     * @description insert into dbName (列1, 列2,...) values (值1, 值2,....)
     * 注意:使用此函数添加的数据会自动加上_add_time(添加当前时间戳) 和 _add_time_str(当前时间字符串格式)
     * @params {Object} event 请求参数
     * event 请求参数 说明
     * @params {String} dbName  	表名
     * @params {String} dataJson  需要添加的数据(json格式)
     * @params {String} cancelAddTime  取消自动生成 _add_time 和 _add_time_str 字段
     * res 返回值为添加数据的id,添加失败,则返回null
     * 调用示例:
      res.id = await nw.baseDao.add({
        dbName:dbName,
        dataJson:{
          "money": 1,
          "kehuid": "001"
        },
        cancelAddTime : true
      });
     */
    add: async (event: { hasOwnProperty?: any; cancelAddTime?: any; dbName?: any; dataJson?: any; cloud?: any; }) => {
      // 数据库查询开始----------------------------------------------------------
      const { dbName, dataJson } = event;
      if (
        !dataJson._add_time &&
        (!event.hasOwnProperty('cancelAddTime') || !event.cancelAddTime)
      ) {
        const date = new Date()
        dataJson._add_time = date.getTime()
        dataJson._add_time_str = date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
      }
      // const res = await db.collection(dbName).add(dataJson)
      const res = await cloud.mongo.db.collection(dbName).insertOne(dataJson)
      // 数据库查询结束----------------------------------------------------------
      return res.insertedId ? res.insertedId : null
    }
    }
    export default Dao