/**
 * Create by CC on 2020/11/21
 */
'use strict'

let express = require('express')
let app = express.Router()
let systemConfigService = require('../../system/SystemConfigService')

app.post('/cms/h5/api/system/config/search', systemConfigService.getSystemConfig)

module.exports = app
