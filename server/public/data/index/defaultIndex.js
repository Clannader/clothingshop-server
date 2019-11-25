/**
 * Created by CC on 2017/5/16.
 */
'use strict';
console.log('require defaultIndex');
//默认索引
let defaultIndex = [
    {}
];

CGlobal.extend(defaultIndex,require('./mustIndex'));

module.exports = defaultIndex;