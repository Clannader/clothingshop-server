/**
 * Create by CC on 2018/11/21
 */
'use strict';

let adminUserService = require('../user/AdminUserService');

function CmsUserService() {

}

CmsUserService.getUsersList = function (req, res) {
    adminUserService.getUsersList.apply(this, arguments);
};

CmsUserService.deleteUser = function (req, res) {
    adminUserService.deleteUser.apply(this, arguments);
};

CmsUserService.createUser = function (req, res) {
    adminUserService.createUser.apply(this, arguments);
};

CmsUserService.modifyUser = function (req, res) {
    adminUserService.modifyUser.apply(this, arguments);
};

CmsUserService.changeStatus = function (req, res){
    adminUserService.changeStatus.apply(this, arguments);
};

CmsUserService.getUserById = function (req, res) {
    adminUserService.getUserById.apply(this, arguments);
};

CmsUserService.setupPws = function (req, res){
    adminUserService.setupPws.apply(this, arguments);
};

module.exports = CmsUserService;