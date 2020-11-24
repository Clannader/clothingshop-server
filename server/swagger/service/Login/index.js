/**
 * Create by CC on 2020/11/24
 */
'use strict'
const SwaggerGroup = require('../../schema/SwaggerGroup')

const loginController = require('./LoginController')

console.log(Object.getOwnPropertyNames(loginController))

class Login extends SwaggerGroup {
  constructor() {
    super()
  }
}

module.exports = new Login()
