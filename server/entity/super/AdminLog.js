/**
 * Created by CC on 2017/12/16.
 */
'use strict'
console.log('require AdminLog')
let Schema = require('mongoose').Schema
let dao = require('../../dao/daoConnection')
let conn = dao.getConnection()
// let WriteFileLog = require('../../log/WriteFileLog');
let Utils = require('../../util/Utils')
let async = require('async')
// let Shop = require('../Shop');
let enumLogType = []

CGlobal.forEach(CGlobal.GlobalStatic.Log_Type, function (key, value) {
  enumLogType.push(value)
})

let AdminLog = {
  date: {
    type: Date
    , required: true
  },//时间
  userName: {
    type: String
    , required: true
  },//用户ID
  content: {
    type: String
    , required: true
  },//内容
  shopId: {
    type: String
    , required: true
  },//商铺ID
  type: {
    type: String
    , required: true
    , enum: enumLogType
  },//日志类型
  requestIP: {
    type: String
    , required: true
    , match: CGlobal.GlobalStatic.ipExp
  }//远程IP
}

let AdminLogSchema = new Schema(AdminLog)

AdminLogSchema.statics.createLog = function (opt, session, cb) {
  opt.requestIP = session.requestIP
  if (!opt.userName) {
    opt.userName = session.adminId
  }
  if (!opt.shopId) {
    opt.shopId = session.shopId
  }
  if (typeof opt.content === 'string') {
    //这里经过了写log类之后,就无法创建adminLog了,因为时间不是date类型了
    // WriteFileLog.info(CGlobal.extend(true, {}, opt));
  }
  opt.date = new Date()
  this.create(opt, cb)
}

AdminLogSchema.statics.queryLog = function (req, session, cb) {
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.UserLogs.code)) {
    return cb({
      message: CGlobal.serverLang(req.lang, '抱歉,你没有 [{0}] 权限访问!'
          , 'admin.noRights', CGlobal.Rights.UserLogs.code)
    })
  }
  const searchWhere = req.body
  const input = searchWhere['cond'] || ''
  const shopId = searchWhere.shopId
  const adminId = searchWhere.adminId
  const type = searchWhere.type || 'ALL'
  const startDate = searchWhere.startDate
  const endDate = searchWhere.endDate
  let where = {
    $or: [], $and: []
  }//查询条件
  CGlobal.forEach(input.split(' '), function (i, v) {
    if (!v) {
      return true
    }
    if (!shopId) {
      where.$or.push({
        shopId: Utils.getIgnoreCase(v, true)
      })
    }
    if (!adminId) {
      where.$or.push({
        userName: Utils.getIgnoreCase(v, true)
      })
    }
    where.$or.push({
      requestIP: Utils.getIgnoreCase(v, true)
    })
    where.$or.push({
      content: Utils.getIgnoreCase(v, true)
    })
  })

  if (shopId) {
    where.$and.push({
      shopId: Utils.getIgnoreCase(shopId)
    })
  }
  //如果登录的店铺ID不是system
  if (session.shopId !== 'SYSTEM') {
    where.$and.push({
      shopId: session.shopId
    })
  }

  if (adminId) {
    where.$and.push({
      userName: Utils.getIgnoreCase(adminId)
    })
  }

  if (type !== 'ALL') {
    where.$and.push({
      type: type
    })
  }

  if (!CGlobal.isEmpty(startDate)) {
    where.$and.push({
      date: {
        $gte: startDate // 前端传入零时区格式的日期进行查询yyyy-MM-ddThh:mm:ssZ
      }
    })
  }
  if (!CGlobal.isEmpty(endDate)) {
    where.$and.push({
      date: {
        $lte: endDate
      }
    })
  }
  let offset = searchWhere['offset']
  let pageSize = searchWhere['pageSize']
  let sortOrder = searchWhere['sortOrder'] || {
    sort: 'date',
    order: 'desc'
  }

  // TODO 这里估计要修改一下
  if (!CGlobal.isSupervisor(session)) {
    where.$and.push({
      $or: [{
        // 这里返回的shopId有可能返回SYSTEM,是否考虑加个参数控制就算有权限也不返回SYSTEM
        // 考虑另一个问题,那就是一个SYSTEM用户能看到什么用户的操作日志呢?
        // 非SYSTEM的用户能看到什么用户的日志???
        shopId: {$in: Utils.getShopIds(session)}
      }, {
        shopId: 'SYSTEM',
        userName: session.adminId
      }]
    })
  }
  if (where.$or.length === 0) delete where.$or
  if (where.$and.length === 0) delete where.$and
  dao.getPageQuery('AdminLog', where, {}, sortOrder, offset, pageSize, cb)
}

conn.model('AdminLog', AdminLogSchema)
module.exports = conn.model('AdminLog')
