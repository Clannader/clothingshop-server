/**
 * Created by CC on 2017/5/16.
 */
'use strict'
console.log('require mustIndex')
//如果表名是x结尾的,dbname必须是加es结尾的哦!!!!
//必需的索引
let mustIndex = [
  //Admin表
  // {
  //   dbname: 'Admin', // 这里使用entity的文件名
  //   fields: {email: 1},
  //   option: {name: 'emailId', unique: true}
  // },
  {
    dbname: 'Admin',
    fields: {adminId: 1},
    option: {name: 'nameId', unique: true}
  },
  {
    dbname: 'Shop',
    fields: {shopId: 1},
    option: {name: 'shopId', unique: true}
  },
  // {
  //     dbname: 'Supplier',
  //     fields: {supplierCode: 1},
  //     option: {name: 'supplierId', unique: true}
  // },
  {
    dbname: 'AdminAccess',
    fields: {date: 1},
    option: {name: 'expire_log', expireAfterSeconds: 30 * 24 * 3600}//保留多少天的log
  },
  {
    dbname: 'AdminLog',
    fields: {date: 1},
    option: {name: 'expire_log', expireAfterSeconds: 30 * 24 * 3600}
  }
]

module.exports = mustIndex
