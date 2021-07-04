/**
 * Create by CC on 2020/12/16
 */
'use strict'
const shell = require('shelljs')
const mongoose = require('mongoose')
const fs = require('fs')

// 配置信息,暂时不做cli,避免出现一堆bug,浪费太多时间
const user = 'sa'
const pass = '123456'
const host = '127.0.0.1'
const port = '27017'
const dbName = 'hotelifc'
const mongoBin = 'D:\\MongoDB\\bin'
const exportPath = 'D:\\Office\\mongodb-data'
const importPath = 'D:\\Office\\mongodb-data'

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

const getCollections = function () {
  return new Promise(resolve => {
    // 这里是导出的代码,需要获取数据库名字
    // dbClient.db().collections((err, colls) => {
    //   const collsArr = colls.map(v => {
    //     return v.collectionName
    //   })
    //   resolve(collsArr)
    // })

    // 这里是导入的代码,需要获取文件名集合
    const fileArray = fs.readdirSync(importPath, 'UTF-8').map(v => {
      return v.replace('.json', '')
    })
    resolve(fileArray)
  })
}

const start = async function() {
  const colls = await getCollections()
  const drive = mongoBin.substring(0, 2)
  shell.cd(drive)
  shell.cd(mongoBin)

  colls.forEach(coll => {
    // shell.exec(`mongoexport -h ${host}:${port} -u ${user} -p ${pass} -d ${dbName} -c ${coll} -o ${exportPath}\\${coll}.json`)
    // console.log(coll)
    // 导入要遍历文件夹,获取表名依次导入
    shell.exec(`mongoimport -h ${host}:${port} -u ${user} -p ${pass} -d ${dbName} -c ${coll} --file ${importPath}\\${coll}.json`)
  })

  process.exit(0)
}

start()
// shell.echo('Hello World')
// shell.exec('java -version')
