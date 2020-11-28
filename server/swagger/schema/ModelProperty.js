/**
 * Create by CC on 2020/11/25
 */
'use strict'

class ModelProperty {
    constructor(desc = '',  type= 'string', required = true) {
      this.type = type
      this.description = desc
      this.allowEmptyValue = false
      this.required = required
    }

    setRequired(required = true) {
      this.required = required
      return this
    }

    setAllowEmptyValue(isEmpty = false) {
      this.allowEmptyValue = isEmpty
      return this
    }
}

module.exports = ModelProperty
