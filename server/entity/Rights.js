/**
 * Created by CC on 2017/7/2.
 */
'use strict'
console.log('require Rights')
let Schema = require('mongoose').Schema
let dao = require('../dao/daoConnection')
let conn = dao.getConnection()
let AdminLog = require('./super/AdminLog')
let async = require('async')
let Utils = require('../util/Utils')
let Rights = {
  groupName: {
    type: String
    , trim: true
    , required: true
    , unique: true
    , validate: [function (value) {
      return value.length <= 30
    }, 'Groupname length is more than 30.']
    , match: CGlobal.GlobalStatic.rightsNameExp
  },//权限组名
  desc: {
    type: String
    , trim: true
    , validate: [function (value) {
      return value.length <= 150
    }, 'Description length is more than 150.']
  },//权限组描述
  rightsCode: {
    type: String
    , required: true
    , match: CGlobal.GlobalStatic.rightsExp
  }//权限组代码
}
let RightsSchema = new Schema(Rights)

RightsSchema.statics.deleteRights = function (id, session, cb) {
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.RightsSetup.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  if (!Utils.isMongoId(id)) {
    return cb({message: '无效的id值'})
  }
  // this.findByIdAndRemove(id, function (err, right) {
  //     if (err) return cb(err);
  //     if (!right) return cb({message: '权限组已不存在'});
  //     AdminLog.createLog({
  //         userName: session.adminId,
  //         content: CGlobal.serverLang('删除{0}权限组', right.groupName),
  //         shopId: session.shopId,
  //         type: CGlobal.GlobalStatic.Log_Type.Right
  //     }, session, function (err) {
  //         if (err) console.error(err);
  //     });
  //     cb(err, right);
  // });

  let that = this
  this.findById(id, function (err, right) {
    if (err) return cb(err)
    if (!right) return cb({message: '权限组已不存在'})
    if (!isAllowUpdate(session.rights, right.rightsCode)) {
      return cb({message: '你没有权限删除该权限组!'})
    }
    that.remove({_id: id}, function (err) {
      AdminLog.createLog({
        userName: session.adminId,
        content: CGlobal.serverLang('删除 {0} 权限组', right.groupName),
        shopId: session.shopId,
        type: CGlobal.GlobalStatic.Log_Type.Right
      }, session, function (err) {
        if (err) console.error(err)
      })
      cb(err, right)
    })
  })
}

RightsSchema.statics.createRights = function (data, session, cb) {
  delete data.id
  let that = this
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.RightsSetup.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  this.checkRightsInfo(data, session, function (err) {
    if (err) return cb(err)
    that.create(data, function (err, right) {
      if (err) return cb(err)
      AdminLog.createLog({
        userName: session.adminId,
        content: CGlobal.serverLang('创建 {0} 权限组', right.groupName),
        shopId: session.shopId,
        type: CGlobal.GlobalStatic.Log_Type.Right
      }, session, function (err) {
        if (err) console.error(err)
      })
      cb()
    })
  })
}

RightsSchema.statics.checkRightsInfo = function (data, session, cb) {
  let name = data.groupName
  let code = data.rightsCode

  if (!name) {
    return cb({message: '请输入权限组名'})
  }
  if (!name.match(CGlobal.GlobalStatic.nameExp)) {
    return cb({message: '组名含有特殊字符'})
  }
  if (!code) {
    return cb({message: '请输入权限代码'})
  }

  if (!isAllowUpdate(session.rights, code)) {
    return cb({message: '权限代码越权'})
  }

  let where = {groupName: {$regex: '^' + name + '$', $options: 'i'}}

  if (data.id) {
    where._id = {$ne: data.id}
  }

  this.count(where, function (err, count) {
    if (err) return cb(err)
    if (count > 0) return cb({message: '组名已存在'})
    cb()
  })
}

RightsSchema.statics.modifyRights = function (data, session, cb) {
  let that = this
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.RightsSetup.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  this.checkRightsInfo(data, session, function (err) {
    if (err) return cb(err)
    let id = data.id
    delete data.id//id不能改
    // that.findByIdAndUpdate(id, {$set: data}, function (err, rights) {
    //     if (err) return cb(err);
    //     if (!rights) return cb({message: '权限组已不存在'});
    //     contrastRights(data, rights, session);
    //     cb(err, rights);
    // });

    //这里要分2步走
    that.findById(id, function (err, oldRights) {
      if (err) return cb(err)
      if (!oldRights) return cb({message: '权限组已不存在'})
      if (!isAllowUpdate(session.rights, oldRights.rightsCode)) {
        return cb({message: '你没有权限修改该权限组!'})
      }
      that.update({_id: id}, {$set: data}, function (err) {
        contrastRights(data, oldRights, session)
        cb(err, oldRights)
      })
    })
  })
}

//比较新旧两个权限组数据,看哪个字段被修改,然后写LOG
function contrastRights(newRights, oldRights, session) {
  let content = []
  //对照表
  let chartRights = {
    groupName: '权限组名',
    desc: '权限组描述',
    rightsCode: '权限组代码'
  }

  CGlobal.forEach(chartRights, function (key, value) {
    if (newRights[key] !== oldRights[key]) {
      content.push(CGlobal.replaceArgs('{0}:{1}->{2}.'
          , CGlobal.serverLang(value), oldRights[key] || 'null', newRights[key] || 'null'))
    }
  })

  if (content.length !== 0) {
    content.unshift(CGlobal.serverLang('编辑 {0} 权限组:', oldRights.groupName))//在数组开头插入一个元素
    AdminLog.createLog({
      userName: session.adminId,
      content: content.join('<br>'),
      shopId: session.shopId,
      type: CGlobal.GlobalStatic.Log_Type.Right
    }, session, function (err) {
      if (err) console.error(err)
    })
  }
}

//比较该用户是否能操作改权限组
function isAllowUpdate(userRights, rightsCode) {
  //如果用户的权限代码不能包含编辑的权限代码,就不能修改这个权限组
  if (userRights === CGlobal.GlobalStatic.Supervisor_Rights) return true
  let codeArray = rightsCode.split(',')
  let flag = true
  codeArray.forEach(function (value) {
    if (userRights.indexOf(value) === -1) {
      flag = false
      return false
    }
  })
  return flag
}

RightsSchema.statics.deleteMultipleRights = function (ids, session, cb) {
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.RightsSetup.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  if (!Array.isArray(ids)) return cb({message: 'The param ids is not Array.'})
  let that = this
  let errRes = []//失败的结果数和原因
  let successCount = 0//成功的结果数
  async.eachOfSeries(ids, function (value, key, callback) {
    that.deleteRights(value, session, function (err) {
      if (err) {
        let index = key + 1 - successCount
        errRes.push(index + '):' + CGlobal.serverLang(err.message))
      } else {
        successCount++
      }
      callback()
    })
  }, function () {
    let result = []
    result.push(CGlobal.serverLang('删除失败:{0}个', errRes.length))
    if (errRes.length !== 0) {
      result.push(CGlobal.serverLang('失败原因:{0}{1}', '<br>', errRes.join('<br>')))
    }
    result.push(CGlobal.serverLang('成功删除:{0}个', successCount))
    cb(null, result.join('<br>'))
  })
}

RightsSchema.statics.findRightById = function (req, session, cb) {
  let id = req.body.id
  if (CGlobal.isEmpty(id)) {
    return cb({message: CGlobal.serverLang(req.lang, '权限ID不能为空', 'rightsGroup.idEmpty')})
  }
  if (!Utils.isMongoId(id)) {
    return cb({message: CGlobal.serverLang(req.lang, '无效的ID值', 'rightsGroup.invID')})
  }
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.RightsSetup.code)) {
    return cb({message: CGlobal.serverLang(req.lang, '抱歉,你没有 [{0}] 权限访问!'
          , 'admin.noRights', CGlobal.Rights.RightsSetup.code)})
  }
  const field = {groupName: 1, rightsCode: 1, desc: 1}
  this.findById(id, field, function (err, result) {
    if (err) {
      return cb(err)
    }
    if (!result || !isAllowUpdate(session.rights, result.rightsCode)) {
      return cb({message: CGlobal.serverLang(req.lang, '权限组不存在', 'rightsGroup.noExistGroup')})
    }
    cb(null, result)
  })
}

RightsSchema.statics.queryRights = function (searchWhere, session, cb) {
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.RightsSetup.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  let groupName = searchWhere['groupName']
  let where = {}//查询条件
  if (groupName) {
    where.groupName = Utils.getIgnoreCase(groupName, true)
  }
  // let userRights = session.rights;
  // where.$where = function () {
  //     // if('ALL' === 'ALL')return true;
  //     let codeArray = this.rightsCode.split(',');
  //     let flag = true;
  //     codeArray.forEach(function (value) {
  //         if (''.indexOf(value) === -1) {
  //             flag = false;
  //             return false;
  //         }
  //     });
  //     return flag;
  // };
  let offset = searchWhere['offset']
  let pageSize = searchWhere['pageSize']
  let sortOrder = searchWhere['sortOrder']
  dao.getPageQuery('Rights', where, {}, sortOrder, offset, pageSize, cb)
}

RightsSchema.statics.queryAllRights = function (searchWhere, session, cb) {
  searchWhere['pageSize'] = 'ALL'
  searchWhere['offset'] = '0'
  this.queryRights(searchWhere, session, cb)
}

/**
 *
 * @param searchWhere {groupName:1}
 * @param session
 * @param cb
 * @return {*}
 */
RightsSchema.statics.getAllRights = function (req, session, cb) {
  const searchWhere = req.body
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.RightsSetup.code)) {
    return cb({message: CGlobal.serverLang(req.lang, '抱歉,你没有 [{0}] 权限访问!'
            , 'admin.noRights', CGlobal.Rights.RightsSetup.code)})
  }
  let groupName = searchWhere['groupName']
  let where = {}//查询条件
  if (groupName) {
    where.groupName = Utils.getIgnoreCase(groupName, true)
  }
  let userRights = session.rights
  // 这里如果以后有优化,那就返回指定自定给前端
  const field = {groupName: 1, rightsCode: 1, desc: 1}
  this.find(where, field, function (err, result) {
    if (err) return cb(err)
    // if (userRights === CGlobal.GlobalStatic.Supervisor_Rights) return cb(null, result)
    if (CGlobal.isSupervisor(session)) return cb(null, result)
    let array = []
    result.forEach(function (value) {
      if (isAllowUpdate(userRights, value.rightsCode)) {
        array.push(value)
      }
    })
    cb(null, array)
  }).sort(Utils.getSortOrder(searchWhere['sortOrder']))
}

// 内部方法获取用户的权限集合
RightsSchema.statics._getAdminRights = function (rights = '') {
  // 写权限内部获取算法
  // 权限由于是以,号分隔的,所以先以,变成数组
  const arrayRights = rights.split(',')
  // 抽离成3组,字母,数字,带-号的
  const letterArr = []//字母组
  const numberArr = []//数字组
  const lessArr = []//减号组
  arrayRights.forEach(v => {
    if (v.match(/^[A-Za-z]+$/)) {
      letterArr.push(v)
    } else if (v.startsWith('-')) {
      lessArr.push(v)
    } else if (v.match(/^[0-9]+$/)) {
      numberArr.push(v)
    }
  })
  return new Promise(((resolve, reject) => {
    const where = {
      groupName: {
        $in: letterArr
      }
    }
    this.find(where, {rightsCode: 1}, function (err, result) {
      if (err) {
        return reject(err)
      }
      let rightsArr = []
      result.forEach(v => {
        // 数组拼接
        rightsArr = rightsArr.concat(v.rightsCode.split(','))
      })
      // 数组去重复
      const rightSet = new Set(rightsArr)
      numberArr.forEach(value => {
        rightSet.add(value)
      })
      lessArr.forEach(value => {
        rightSet.delete(value.substring(1))
      })
      resolve(Array.from(rightSet))
    })
  }))
}

conn.model('Rights', RightsSchema)
module.exports = conn.model('Rights')
