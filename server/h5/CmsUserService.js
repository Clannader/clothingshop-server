/**
 * Create by CC on 2018/11/21
 */
'use strict'

const adminUserService = require('../user/AdminUserService')
const Utils = require('../util/Utils')
const dao = require('../dao/daoConnection')
const Admin = dao.getEntity('Admin')

function CmsUserService() {

}

CmsUserService.getUsersList = function (req, res) {
  adminUserService.getUsersList.apply(this, arguments)
}

CmsUserService.deleteUser = function (req, res) {
  adminUserService.deleteUser.apply(this, arguments)
}

CmsUserService.createUser = function (req, res) {
  adminUserService.createUser.apply(this, arguments)
}

CmsUserService.modifyUser = function (req, res) {
  adminUserService.modifyUser.apply(this, arguments)
}

CmsUserService.changeStatus = function (req, res) {
  adminUserService.changeStatus.apply(this, arguments)
}

CmsUserService.getUserById = function (req, res) {
  adminUserService.getUserById.apply(this, arguments)
}

CmsUserService.setupPws = function (req, res) {
  adminUserService.setupPws.apply(this, arguments)
}

CmsUserService.getUserRoles = async function (req, res) {
  const session = Utils.getAdminSession(req)
  const rights = session.rights.join(',')
  // delete session.rights
  return res.send({
    code: 100,
    roles: rights,
    session: Utils.getTemplateSession(session)
  })
}

CmsUserService.changePassword = function (req, res) {
  let session = Utils.getAdminSession(req)
  Admin.changePassword(req, session).then(() => {
    res.send({code: 100})
  }).catch(err => {
    res.send({code: 999, msg: err.message})
  })
}

module.exports = CmsUserService
