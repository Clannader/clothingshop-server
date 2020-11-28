/**
 * Create by CC on 2020/11/24
 */
'use strict'

const SwaggerPath = require('../../schema/SwaggerPath')
const SwaggerParameter = require('../../schema/SwaggerParameter')
const ResponseSchema = require('../../schema/ResponseSchema')

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
    userLoginPath.responses['200'] = new ResponseSchema(200, 'OK', 'RespLogin')

    const params = new SwaggerParameter('params')
    params.in = 'body'
    params.description = '请求参数'
    params.required = true
    params.setSchema('ReqLogin')
    userLoginPath.parameters.push(params)

    // 登录接口删除credential
    const credentialIndex = userLoginPath.parameters.findIndex(v => v.name === 'credential')
    userLoginPath.parameters.splice(credentialIndex, 1)
    return userLoginPath
  }
}

module.exports = new LoginController()
