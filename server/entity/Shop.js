/**
 * Created by CC on 2017/11/4.
 */
'use strict';
console.log('require Shop');
let Schema = require('mongoose').Schema;
let dao = require('../dao/daoConnection');
let conn = dao.getConnection();
let Utils = require('../util/Utils');
let Shop = {
    shopId: {
        type: String
        , trim: true
        , required: true
        , unique: true
        , validate: [function (value) {
            return value.length <= 20;
        }, 'Shop id length is more than 20.']
        , match: CGlobal.GlobalStatic.codeExp
    },//店铺ID
    shopName: {
        type: String
        , trim: true
        , required: true
        , validate: [function (value) {
            return value.length <= 50;
        }, 'Shop name length is more than 50.']
        , match: CGlobal.GlobalStatic.nameExp
    },//店铺的名字
    supplierCode: {
        type: String
        , default: 'Default'
        , required: true
    }//供应商code
};
let ShopSchema = new Schema(Shop);

//判断是否存在这个店铺ID
ShopSchema.statics.isExistShop = function (shopId, cb) {
    if (typeof shopId !== 'string') return cb({message: CGlobal.serverLang('{0} 店铺不存在', shopId)});
    if (shopId.toUpperCase() === CGlobal.GlobalStatic.User_Type.SYSTEM) return cb();
    this.count({shopId: Utils.getIgnoreCase(shopId)}, function (err, result) {
        if (err) return cb(err);
        if (result === 0) {
            return cb({message: CGlobal.serverLang('{0} 店铺不存在', shopId)});
        }
        cb();
    });
};

//获取店铺信息
ShopSchema.statics.getShopInfo = function (shopId, cb) {
    let that = this;
    this.isExistShop(shopId, function (err) {
        if (err) return cb(err);
        that.findOne({shopId: Utils.getIgnoreCase(shopId)}, cb);
    });
};

/**
 * 这个方法判断是否存在店铺,需要传session,用户判断用户是否有权限使用SYSTEM店铺
 */
ShopSchema.statics.isExistShopByUser = function (shopId, session, cb) {
    if (CGlobal.isPermission(session.rights, CGlobal.Rights.CreateSYSUser.code) && session.shopId === 'SYSTEM'
        || !(shopId && shopId.toUpperCase() === 'SYSTEM')) {
        //搬运isExistShop方法
        if (typeof shopId !== 'string') return cb({message: CGlobal.serverLang('{0} 店铺不存在', shopId)});
        if (shopId.toUpperCase() === CGlobal.GlobalStatic.User_Type.SYSTEM) return cb(null, {supplierCode: session.supplierCode});
        this.getShopInfoByUser(shopId, session, function (err, result) {
            if (err) return cb(err);
            if (!result) {
                return cb({message: CGlobal.serverLang('{0} 店铺不存在', shopId)});
            }
            cb(null, {supplierCode: result.supplierCode});
        });
    } else {
        return cb({message: CGlobal.serverLang('{0} 店铺不存在', shopId)});
    }
};

/**
 * 获取当前用户能操作的店铺
 * @param shopId 店铺ID
 * @param session
 * @param cb
 */
ShopSchema.statics.getShopInfoByUser = function (shopId, session, cb) {
    let where = {
        shopId: Utils.getIgnoreCase(shopId),
        supplierCode: {$in: session.supplierCode.split(',')}
    };
    if (CGlobal.isSupervisor(session)) {
        delete where.supplierCode;
    }
    this.findOne(where, cb);
};

/**
 * 这个是个很重要的方法
 * 查出当前用户能操作的店铺列表
 * @deprecated
 * @param field 返回shop的字段
 * @return 返回null,就是全部,返回[]就是有值的
 */
ShopSchema.statics.findShopListByUser = function (session, field, cb) {
    if (CGlobal.isSupervisor(session)) {
        return cb();
    }
    this.find({supplierCode: {$in: session.supplierCode.split(',')}}, field || {}, cb);
};

/**
 * @deprecated
 * @param session
 * @param cb
 */
ShopSchema.statics.findShopIdListByUser = function (session, cb) {
    this.findShopListByUser(session, {shopId: 1}, function (err, result) {
        if (err || !result) return cb(err);
        cb(null, Utils.getShopIds(result));
    });
};

// ShopSchema.statics.findShopList = function (session, cb) {
//     let field = {_id: 0, shopId: 1, shopName: 1, supplierCode: 1};
//     let where = {};
//     if (session.selfShop === 'SYSTEM') {
//         if (!CGlobal.isSupervisor(session)) {
//             where.supplierCode = {$in: session.supplierCode.split(',')};
//         }
//     } else {
//         where.shopId = Utils.getIgnoreCase(session.shopId);
//     }
//     this.find(where, field, function (err, result) {
//         if (err) return cb(err, []);
//         cb(null, result);
//     });
// };

ShopSchema.statics.queryShop = function (searchWhere, session, cb) {
    if (!CGlobal.isPermission(session.rights, CGlobal.Rights.ShopSetup.code)) {
        return cb({message: CGlobal.serverLang('抱歉,你没有 {0} 权限!', CGlobal.Rights.ShopSetup.code)});
    }
    let input = searchWhere['input'] || '';
    let where = {
        $or: [], $and: []
    };//查询条件
    CGlobal.forEach(input.split(' '), function (i, v) {
        if (!v) {
            return true;
        }
        where.$or.push({
            shopId: Utils.getIgnoreCase(v, true)
        });
        where.$or.push({
            shopName: Utils.getIgnoreCase(v, true)
        });
        where.$or.push({
            supplierCode: Utils.getIgnoreCase(v, true)
        });
    });
    if (session.shopId !== 'SYSTEM'){
        where.$and.push({shopId: Utils.getIgnoreCase(session.shopId)});
    }
    if (session.selfShop === 'SYSTEM') {
        if (!CGlobal.isSupervisor(session)) {
            where.$and.push({supplierCode: {$in: session.supplierCode.split(',')}});
        }
    }
    let offset = searchWhere['offset'];
    let pageSize = searchWhere['pageSize'];
    let sortOrder = searchWhere['sortOrder'];
    if (where.$or.length === 0) delete where.$or;
    if (where.$and.length === 0) delete where.$and;
    dao.getPageQuery('Shop', where, {}, sortOrder, offset, pageSize, cb);
};

conn.model('Shop', ShopSchema);
module.exports = conn.model('Shop');
