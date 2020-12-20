/**
 * Create by CC on 2020/12/18
 */
'use strict'

const mongoose = require('mongoose')

const user = 'sa'
const pass = '123456'
const host = '127.0.0.1'
const port = '27017'
const dbName = 'clothingshop'

const option = {
  user: user,
  pass: pass,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}

const dbConn = mongoose.createConnection(`mongodb://${host}:${port}/${dbName}`, option)
const dbClient = dbConn.getClient()

// 通过数据库名获取数据库对象
// console.log(dbConn.collection('admins'))
// 全部的集合名
// console.log(dbConn.collections)
// 数据库的配置
// console.log(dbConn.config)
// 创建一个集合
// dbConn.createCollection('testcoll')
// 获取数据库的状态
// dbClient.db().stats((err, result) => {
//   console.log(result)
// })
// 获取admin对象
// dbClient.db().admin()
// 获取admindZ对象之后可以调用admin的方法
// 参考地址 http://mongodb.github.io/node-mongodb-native/3.5/api/Admin.html
// dbClient.db().admin().serverStatus((err, result) => {
//   console.log(result)
// })
// dbClient.db().admin().serverInfo((err, result) => {
//   console.log(result)
// })
// dbClient.db().admin().buildInfo((err, result) => {
//   console.log(result)
// })
// dbClient.db().admin().listDatabases((err, result) => {
//   console.log(result)
// })
// dbClient.db().collection('admins').stats((err, result) => {
//   console.log(result)
// })
// console.log(dbClient.db().options)
