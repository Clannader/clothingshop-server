/**
 * Create by CC on 2020/11/24
 */
'use strict'

const publicResp = require('./PublicResp')
const SwaggerParameter = require('./SwaggerParameter')

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

    this.initHeader()
  }

  initHeader() {
    const lang = new SwaggerParameter('language')
    lang.in = 'header'
    lang.description = '语言类型'
    lang.default = 'CN'
    lang.enum = ['CN', 'EN']

    const credential = new SwaggerParameter('credential')
    credential.in = 'header'
    credential.description = '登录凭证'
    credential.required = true

    const xReq = new SwaggerParameter('x-requested-with')
    xReq.in = 'header'
    xReq.description = '固定请求头'
    xReq.required = true
    xReq.default = 'XMLHttpRequest'

    this.parameters.push(credential)
    this.parameters.push(lang)
    this.parameters.push(xReq)
  }
}

module.exports = SwaggerPath
