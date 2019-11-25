/**
 * Create by CC on 2018/10/14
 */
'use strict';
console.log('require ShopService');

let conn = require('../dao/daoConnection');
let Shop = conn.getEntity('Shop');
let Utils = require('../util/Utils');

function ShopService() {

}

ShopService.isExistShop = function (req, res){
    let session = Utils.getAdminSession(req);
    Shop.isExistShopByUser(req.body.shopId, session, function (err, result) {
        if (err) return res.send({code: 0, msg: err.message});
        result.code = 1;
        res.send(result);
    });
};

ShopService.queryShop = function (req, res){
    let session = Utils.getAdminSession(req);
    Shop.queryShop(req.query, session, function (err, result) {
        if (err) {
            console.error(err);
            return res.send({code: -1, msg: err.message});
        }
        res.send(result);
    });
};

module.exports = ShopService;