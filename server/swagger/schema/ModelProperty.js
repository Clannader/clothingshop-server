/**
 * Create by CC on 2020/11/25
 */
'use strict'

class ModelProperty {
    constructor(desc = '',  type= 'string', isEmpty = true) {
      this.type = type
      this.description = desc
      this.allowEmptyValue = isEmpty
    }
}

module.exports = ModelProperty
