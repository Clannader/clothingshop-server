/**
 * Create by CC on 2020/10/30
 */
'use strict'

const express = require('express')
const app = express.Router()
const serverLogsService = require('../../log/ServerLogService')
const userLogsService = require('../../log/UserLogService')

app.get('/cms/h5/api/logs/server/search', serverLogsService.searchLogs)
app.post('/cms/h5/api/logs/server/download', serverLogsService.downloadLogs)
app.post('/cms/h5/api/logs/server/delete', serverLogsService.deleteLogs)

app.post('/cms/h5/api/logs/user/search', userLogsService.getUserLogsList)

module.exports = app
