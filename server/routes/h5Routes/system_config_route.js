/**
 * Create by CC on 2020/11/21
 */
'use strict'

let express = require('express')
let app = express.Router()
let systemConfigService = require('../../system/SystemConfigService')

app.post('/config/search', systemConfigService.getSystemConfig)
app.post('/group/search', systemConfigService.getSystemGroup)

module.exports = app
