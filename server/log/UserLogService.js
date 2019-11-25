/**
 * Created by CC on 2017/9/17.
 * 操作log业务类
 */
'use strict';
console.log('require UserLogService');

let conn = require('../dao/daoConnection');
let Utils = require('../util/Utils');
let AdminLog = conn.getEntity('AdminLog');
let Shop = conn.getEntity('Shop');

function UserLogService() {

}

UserLogService.getUserLogsList = function (req, res) {
    let session = Utils.getAdminSession(req);
    Shop.findShopList(session, function (err, shopList) {
        session.shopList = shopList;
        AdminLog.queryLog(req.body, session, function (err, result) {
            delete session.shopList;
            if (err) {
                console.error(err);
                return res.send({code: -1, msg: err.message});
            }
            res.send(result);
        });
    });
};

module.exports = UserLogService;