/**
 * Create by CC on 2020/11/24
 */
'use strict'

class ResponseSchema {
  constructor(code = 1, desc = '', schema) {
    this.code = code
    this.desc = desc
    if (CGlobal.isPlainObject(schema)) {
      this.schema = {
        '$ref': '#/definitions/' + this.schema.constructor.name
      }
    }
  }
}

module.exports = ResponseSchema
