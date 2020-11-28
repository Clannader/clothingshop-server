/**
 * Create by CC on 2020/11/24
 */
'use strict'

const DefinitionsBase = require('./DefinitionsBase')
const ModelProperty = require('./ModelProperty')

class CommonResult extends DefinitionsBase{
  constructor() {
    super()
    this.code = new ModelProperty('响应代码', 'number')
    this.msg = new ModelProperty('错误信息', 'string').setRequired(false)

    this.setProperties()
    this.initRequired()
  }
}

module.exports = CommonResult
