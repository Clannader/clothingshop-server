/**
 * Created by CC on 2017/10/26.
 */
'use strict'
console.log('require AdminUserService')
let dao = require('../dao/daoConnection')
let Admin = dao.getEntity('Admin')
// let Shop = dao.getEntity('Shop')

let Utils = require('../util/Utils')

function AdminUserService() {

}

AdminUserService.getUsersList = function (req, res) {
  let session = Utils.getAdminSession(req)
  Admin.queryAdmins(req, session, function (err, result) {
    if (err) {
      console.error(err)
      return res.send({code: -1, msg: err.message})
    }
    res.send({code: 1, users: result.rows, total: result.total})
  })
}

AdminUserService.deleteUser = function (req, res) {
  //删除用户只能删除单个,有权限才能删除
  let session = Utils.getAdminSession(req)
  let id = req.params.id
  Admin.deleteAdminUser(id, session, function (err) {
    if (err) {
      return res.send({code: 0, msg: CGlobal.serverLang(err.message, err.code)})
    }
    res.send({code: 1})
  })
}

AdminUserService.createUser = function (req, res) {
  let session = Utils.getAdminSession(req)
  Admin.createAdminUser(req.body, session, function (err, result) {
    if (err) {
      return res.send({code: 0, msg: CGlobal.serverLang(err.message)})
    }
    res.send({code: 1, msg: CGlobal.serverLang('创建成功,初始密码为123456abc,请尽快修改密码'), adminId: result.adminId})
  })
}

AdminUserService.modifyUser = function (req, res) {
  let session = Utils.getAdminSession(req)
  Admin.modifyAdminUser(req.body, session, function (err, result) {
    if (err) {
      return res.send({code: 0, msg: CGlobal.serverLang(err.message, err.code)})
    }
    res.send({code: 1, msg: CGlobal.serverLang('修改成功'), adminId: result.adminId})
  })
}

AdminUserService.changeStatus = function (req, res) {
  let session = Utils.getAdminSession(req)
  Admin.changeStatusById(req.body.id, req.body.status, session, function (err) {
    if (err) return res.send({code: 0, msg: CGlobal.serverLang(err.message, err.code)})
    res.send({code: 1})
  })
}

AdminUserService.getUserById = function (req, res) {
  let id = req.body['id']
  let session = Utils.getAdminSession(req)
  Admin.findBy_Id(id, session, function (err, user) {
    if (err) return res.send({code: 0, msg: CGlobal.serverLang(err.message, err.code)})
    let result = {user: user, code: 1}
    if (user.shopId === 'SYSTEM') {
      result.supplierCode = session.supplierCode
    } else {
      result.supplierCode = user.supplierCode
    }
    res.send(result)
  })
}

AdminUserService.setupPws = function (req, res) {
  let session = Utils.getAdminSession(req)
  Admin.setupPws(req.body, session, function (err) {
    if (err) return res.send({code: 0, msg: CGlobal.serverLang(err.message, err.code)})
    res.send({code: 1, msg: CGlobal.serverLang('修改成功')})
  })
}

module.exports = AdminUserService
