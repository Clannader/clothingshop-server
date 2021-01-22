/**
 * Create by CC on 2020/11/21
 */
'use strict'

let express = require('express')
let app = express.Router()
let systemConfigService = require('../../system/SystemConfigService')

app.post('/config/search', systemConfigService.getSystemConfig)
app.post('/group/search', systemConfigService.getSystemGroup)
app.post('/group/create', systemConfigService.createSystemGroup)
app.post('/group/modify', systemConfigService.modifySystemGroup)
app.get('/group/details', systemConfigService.getSystemInfo)

module.exports = app
