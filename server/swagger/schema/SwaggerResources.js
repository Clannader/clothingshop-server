/**
 * Create by CC on 2020/11/24
 */
'use strict'

class SwaggerResources {
  constructor(name = '') {
    this.location = `/v2/api-docs?group=${name}`
    this.url = `/v2/api-docs?group=${name}`
    this.swaggerVersion = '2.0'
    this.name = name
  }
}

module.exports = SwaggerResources
