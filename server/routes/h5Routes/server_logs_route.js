/**
 * Create by CC on 2020/10/30
 */
'use strict'

const express = require('express')
const app = express.Router()
const serverLogsService = require('../../log/ServerLogService')
const userLogsService = require('../../log/UserLogService')

app.get('/server/search', serverLogsService.searchLogs)
app.post('/server/download', serverLogsService.downloadLogs)
app.post('/server/delete', serverLogsService.deleteLogs)

app.post('/user/search', userLogsService.getUserLogsList)

module.exports = app
