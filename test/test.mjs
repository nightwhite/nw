import { EJSON } from 'bson';
// 执行方式
// node --experimental-modules test/test.mjs


// nw.db.adds
console.log(EJSON.stringify({}) == '{}')

typeof EJSON.stringify({}) 
