import db from "./dao";
import util from "./util";

interface Nw {
  // 数据库baseDao
  db: typeof db;
  // 公共util
  util: typeof util;
  /**
   * 公共函数写法示例
   * 调用示例：
   * nw.test();
   */
  test: (event?: any) => Promise<string>;
}

const nw: Nw = {
  // 数据库db操作
  db,
  // 公共util
  util,
  /**
   * 公共函数写法示例
   * 调用示例：
   * nw.test();
   */
  test: async (event?: any) => {
    return '这是test的返回';
  }
};

export default nw;