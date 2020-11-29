/**
 * Create by CC on 2020/11/28
 */
'use strict'

const CommonResult = require('../../../schema/CommonResult')
const ModelProperty = require('../../../schema/ModelProperty')

class RespLogin extends CommonResult{
  constructor() {
    super()
    this.credential = new ModelProperty('登录凭证', 'string')
    this.session = new ModelProperty('session结构', 'object')
  }
}

module.exports = RespLogin
