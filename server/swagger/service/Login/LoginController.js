/**
 * Create by CC on 2020/11/24
 */
'use strict'

const SwaggerPath = require('../../schema/SwaggerPath')
const SwaggerParameter = require('../../schema/SwaggerParameter')

class LoginController {
  constructor() {
    this.tags = 'LoginApi'
    this.path = '/cms/h5/api/user'
    this.paths = []
  }

  userLogin() {
    const userLoginPath = new SwaggerPath(`${this.path}/login`, 'post')
    userLoginPath.description = '系统登录接口'
    userLoginPath.summary = '系统登录接口 Summary'
    userLoginPath.operationId = 'userLogin'
    userLoginPath.tags.push(this.tags)

    // const adminId = new SwaggerParameter('adminId')
    // adminId.description = '用户ID'
    // adminId.required = true
    //
    // const adminPws = new SwaggerParameter('adminPws')
    // adminPws.description = '用户密码'
    // adminPws.required = true

    // userLoginPath.parameters.push(adminId)
    // userLoginPath.parameters.push(adminPws)

    // 登录接口删除credential
    const credentialIndex = userLoginPath.parameters.findIndex(v => v.name === 'credential')
    userLoginPath.parameters.splice(credentialIndex, 1)
    return userLoginPath
  }
}

module.exports = new LoginController()
