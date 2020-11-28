/**
 * Create by CC on 2020/11/24
 */
'use strict'
const SwaggerGroup = require('../../schema/SwaggerGroup')

const loginController = require('./LoginController')
const CommonResult = require('../../schema/CommonResult')
const lib = require('./lib')

class Login extends SwaggerGroup {
  constructor() {
    super()
    this.initPaths()
    this.setDefinitions(new CommonResult())
  }

  initPaths() {
    this.setPath(loginController.userLogin())
  }

  setPath(swaggerPath) {
    const path = {}
    path[swaggerPath.path] = {}
    path[swaggerPath.path][swaggerPath.method] = {
      tags: [swaggerPath.tags],
      ...swaggerPath
    }
    const schemaList = this.getSchemaList(swaggerPath)// 获取全部ref结构
    schemaList.forEach(v => {
      this.setDefinitions(new lib[v])
    })
    this.paths = {
      ...this.paths,
      ...path
    }
  }
}

module.exports = new Login()
