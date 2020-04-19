/**
 * Create by CC on 2020/4/18
 */
'use strict'

const express = require('express')
const app = express.Router()
const cmsRightsService = require('../../h5/CmsRightsService')

app.post('/cms/h5/api/rights/getRightsList',cmsRightsService.getRightsList)
app.post('/cms/h5/api/rights/findRightsById',cmsRightsService.findRightsById)
app.post('/cms/h5/api/rights/deleteRights',cmsRightsService.deleteRights)
app.post('/cms/h5/api/rights/createRights',cmsRightsService.createRights)
app.post('/cms/h5/api/rights/modifyRights',cmsRightsService.modifyRights)
app.post('/cms/h5/api/rights/getRightsCode',cmsRightsService.getRightsCode)


module.exports = app
