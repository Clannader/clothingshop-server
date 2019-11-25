/**
 * Created by CC on 2017/6/25.
 * 取序列号表
 */
'use strict';
console.log('require Sequence');
let Schema = require('mongoose').Schema;
let conn = require('../../dao/daoConnection').getConnection();
let Shop = require('../Shop');
// let Utils = require('../../util/Utils');
let async = require('async');
let Sequence = {
    sequenceId: {
        type: Number
        , default: 0
    },//序列号
    shopId: {
        type: String
        , required: true
    },
    type: {
        type: String
        , required: true
        , enum: CGlobal.GlobalStatic.sequenceType//判断值是否包含于enmu对应的数组中
    }//类型
};
let SequenceSchema = new Schema(Sequence);

SequenceSchema.statics.getSequenceId = function (params, cb) {
    let shopId = params.shopId;
    let type = params.type;
    if (!shopId) return cb({message: '店铺ID不能为空'});
    if (!type) return cb({message: '类型不能为空'});
    if (CGlobal.inArray(type, CGlobal.GlobalStatic.sequenceType) < 0) return cb({message: '无效的类型值'});
    let that = this;
    async.auto({
        isExistShop: function (callback) {
            Shop.isExistShop(shopId, callback);
        },
        getSeqId: ['isExistShop', function (resultRes, callback) {
            let where = {
                shopId: shopId,
                type: type
            };
            //这里最好是过了第二天sequence归0,每天重置0
            that.findOneAndUpdate(where, {$inc: {sequenceId: 1}}, {upsert: true}, function (err, result) {
                if (err) return callback(err);
                callback(null, result ? result['sequenceId'] : 0);
            });
        }]
    }, function (err, result) {
        if (err) return cb(err);
        cb(null, result.getSeqId);
    });
};

SequenceSchema.statics.getSequenceIdByDate = function (params, cb){
    this.getSequenceId(params, function (err, seqId) {
        if (err)return cb(err);
        let date = new Date().format('yyyyMMdd');
        cb(null, seqId ? date + seqId : date + 0);
    });
};

/**
 * 取Sequence从1开始
 */
SequenceSchema.statics.getSequenceIdFromFirst = function (params, cb){
    this.getSequenceId(params, function (err, seqId) {
        if (err)return cb(err);
        cb(null, seqId ? seqId + 1 : 1);
    });
};

conn.model('Sequence', SequenceSchema);
module.exports = conn.model('Sequence');