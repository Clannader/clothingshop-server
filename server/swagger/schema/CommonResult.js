/**
 * Create by CC on 2020/11/24
 */
'use strict'

const DefinitionsBase = require('./DefinitionsBase')
const ModelProperty = require('./ModelProperty')

class CommonResult extends DefinitionsBase{
  constructor() {
    super()
    this.code = new ModelProperty('响应代码', 'string', false)
    this.msg = new ModelProperty('错误信息')

    this.setProperties()
    this.initRequired()
  }
}

module.exports = CommonResult
