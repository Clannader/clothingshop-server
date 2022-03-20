/**
 * Create by CC on 2020/11/21
 */
'use strict'

let express = require('express')
let app = express.Router()
let systemConfigService = require('../../system/SystemConfigService')

app.post('/cms/h5/api/system/config/search', systemConfigService.getSystemConfig)
app.post('/cms/h5/api/system/group/search', systemConfigService.getSystemGroup)
app.post('/cms/h5/api/system/group/create', systemConfigService.createSystemGroup)
app.post('/cms/h5/api/system/group/modify', systemConfigService.modifySystemGroup)
app.get('/cms/h5/api/system/group/details', systemConfigService.getSystemInfo)

module.exports = app
