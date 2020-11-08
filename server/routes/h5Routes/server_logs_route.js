/**
 * Create by CC on 2020/10/30
 */
'use strict'

let express = require('express')
let app = express.Router()
let serverLogsService = require('../../log/ServerLogService')

app.get('/cms/h5/api/logs/server/search', serverLogsService.searchLogs)
app.post('/cms/h5/api/logs/server/download', serverLogsService.downloadLogs)

module.exports = app
