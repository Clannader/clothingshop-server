/**
 * Created by CC on 2017/9/4.
 */
'use strict'
console.log('require RightsService')

let conn = require('../dao/daoConnection')
let Rights = conn.getEntity('Rights')
let Utils = require('../util/Utils')

function RightsService() {

}

// 获取权限列表
RightsService.getRightsList = function (req, res) {
  let session = Utils.getAdminSession(req)
  Rights.getAllRights(req, session, function (err, result) {
    if (err) {
      // console.error(err)
      return res.send({code: 999, msg: err.message})
    }
    res.send({code: 100, rights: result.rows, total: result.total})
  })
}

RightsService.findRightsById = function (req, res) {
  // let id = req.params.id
  let session = Utils.getAdminSession(req)
  Rights.findRightById(req, session, function (err, result) {
    if (err) return res.send({code: 999, msg: err.message})
    res.send({code: 100, rights: result})
  })
}

//删除单个
RightsService.deleteRights = function (req, res) {
  // let id = req.params.id
  let session = Utils.getAdminSession(req)
  Rights.deleteRights(req, session, function (err) {
    if (err) return res.send({code: 999, msg: err.message})
    res.send({code: 100})
  })
}

// 删除多个权限方法废除
// 删除多个
// RightsService.deleteMultiple = function (req, res) {
//   let session = Utils.getAdminSession(req)
//   Rights.deleteMultipleRights(req.body['ids'], session, function (err, result) {
//     if (err) return res.send({code: 999, msg: CGlobal.serverLang(err.message)})
//     res.send({code: 100, msg: result})
//   })
// }

//创建权限组
RightsService.createRights = function (req, res) {
  let session = Utils.getAdminSession(req)
  Rights.createRights(req, session, function (err) {
    if (err) {
      return res.send({code: 999, msg: err.message})
    }
    res.send({code: 100, msg: CGlobal.serverLang(req.lang, '创建成功', 'rightsGroup.createSuccess')})
  })
}

//修改权限组
RightsService.modifyRights = function (req, res) {
  let session = Utils.getAdminSession(req)
  Rights.modifyRights(req, session, function (err) {
    if (err) return res.send({code: 999, msg: err.message})
    res.send({code: 100, msg: CGlobal.serverLang(req.lang, '修改成功', 'rightsGroup.modifySuccess')})
  })
}

// 获取用户能够设置的权限代码
RightsService.getRightsCode = function (req, res) {
  let adminSession = Utils.getAdminSession(req)
  if (!CGlobal.isPermission(adminSession.rights, CGlobal.Rights.RightsSetup.code)) {
    return res.send({code: 100, rightsCode: []})
  }
  return res.send({code: 100, rightsCode: Utils.getRightsArray(req.lang, adminSession)})
}

module.exports = RightsService
