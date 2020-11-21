'use strict';
console.log('require SystemConfigService');

let conn = require('../dao/daoConnection');
let SystemConfig = conn.getEntity('SystemConfig');
let Utils = require('../util/Utils');

function SystemConfigService() {

}

//包括查询一二级分组
SystemConfigService.findAllGroup = function (req, res) {
    let session = Utils.getAdminSession(req);
    let offset = req.body['offset'];
    let pageSize = req.body['pageSize'];
    let sortOrder = req.body['sortOrder'];
    let type = req.body.groupName ? 'TWO' : 'ONE';
    SystemConfig.getFindWhere(type, req.body, session, function (err, searchWhere) {
        if(err)return res.send({code: 0, msg: CGlobal.serverLang(err.message)});
        conn.getPageQuery('SystemConfig', searchWhere, {}, sortOrder, offset, pageSize, function (err, result) {
            if (err) {
                console.error(err);
                return res.send({code: -1, msg: err.message});
            }
            res.send(result);
        });
    });
};

SystemConfigService.addOneGroup = function (req, res) {
    let session = Utils.getAdminSession(req);
    SystemConfig.addOneGroup(req.body, session, function (err) {
        if(err)return res.send({code:0, msg:CGlobal.serverLang(err.message)});
        res.send({code: 1});
    });
};

SystemConfigService.addTwoGroup = function (req, res) {
    let session = Utils.getAdminSession(req);
    SystemConfig.addTwoGroup(req.body, session, function (err) {
        if(err)return res.send({code:0, msg:CGlobal.serverLang(err.message)});
        res.send({code: 1});
    });
};

SystemConfigService.deleteGroupById = function (req, res) {
    let session = Utils.getAdminSession(req);
    SystemConfig.deleteGroupById(req.body.id, session, function (err) {
        if(err)return res.send({code:0, msg:CGlobal.serverLang(err.message)});
        res.send({code: 1});
    });
};

SystemConfigService.modifyOneGroup = function (req, res) {
    let session = Utils.getAdminSession(req);
    SystemConfig.modifyOneGroup(req.body, session, function (err) {
        if(err)return res.send({code:0, msg:CGlobal.serverLang(err.message)});
        res.send({code: 1});
    });
};

SystemConfigService.modifyTwoGroup = function (req, res) {
    let session = Utils.getAdminSession(req);
    SystemConfig.modifyTwoGroup(req.body, session, function (err) {
        if(err)return res.send({code:0, msg:CGlobal.serverLang(err.message)});
        res.send({code: 1});
    });
};

SystemConfigService.findGroupById = function (req, res) {
    let session = Utils.getAdminSession(req);
    SystemConfig.findGroupById(req.body.id, session, function (err, result) {
        if(err)return res.send({code:0, msg:CGlobal.serverLang(err.message)});
        res.send(CGlobal.extend(result, {code: 1}));
    });
};

module.exports = SystemConfigService;