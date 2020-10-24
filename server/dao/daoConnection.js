/**
 * Created by CC on 2016/10/11.
 * 数据库模型,包括连接数据库,得到实体,初始化实体
 */
'use strict'
console.log('require daoConnection')
let mongoose = require('mongoose')
let Utils = require('../util/Utils')
let that = module.exports
//这个数据库连接是需要电脑有网络才能通的,否则报连接异常
let opt = {
  user: Utils.readConfig('db_user'),
  pass: Utils.readConfig('db_pws'),
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  // server:{
  reconnectInterval: 10 * 1000,//1分钟重连一次数据库
  reconnectTries: 100//尝试重连100次
  // }
}
let conn = mongoose.createConnection(Utils.readConfig('db_url'), opt)
//数据库连接错误时报错
conn.on('error', function (err) {
  console.log('数据库出错')
  console.error(err)
})

conn.on('close', function () {//self
  console.error('数据库已关闭')
})

conn.on('disconnected', function () {
  console.warn('数据库已断开')
})

conn.on('reconnected', function () {
  console.log('数据库重连成功')
})

//得到实体
module.exports.getEntity = function (name) {
  return conn.model(name)
}

module.exports.getCollection = function (name, option) {
  return conn.collection(name, option)
}

module.exports.getDB = function () {
  return conn.db
}

module.exports.getConnection = function () {
  return conn
}

module.exports.getModelNames = function () {
  return conn.modelNames()
}

/**
 * 分页查询
 * @param name 实体名
 * @param condition 查询条件
 * @param field 返回字段
 * @param sort 排序方式
 * @param skip 跳过几条 现在变成传第几页过来
 * @param limit 查询几条
 * @param cb 回调函数
 */
module.exports.getPageQuery = function (name, condition, field, sort, skip = 1, limit, cb) {
  let entity = that.getEntity(name)
  let c = condition, f = field, st = {}, sp = skip, lt = limit
  if (CGlobal.isPlainObject(sort)) {
    if (sort.order === 'desc') {
      st[sort.sort] = -1//降序
    } else {
      if (sort.sort) {
        st[sort.sort] = 1//升序
      } else {
        st['_id'] = -1
      }
    }
  }
  if (typeof c === 'function') {
    return entity.find(c)
  } else if (typeof f === 'function') {
    return entity.find(c, f)
  } else if (typeof sort === 'function') {
    return entity.find(c, f, sort)
  } else if (typeof sp === 'function') {
    return entity.find(c, f, sp).sort(st)
  } else {
    if (typeof lt === 'function') {
      cb = lt
      lt = 'ALL'
    }
    let _limit = 30
    entity.countDocuments(c, function (err, total) {
      if (err) return cb(err)
      if (lt === 'ALL') {
        _limit = total
        sp = 0
      } else {
        _limit = lt
        sp = (sp - 1) < 0 ? 0 : (sp - 1) * _limit
      }
      return entity.find(c, f, function (err, result) {
        cb(err, {
          total: total,
          rows: result
        })
      }).sort(st).skip(sp).limit(parseInt(_limit))
    })
  }
}

/**
 * 用聚合函数查询
 */
module.exports.getAggregation = function (name, condition, field, sort, skip, limit, cb) {
  let entity = that.getEntity(name)
  let c = condition, f = field, st = {}, sp = skip, lt = limit
  if (CGlobal.isPlainObject(sort)) {
    if (sort.order === 'desc') {
      st[sort.sort] = -1//降序
    } else {
      if (sort.sort) {
        st[sort.sort] = 1//升序
      } else {
        st['_id'] = -1
      }
    }
  }
  //聚合函数如果用_id去查,需要转换new mongoose.Types.ObjectId('_id')
  let array = []
  if (typeof c === 'function') {
    array.push({$match: {}})
  } else {
    array.push({$match: c})
  }
  if (CGlobal.isPlainObject(f)) {
    array.push({$project: mappingField(entity.schema, f)})
  }
  if (typeof c === 'function') {
    return entity.aggregate(array, c)//无条件返回文档
  } else if (typeof f === 'function') {
    return entity.aggregate(array, f)//根据条件,返回文档
  } else if (typeof sort === 'function') {
    return entity.aggregate(array, sort)//根据条件,查询需要的字段,返回文档
  } else if (typeof sp === 'function') {
    array.push({$sort: st})
    return entity.aggregate(array, sp)//添加排序返回文档
  } else {
    if (typeof lt === 'function') {
      cb = lt
      lt = 'ALL'
    }
    array.push({$sort: st})
    array.push({$skip: ((sp - 1) < 0 ? 0 : (sp - 1) * lt)})
    if (lt !== 'ALL') {
      array.push({$limit: parseInt(lt || 30)})
    }
    // array.push({
    //     $group: {
    //         _id: null,
    //         results: {$push: '$$ROOT'}
    //     }
    // });
    entity.aggregate([
      {$match: c}
      , {$group: {_id: null, count: {$sum: 1}}}
    ], function (err, result) {
      if (err) return cb(err)
      if (result.length === 0) {
        //说明count == 0
        return cb(err, {
          total: 0,
          rows: []
        })
      }
      let total = result[0].count
      entity.aggregate(array, function (err, doc) {
        cb(err, {
          total: total,
          rows: doc
        })
      })
    })
  }
}

/**
 * 转换聚合函数查询返回的字段
 * 因为聚合函数里面的不能存在{field:0}
 */
function mappingField(entitySchema, field) {
  let obj = entitySchema.obj
  let newfield = {}
  CGlobal.forEach(obj, function (key) {
    newfield[key] = 1
    if (field[key] === 0) {
      delete newfield[key]
    } else if (field[key] === 1) {
      newfield = field
      return false
    }
  })
  return newfield
}
