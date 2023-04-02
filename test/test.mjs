// 执行方式
// node --experimental-modules test/test.mjs
import nw2 from '../dist/index.js'
const nw = nw2.default;

const test = nw.util.random(6, "a-z,A-Z,0-9");
console.log(test);


