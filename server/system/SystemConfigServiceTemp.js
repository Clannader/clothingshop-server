'use strict';
console.log('require SystemConfigService');

let conn = require('../dao/daoConnection');
let SystemConfig = conn.getEntity('SystemConfig');
let Utils = require('../util/Utils');

function SystemConfigService() {

}

SystemConfigService.addOneGroup = function (req, res) {
    let session = Utils.getAdminSession(req);
    SystemConfig.addOneGroup(req.body, session, function (err) {
        if(err)return res.send({code:0, msg:CGlobal.serverLang(err.message)});
        res.send({code: 100});
    });
};

SystemConfigService.addTwoGroup = function (req, res) {
    let session = Utils.getAdminSession(req);
    SystemConfig.addTwoGroup(req.body, session, function (err) {
        if(err)return res.send({code:0, msg:CGlobal.serverLang(err.message)});
        res.send({code: 100});
    });
};

SystemConfigService.deleteGroupById = function (req, res) {
    let session = Utils.getAdminSession(req);
    SystemConfig.deleteGroupById(req.body.id, session, function (err) {
        if(err)return res.send({code:0, msg:CGlobal.serverLang(err.message)});
        res.send({code: 100});
    });
};

SystemConfigService.modifyOneGroup = function (req, res) {
    let session = Utils.getAdminSession(req);
    SystemConfig.modifyOneGroup(req.body, session, function (err) {
        if(err)return res.send({code:0, msg:CGlobal.serverLang(err.message)});
        res.send({code: 100});
    });
};

SystemConfigService.modifyTwoGroup = function (req, res) {
    let session = Utils.getAdminSession(req);
    SystemConfig.modifyTwoGroup(req.body, session, function (err) {
        if(err)return res.send({code:0, msg:CGlobal.serverLang(err.message)});
        res.send({code: 100});
    });
};


module.exports = SystemConfigService;
