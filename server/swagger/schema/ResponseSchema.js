/**
 * Create by CC on 2020/11/24
 */
'use strict'

class ResponseSchema {
  constructor(code = 1, desc = '', schema) {
    this.code = code
    this.description = desc
    if (!CGlobal.isEmpty(schema)
        && schema.toString() === '[object Object]'
        && schema.constructor.name !== 'Object') {
      this.schema = {
        '$ref': '#/definitions/' + schema.constructor.name
      }
    }
  }
}

module.exports = ResponseSchema
