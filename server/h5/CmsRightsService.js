/**
 * Create by CC on 2020/4/18
 */
'use strict'

let rightsService = require('../rights/RightsService')

function CmsRightsService() {

}

CmsRightsService.getRightsList = function () {
    rightsService.getRightsList.apply(this, arguments)
}

CmsRightsService.findRightsById = function () {
    rightsService.findRightsById.apply(this, arguments)
}

CmsRightsService.deleteRights = function () {
    rightsService.deleteRights.apply(this, arguments)
}

CmsRightsService.createRights = function () {
    rightsService.createRights.apply(this, arguments)
}

CmsRightsService.modifyRights = function () {
    rightsService.modifyRights.apply(this, arguments)
}

CmsRightsService.getRightsCode = function () {
    rightsService.getRightsCode.apply(this, arguments)
}

module.exports = CmsRightsService
