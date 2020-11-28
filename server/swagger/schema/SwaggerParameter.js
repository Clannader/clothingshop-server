/**
 * Create by CC on 2020/11/28
 */
'use strict'

class SwaggerParameter {
  constructor(name = '') {
    this.name = name
    this.in = 'body'
    this.description = ''
    this.required = false
    this.type = 'string'
    this.default = ''
    this.enum = null
  }
}

module.exports = SwaggerParameter
