/**
 * Created by CC on 2017/5/6.
 */
'use strict'
//加打印log,看加载时的顺序
console.log('require aboutCMS_route')
let express = require('express')
let app = express.Router()
let AboutCmsService = require('../../aboutCMS/AboutCmsService')

// app.get('/cms/h5/api/about_cms$', AboutCmsService.aboutCms)
// app.get('/cms/h5/api/test/lang', AboutCmsService.testLang)
// app.get('/cms/h5/api/test/version', AboutCmsService.getAppVersion)
app.get('/index$', AboutCmsService.gotoIndex)
app.get('/index/*', AboutCmsService.gotoIndex)

// 设置代理转发到CMBGAPI
// app.post('/cms/h5/api/file/pdf/test', AboutCmsService.gotoNaReport)
// app.get('/cms/h5/api/file/word/test', AboutCmsService.gotoWord)

module.exports = app
