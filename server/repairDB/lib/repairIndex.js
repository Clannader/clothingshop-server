/**
 * Created by CC on 2017/4/23.
 * 当使用一个新库的时候,有些索引必须要有的,每次重新服务器都要检测某些表的索引是否存在
 * 比如在上次启动时被人为删除了,下一次重启要直接修复,否则出问题
 * 但是有些索引是可有可无的,那么就不用修复
 */
'use strict'
//加打印log,看加载时的顺序
console.log('require repairIndex')

// const async = require('async')
const db = require('../../dao/daoConnection')
const mustIndex = require('../../public/data/dataPool').mustIndex

// 2021-08-01 新写修复索引逻辑
// 先把默认索引的数组转变为Map集合,把相同的表的索引整合在一起
// 考虑问题,表的别名是否要新加?? 测试时区的问题,修改电脑时区,看看写的log是否是零时区
// 看看如何使用RSA加密算法
const indexMap = new Map()
const getEntityIndex = function (entity) {
  return new Promise(resolve => {
    entity.listIndexes((err, result) => {
      resolve(result || [])
    })
  })
}
mustIndex.forEach(async v => {
  const entityName = v.dbname
  const entity = db.getEntity(entityName)
  const collectionName = entity.collection.collectionName
  if (!indexMap.get(entityName)) {
    indexMap.set(entityName, {
      entityName,
      collectionName,
      listIndexs: await getEntityIndex(entity)
    })
  }
  // 获取到当前实体的所有索引
  const listIndexs = indexMap.get(entityName).listIndexs
  // 拿当前写死的索引去对比数据库的索引,如果不存在则修复
  let isExist = false
  // 循环数据库索引
  CGlobal.forEach(listIndexs, (i, entityIndex) => {
    if (entityIndex.name === '_id_') {
      return true
    }
    if (CGlobal.compareObjects(v.fields, entityIndex.key)) {
      isExist = true
      return false
    }
  })
  if (!isExist) {
    // 不存在,修复索引
    const collection = db.getCollection(collectionName)
    collection.createIndex(v.fields, v.option, function (err, indexName) {
      if (err) {
        console.log(CGlobal.logLang('{0} 创建{1} 索引失败,失败原因:{2}'
            , v.dbname, JSON.stringify(v.fields), err.message))
      } else {
        //创建索引成功
        // console.log(indexName);//返回的是创建的索引名
        console.log(CGlobal.logLang('{0} 创建{1} 索引 {2} 成功'
            , v.dbname, JSON.stringify(v.fields), indexName))
      }
    })
  }
})

// 旧的索引逻辑删除,已过时
/**let errArray = []
//创建必要表的索引
async.eachSeries(mustIndex, function (item, cb) {
  let entity = db.getCollection(item.dbname)
  //这里要判断是否存在索引,因为考虑到当数据量大的时候再次创建重复的索引会很耗时.
  //得到表的索引
  entity.getIndexes(function (err, getIndex) {
    // TODO 发现使用mongo4.2发现一个bug,那就是索引的值是一样的,但是索引名不一样,这样好像我判断是
    // 没有索引的,导致去创建索引,但是又不能创建索引的
    //这里有错为什么不回调,原因是获取索引失败不一定不能创建索引
    if (err) {
      console.error(err)
      console.error(CGlobal.logLang('获取索引失败:原因{0}', err.message))
    }
    //这里返回的错误只有出现不存在这个表时进行创建索引,或者有这个表的存在没有这个索引。
    //判断表是否存在这个索引,有就就不创建
    //这个判断还是有个BUG 的,如果比较1,2,3 和 3,1,2 就会返回false
    //删除默认的_id索引
    if (!getIndex) return cb()
    delete getIndex._id_
    //没有BUG了
    if (compareIndex(getIndex, getCustomIndex(item))) {
      return cb()
    }
    entity.createIndex(item.fields, item.option, function (err, indexResult) {
      if (err) {
        console.log(CGlobal.logLang('{0} 创建{1} 索引失败'
            , item.dbname, JSON.stringify(item.fields)))
        errArray.push(CGlobal.logLang('{0} 创建{1} 索引失败原因:{2}', item.dbname
            , JSON.stringify(item.fields), err.message))
        return cb()
      }
      //创建索引成功
      // console.log(indexResult);//返回的是创建的索引字段还是索引名?
      console.log(CGlobal.logLang('{0} 创建{1} 索引成功'
          , item.dbname, JSON.stringify(item.fields)))
      cb()
    })
  })
}, function () {
  //这里的回调只有err,没有结果的
  if (errArray.length !== 0) {
    console.log(errArray.join('\r\n'))
  } else {
    console.log(CGlobal.logLang('索引创建完毕'))
  }
})*/

//比较是否存在该索引
function compareIndex(dbIndex, customIndex) {
  let keyCustomIndex = Object.getOwnPropertyNames(customIndex)[0]
  if (!dbIndex[keyCustomIndex]) {
    return false
  }
  let index = {}
  index[keyCustomIndex] = _arrayToJson(dbIndex[keyCustomIndex])
  if (!CGlobal.compareObjects(customIndex, index)) {
    return false
  }
  return true
}

//得到自定义索引
function getCustomIndex(item) {
  let temp = {}
  //版本1
  // let arr = [];
  // CGlobal.forEach(item.fields,function (k,v) {
  //     let copy = [];
  //     copy.push(k);
  //     copy.push(v);
  //     arr.push(copy);
  // });
  // temp[item.option.name] = arr;
  //版本2
  temp[item.option.name] = item.fields
  return temp
}

//把[[key,value],[key,value]]==>{key:value,key:value}
function _arrayToJson(arr) {
  //判断它是否是Array
  if (!Array.isArray(arr)) return arr
  let obj = {}
  CGlobal.forEach(arr, function (i, value) {
    obj[value[0]] = value[1]
  })
  return obj
}

/**
 * 是否存在该索引
 * @param index 索引 { _id_: [ [ '_id', 1 ] ], userId: [ [ 'userId', 1 ] ] }
 * @param fields 索引字段 {userId:1}
 */
function _hasIndex(index, fields) {
  let flag = false
  CGlobal.forEach(index, function (key, value) {
    if (JSON.stringify(fields) === JSON.stringify(_arrayToJson(value))) {
      flag = true
    }
  })
  return flag
}
