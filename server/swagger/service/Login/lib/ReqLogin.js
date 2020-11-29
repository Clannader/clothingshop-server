/**
 * Create by CC on 2020/11/28
 */
'use strict'

const DefinitionsBase = require('../../../schema/DefinitionsBase')
const ModelProperty = require('../../../schema/ModelProperty')

class ReqLogin extends DefinitionsBase {
  constructor() {
    super()
    this.adminId = new ModelProperty('用户ID', 'string')
    this.adminPws = new ModelProperty('用户密码', 'string')

    this.setProperties()
    this.initRequired()
  }
}

module.exports = ReqLogin
