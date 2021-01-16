/**
 * Create by CC on 2018/11/21
 */
'use strict'

console.log('require login_route')
let express = require('express')
let app = express.Router()
let cmsLoginService = require('../../h5/CmsLoginService')

//给Angular项目和Vue项目调的接口
app.all('/*', cmsLoginService.checkCors)//前端项目接口API允许跨域访问
app.post('/user/login', cmsLoginService.userLogin)
app.post('/user/logout', cmsLoginService.userLogout)

module.exports = app
