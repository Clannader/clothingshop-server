/**
 * Create by CC on 2020/11/24
 */
'use strict'

const publicResp = require('./PublicResp')

class SwaggerPath {
  constructor(path, method) {
    this.path = path
    this.method = method
    this.description = ''
    this.summary = ''
    this.operationId = ''
    this.tags = []
    this.consumes = [
      'application/json'
    ]
    this.produces = ['*/*']
    this.parameters = []
    this.responses = publicResp
  }
}

module.exports = SwaggerPath
