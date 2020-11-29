/**
 * Create by CC on 2020/11/24
 */
'use strict'

const ResponseSchema = require('../schema/ResponseSchema')
// const CommonResult = require('../schema/CommonResult')

const respArr = []

const successResp = new ResponseSchema(1, '业务成功')
const failResp = new ResponseSchema(0, '业务失败')
const exceptionResp = new ResponseSchema(999, '未知的错误异常')
const noFoundResp = new ResponseSchema(404, '地址找不到')
const errorHeader = new ResponseSchema(900, '请求头错误')
const invalidSession = new ResponseSchema(901, '无效的凭证')
const expireSession = new ResponseSchema(902, '凭证过期')
// const success = new ResponseSchema(200, 'OK', new CommonResult())

respArr.push(successResp)
respArr.push(failResp)
respArr.push(exceptionResp)
respArr.push(noFoundResp)
respArr.push(errorHeader)
respArr.push(invalidSession)
respArr.push(expireSession)
// respArr.push(success)

const responses = {}
CGlobal.forEach(respArr, (i, v) => {
  responses[v.code] = v
})

module.exports = responses
