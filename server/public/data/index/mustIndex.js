/**
 * Created by CC on 2017/5/16.
 */
'use strict';
console.log('require mustIndex');
//如果表名是x结尾的,dbname必须是加es结尾的哦!!!!
//必需的索引
let mustIndex = [
    //Admin表
    {
        dbname: 'admins',
        fields: {email: 1},
        option: {name: 'emailId', unique: true}
    },
    {
        dbname: 'admins',
        fields: {adminId: 1,shopId:1},
        option: {name: 'nameId', unique: true}
    },
    //User表
    {
        dbname: 'users',
        fields: {userId: 1},
        option: {name: 'userId', unique: true}
    },
    {
        dbname: 'shops',
        fields: {shopId: 1},
        option: {name: 'shopId', unique: true}
    },
    {
        dbname: 'suppliers',
        fields: {supplierCode: 1},
        option: {name: 'supplierId', unique: true}
    },
    {
        dbname: 'adminaccesses',
        fields: {date: 1},
        option: {name: 'expire_log', expireAfterSeconds: 24 * 3600}//保留多少天的log
    },
    {
        dbname: 'adminlogs',
        fields: {date: 1},
        option: {name: 'expire_log', expireAfterSeconds: 7 * 24 * 3600}
    }
];

module.exports = mustIndex;