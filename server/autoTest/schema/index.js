/**
 * Create by CC on 2018/11/24
 */
'use strict';
/**
 * 测试结果总结
 * 1.不支持该请求方式返回404
 * 2.地址真的不存在返回404
 * @type {{url: string, headers: {}, cases: {other: *[]}}}
 */
module.exports = {
    url: 'https://cc:3001/cms/h5',
    headers: {

    },
    cases: {
        other: require('./other'),
        login: require('./login')
    }
};