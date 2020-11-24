/**
 * Create by CC on 2020/11/24
 */
'use strict'

const SwaggerPath = require('../../schema/SwaggerPath')

class LoginController {
  constructor() {
    this.tags = 'LoginApi'
    this.path = '/cms/h5/api/user'
    this.paths = []
  }

  userLogin() {
    const userLoginPath = new SwaggerPath(`${this.path}/login`, 'post')

    return userLoginPath
  }
}

module.exports = new LoginController()
