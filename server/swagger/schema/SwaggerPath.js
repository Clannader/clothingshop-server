/**
 * Create by CC on 2020/11/24
 */
'use strict'

class SwaggerPath {
  constructor(path, method) {
    this.path = path
    this.method = method
    this.summary = ''
    this.description = ''
    this.operationId = ''
    this.consumes = [
      'application/json'
    ]
    this.produces = ['*/*']
    this.parameters = []
    this.responses = {}
  }

}

module.exports = SwaggerPath
