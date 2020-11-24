/**
 * Create by CC on 2020/11/24
 */
'use strict'

const SwaggerGroupInfo = require('./SwaggerGroupInfo')

class SwaggerGroup {
  constructor() {
    this.swagger = '2.0'
    this.basePath = '/'
    this.info = new SwaggerGroupInfo()
    this.host = 'localhost:3000'
    this.tags = []
    this.path = {}
    this.definitions = {}
  }
}

module.exports = SwaggerGroup
