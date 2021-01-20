/**
 * Created by CC on 2018/1/27.
 * 系统配置表,设计一二级关联关系
 */
'use strict'
console.log('require SystemConfig')
const Schema = require('mongoose').Schema
const dao = require('../../dao/daoConnection')
const conn = dao.getConnection()

const AdminLog = require('../super/AdminLog')
const Utils = require('../../util/Utils')

const SystemConfig = {
  shopId: {
    type: String
    , required: true
  },//商铺ID
  key: {
    type: String
    , trim: true
    , required: true
    , match: CGlobal.GlobalStatic.codeExp
  },//key
  groupName: {
    type: String
  },//组名,一级组名为null,二级组名不为null
  value: {
    type: String
    , required: true
  },//值
  desc: {
    type: String
    , trim: true
    , validate: [function (value) {
      return value.length <= 150
    }, 'Description length is more than 150.']
  }//描述
}
const SystemConfigSchema = new Schema(SystemConfig)

SystemConfigSchema.statics.addOneGroup = function (data, session, cb) {
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  if (!CGlobal.isPlainObject(data)) {
    return cb({message: '参数不能为空'})
  }
  delete data.id
  let that = this
  this.checkGroupInfo('ONE', data, function (err) {
    if (err) return cb(err)
    that.create(data, function (err, config) {
      if (err) return cb(err)
      AdminLog.createLog({
        userName: session.adminId,
        content: CGlobal.serverLang('创建{0} 一类配置', config.key),
        shopId: session.shopId,
        type: CGlobal.GlobalStatic.Log_Type.CONFIG
      }, session, function (err) {
        if (err) console.error(err)
      })
      cb()
    })
  })
}

SystemConfigSchema.statics.checkGroupInfo = function (type, data, cb) {
  let key = data.key
  let value = data.value
  let groupName = data.groupName
  if (!key) {
    return cb({message: '请输入Key'})
  }
  if (!value) {
    return cb({message: '请输入值'})
  }
  if ('ONE' === type) {
    delete data.groupName
  } else if ('TWO' === type) {
    if (!groupName) {
      return cb({message: '组名不存在!'})
    }
  }
  let where = {key: Utils.getIgnoreCase(key)}

  if (data.id) {
    where._id = {$ne: data.id}
  }
  if ('ONE' === type) {
    where.groupName = {$exists: false}
    this.count(where, function (err, count) {
      if (err) return cb(err)
      if (count > 0) return cb({message: 'Key已存在'})
      cb()
    })
  } else if ('TWO' === type) {
    let isExistGroupName = {
      key: groupName,
      groupName: {$exists: false}
    }
    let that = this
    where.groupName = groupName
    //二级组的时候先判断组名是否存在
    this.count(isExistGroupName, function (err, count) {
      if (err) return cb(err)
      if (count !== 1) return cb({message: '组名不存在!'})
      //再判断二级组是否重复
      that.count(where, function (err, count) {
        if (err) return cb(err)
        if (count > 0) return cb({message: 'Key已存在'})
        cb()
      })
    })
  }

}

SystemConfigSchema.statics.addTwoGroup = function (data, session, cb) {
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  if (!CGlobal.isPlainObject(data)) {
    return cb({message: '参数不能为空'})
  }
  delete data.id
  let that = this
  this.checkGroupInfo('TWO', data, function (err) {
    if (err) return cb(err)
    that.create(data, function (err, config) {
      if (err) return cb(err)
      AdminLog.createLog({
        userName: session.adminId,
        content: CGlobal.serverLang('创建{0} 下 {1}二类配置', config.groupName, config.key),
        shopId: session.shopId,
        type: CGlobal.GlobalStatic.Log_Type.CONFIG
      }, session, function (err) {
        if (err) console.error(err)
      })
      cb()
    })
  })
}

SystemConfigSchema.statics.modifyOneGroup = function (data, session, cb) {
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  if (!CGlobal.isPlainObject(data)) {
    return cb({message: '参数不能为空'})
  }
  let that = this
  this.checkGroupInfo('ONE', data, function (err) {
    if (err) return cb(err)
    let id = data.id
    delete data.id//id不能改
    that.findByIdAndUpdate(id, {$set: data}, function (err, config) {
      if (err) return cb(err)
      if (!config) return cb({message: 'Key已不存在'})
      contrastConfig('ONE', config, data, session)
      //如果修改了key,则要修改对应二类组的组名
      if (config.key !== data.key) {
        that.modifyTwoGroupByGroupName({
          oldGroupName: config.key,
          newGroupName: data.key
        }, session, function (err) {
          if (err) console.error(CGlobal.serverLang(err.message))
        })
      }
      cb(null, config)
    })
  })
}

SystemConfigSchema.statics.modifyTwoGroupByGroupName = function (groupParam, session, cb) {
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  if (!groupParam.oldGroupName) {
    return cb({message: '旧组名为空'})
  }
  if (!groupParam.newGroupName) {
    return cb({message: '新组名为空'})
  }
  let where = {
    groupName: groupParam.oldGroupName
  }
  let that = this
  this.count(where, function (err, count) {
    if (err) return cb(err)
    if (count === 0) return cb()
    //{ok:代表修改成功,nModified:影响修改的条数,n:修改了几条}
    that.update(where, {$set: {groupName: groupParam.newGroupName}}, {multi: true}, cb)
  })
}

function contrastConfig(type, oldConfig, newConfig, session) {
  let content = []
  //对照表
  let chart = {
    key: 'Key',
    groupName: '组名',
    value: '值',
    desc: '描述'
  }

  CGlobal.forEach(chart, function (key, value) {
    if (oldConfig[key] !== newConfig[key]) {
      content.push(CGlobal.replaceArgs('{0}:{1}->{2}.'
          , CGlobal.serverLang(value), oldConfig[key] || 'null', newConfig[key] || 'null'))
    }
  })

  if (content.length !== 0) {
    if (type === 'ONE') {
      content.unshift(CGlobal.serverLang('编辑{0} 一类配置:', oldConfig.key))//在数组开头插入一个元素
    } else if (type === 'TWO') {
      content.unshift(CGlobal.serverLang('编辑{0} 下{1}二类配置:', oldConfig.groupName
          , oldConfig.key))
    }

    AdminLog.createLog({
      userName: session.adminId,
      content: content.join('\r\n'),
      shopId: session.shopId,
      type: CGlobal.GlobalStatic.Log_Type.CONFIG
    }, session, function (err) {
      if (err) console.error(err)
    })
  }
}

SystemConfigSchema.statics.modifyTwoGroup = function (data, session, cb) {
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  if (!CGlobal.isPlainObject(data)) {
    return cb({message: '参数不能为空'})
  }
  let that = this
  this.checkGroupInfo('TWO', data, function (err) {
    if (err) return cb(err)
    let id = data.id
    delete data.id//id不能改
    that.findByIdAndUpdate(id, {$set: data}, function (err, config) {
      if (err) return cb(err)
      if (!config) return cb({message: 'Key已不存在'})
      contrastConfig('TWO', config, data, session)
      cb(null, config)
    })
  })
}

SystemConfigSchema.statics.deleteGroupById = function (id, session, cb) {
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  if (!Utils.isMongoId(id)) {
    return cb({message: '无效的id值'})
  }
  let that = this
  this.findByIdAndRemove(id, function (err, config) {
    if (err) return cb(err)
    if (!config) return cb({message: 'Key已不存在'})
    let one = ''
    let two = ''
    if (config.groupName) {
      two = CGlobal.serverLang('删除{0} 下{1} 二类配置', config.groupName, config.key)
    } else {
      one = CGlobal.serverLang('删除{0}一类配置', config.key)
      //删除一级下的所有二级
      that.findAllTwoGroupByOneGroup(config.key, session, function (err, result) {
        if (err) {
          console.error(err)
          return
        }
        CGlobal.forEach(result, function (i, value) {
          that.deleteGroupById(value._id + '', session, function () {
          })
        })
      })
    }
    AdminLog.createLog({
      userName: session.adminId,
      content: config.groupName ? two : one,
      shopId: session.shopId,
      type: CGlobal.GlobalStatic.Log_Type.CONFIG
    }, session, function (err) {
      if (err) console.error(err)
    })
    cb(null, config)
  })
}

SystemConfigSchema.statics.findSingleOneGroup = function (key, session, cb) {
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  if (typeof key !== 'string') {
    key = ''
  }
  let where = {
    $and: [{
      groupName: {$exists: false}
    }, {
      key: key
    }]
  }
  this.findOne(where, cb)
}

//不分页查询全部一级组
SystemConfigSchema.statics.findAllOneGroup = function (where, session, cb) {
  let that = this
  this.getFindWhere('ONE', where, session, function (err, searchWhere) {
    if (err) return cb({message: err.message})
    that.find(searchWhere, function (err, result) {
      if (err) return cb(err)
      cb(null, result)
    })
  })
}

//获取查询一二级组的查询条件
SystemConfigSchema.statics.getFindWhere = function (req, session) {
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
    return Promise.reject({
      message: CGlobal.serverLang(req.lang, '抱歉,你没有 [{0}] 权限访问!'
          , 'admin.noRights', CGlobal.Rights.SystemSetup.code)
    })
  }
  const where = req.body
  const cond = where.cond || ''
  const type = where.type
  const shopId = where.shopId
  const groupName = where.groupName
  const searchWhere = {
    $or: [], $and: []
  }

  if (type === 'ONE') {
    //类型是one的就是查询一级组的
    searchWhere.$and.push({
      groupName: {$exists: false}
    })
  } else if (type === 'TWO') {
    //类型是two的就是查询二级组的
    searchWhere.$and.push({
      groupName: groupName || '$$$' // 不传就什么都查不出来
    })
  } else {
    return Promise.reject({
      message: CGlobal.serverLang(req.lang, '无效的TYPE参数', 'systemConfig.invTypeParams')
    })
  }

  CGlobal.forEach(cond.split(' '), function (i, v) {
    if (!v) {
      return true
    }//判断如果v是''或者undefined
    searchWhere.$or.push({
      key: Utils.getIgnoreCase(v, true)
    })
    searchWhere.$or.push({
      value: Utils.getIgnoreCase(v, true)
    })
    searchWhere.$or.push({
      desc: Utils.getIgnoreCase(v, true)
    })
    searchWhere.$or.push({
      groupName: Utils.getIgnoreCase(v, true)
    })
  })
  if (shopId) {
    // 精确查询shopId
    searchWhere.$and.push({
      shopId: Utils.getIgnoreCase(shopId)
    })
  }
  //如果登录的店铺ID不是system
  if (session.shopId !== 'SYSTEM') {
    searchWhere.$and.push({
      shopId: session.shopId
    })
  }
  if (!CGlobal.isSupervisor(session)) {
    // 如果不是超级管理员,需要只能查询自己管理的店铺列表
    // 这里需要加入可以查SYSTEM的配置
    const shopArr = Utils.getShopIds(session)
    searchWhere.$and.push({shopId: {$in: shopArr}})
  }
  if (searchWhere.$or.length === 0) delete searchWhere.$or
  if (searchWhere.$and.length === 0) delete searchWhere.$and
  return Promise.resolve(searchWhere)
}

SystemConfigSchema.statics.findAllTwoGroupByOneGroup = function (groupName, session, cb) {
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  if (typeof groupName !== 'string') {
    groupName = ''
  }
  let where = {
    $and: [{
      groupName: {$exists: true}
    }, {
      groupName: groupName
    }]
  }
  this.find(where, cb)
}

/**
 *
 * @param req
 * @param session
 * 多条件查询,内部使用方法,调用时谨慎传参
 * 兼容_id,一级组名,二级组名查询
 */
SystemConfigSchema.statics.findGroupByWhere = function (req, session) {
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
    return Promise.reject({
      message: CGlobal.serverLang(req.lang, '抱歉,你没有 [{0}] 权限访问!'
          , 'admin.noRights', CGlobal.Rights.SystemSetup.code)
    })
  }
  // 这里会有多条件组合
  const id = req.body.id // 通过_id来查询
  const key = req.body.key // 通过一级组或者二级组的key来查询
  const groupName = req.body.groupName // 只有查询二级时必填,关联一级的key值
  let type = CGlobal.isEmpty(groupName) ? 'ONE' : 'TWO' // 查询类型,默认查询一级组
  const searchWhere = {
    $and: []
  }

  if (!CGlobal.isEmpty(id) && !Utils.isMongoId(id)) {
    return Promise.reject({
      message: CGlobal.serverLang(req.lang, '无效的ID值'
          , 'systemConfig.incID')
    })
  }
  if (!CGlobal.isEmpty(id)) {
    searchWhere.$and.push({
      _id: id
    })
  }
  if (!CGlobal.isEmpty(key)) {
    if (type === 'ONE') {
      //类型是one的就是查询一级组的
      searchWhere.$and.push({
        groupName: {$exists: false}
      })
    } else if (type === 'TWO') {
      //类型是two的就是查询二级组的
      searchWhere.$and.push({
        groupName: groupName || '$$$' // 不传就什么都查不出来
      })
    }
    searchWhere.$and.push({
      key: key
    })
  }

  //如果登录的店铺ID不是system
  if (session.shopId !== 'SYSTEM') {
    searchWhere.$and.push({
      shopId: session.shopId
    })
  }

  if (!CGlobal.isSupervisor(session)) {
    const shopArr = Utils.getShopIds(session)
    searchWhere.$and.push({shopId: {$in: shopArr}})
  }

  if (searchWhere.$and.length === 0) {
    return Promise.reject({
      message: CGlobal.serverLang(req.lang, '必须传入一个条件'
          , 'systemConfig.mustOneWhere')
    })
  }

  return new Promise((resolve, reject) => {
    this.findOne(searchWhere, {__v: 0}, function (err, result) {
      if (err) return reject(err)
      if (!result) return reject({
        message: CGlobal.serverLang(req.lang, '配置不存在'
            , 'systemConfig.noFoundConfig')
      })
      return resolve(CGlobal.modelToJSON(result))
    })
  })

}

// 新增方法
SystemConfigSchema.statics.getSystemGroupPage = async function (req, session) {
  const [errWhere, searchWhere] = await this.getFindWhere(req, session)
      .then(result => [null, result]).catch(err => [err])
  if (errWhere) {
    return Promise.reject(errWhere)
  }
  return new Promise((resolve, reject) => {
    const offset = req.body['offset'] || 1
    const pageSize = req.body['pageSize'] || 30
    const sortOrder = req.body['sortOrder'] || {}
    dao.getPageQuery('SystemConfig', searchWhere, {__v: 0}, sortOrder, offset, pageSize, function (err, result) {
      if (err) {
        console.error(err)
        return reject(err)
      }
      resolve({
        group: result.rows,
        total: result.total
      })
    })
  })
}

conn.model('SystemConfig', SystemConfigSchema)
module.exports = conn.model('SystemConfig')
