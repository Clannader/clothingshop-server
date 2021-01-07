/**
 * Create by CC on 2020/4/18
 */
'use strict'

const express = require('express')
const app = express.Router()
const cmsRightsService = require('../../h5/CmsRightsService')

app.post('/getRightsList', cmsRightsService.getRightsList)
app.post('/findRightsById', cmsRightsService.findRightsById)
app.post('/deleteRights', cmsRightsService.deleteRights)
app.post('/createRights', cmsRightsService.createRights)
app.post('/modifyRights', cmsRightsService.modifyRights)
app.post('/getRightsCode', cmsRightsService.getRightsCode)


module.exports = app
