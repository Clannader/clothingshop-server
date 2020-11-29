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
    this.default = undefined
    this.enum = null
    this.schema = {}
  }

  setSchema(schemaName) {
    this.schema = {
      '$ref': `#/definitions/${schemaName}`
    }
  }
}

module.exports = SwaggerParameter
