/**
 * Create by CC on 2020/11/24
 */
'use strict'
const SwaggerGroup = require('../../schema/SwaggerGroup')

const loginController = require('./LoginController')

class Login extends SwaggerGroup {
  constructor() {
    super()
    this.initPaths()
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
    this.paths = {
      ...this.paths,
      ...path
    }
  }
}

module.exports = new Login()
