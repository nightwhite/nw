import { log } from "console";
import db from "./dao";
import util from "./util";

interface Nw {
  /**
   * db
   * @description 数据库db操作
   * @example
   * await nw.db.add({ name: "张三" });
   */
  db?: typeof db;
  /**
   * util
   * @description util工具包
   * @example
   * nw.util.deleteObjectKeys({ name: "张三", age: 18 }, ["age"]);
   */
  util: typeof util;
  /**
   * 公共函数写法示例
   * 调用示例：
   * await nw.test();
   */
  test: (event?: any) => Promise<string>;
  
}

const nw: Nw = {
  // 数据库db操作
  db,
  // 公共util
  util,
  /**
   * test
   * 调用示例：
   * await nw.test();
   */
  test: async (event?: any) => {
    console.log("nw-lafjs");
    return '这是test的返回';
  },
};

export default nw;