'use strict';
console.log('require Test');
let Schema = require('mongoose').Schema;
let dao = require('../dao/daoConnection');
let conn = dao.getConnection();
let Sequence = require('./system/Sequence');
let Test = {
    floorNo: {type: Number},//层号
    rooms: [{
        number: {type: Number},//房间号
        type: {type: String},//房间类型
        desc: {type: String}//描述
    }]//每层楼的房间信息
};

/**
 * 操作符笔记
 * 等于 $eq
 * 大于 $gt
 * 小于 $lt
 * 大于等于 $gte
 * 小于等于 $lte
 * 不等于 $ne
 * 匹配多个 $in
 * 匹配不多个 $nin
 * 或者 $or
 * 并且 $and
 * 不匹配条件 $not $not:{field:value}
 * 任意表达式不匹配 $nor $nor:[{},{}]
 */

let TestSchema = new Schema(Test);

TestSchema.statics.addFloor = function (cb) {
    let that = this;
    Sequence.getSequenceIdFromFirst({
        shopId: '1',
        type: 'ROOMNO'
    }, function (err, no) {
        if (err) return cb(err);
        let floor = {
            floorNo: no
        };
        that.create(floor, cb);
    });
};

TestSchema.statics.addRoom = function (params, cb) {
    let where = {
        floorNo: params.floor,//父文档唯一标识
        'rooms.number': params.number//子文档唯一标识
    };
    let that = this;
    this.count(where, function (err, count) {
        if (err) return cb(err);
        if (count > 0) {
            return cb({message: '重复的子文档'});
        }
        let subData = {
            number: params.number,//房间号
            type: params.type,//房间类型
            desc: params.desc//描述
        };//子文档结构
        let subElem = {
            rooms: subData
        };//嵌入子文档节点中
        that.findOneAndUpdate({floorNo: params.floor}, {$addToSet: subElem}, cb);
    });
};

TestSchema.statics.deleteRoom = function (params, cb) {
    let subId = {
        rooms: {number: params.number}
    };//子文档唯一标识
    //删除多个使用{multi: true}
    this.findOneAndUpdate({floorNo: params.floor}, {$pull: subId}, cb);
};

TestSchema.statics.modifyRoom = function (params, cb) {
    //这里不做任何判断,只要能修改成功就算完成了
    let where = {
        floorNo: params.floor,
        'rooms.number': params.number
    };
    let update = {
        $set: {
            'rooms.$.desc': params.desc,
            'rooms.$.type': params.type
        }
    };
    this.findOneAndUpdate(where, update, cb);
};

TestSchema.statics.findRoom = function (params, cb) {
    //查询所有子文档,返回所有子文档
    //如果返回是的'',说明父文档已经不存在了
    // this.findOne({floorNo: 1}, {'rooms': 1, _id: 0}, cb);

    //查询单个子文档
    //如果返回是的'',说明子文档已经不存在了
    // this.findOne({floorNo: 1, 'rooms.number': 1}, {'rooms.$': 1, _id: 0}, cb);

    let field = {};
    let where = {
        floorNo: params.floor
    };
    if (params.number) {
        field = {'rooms.$': 1, _id: 0};
        where['rooms.number'] = params.number;
    } else {
        field = {'rooms': 1, _id: 0};
    }
    this.findOne(where, field, cb);
};

TestSchema.statics.findRoomByCond = function (params, cb) {
    let match = {
        floorNo: parseInt(params.floor)
    };
    if (params.type) {
        match['rooms.type'] = params.type;
    }
    this.aggregate([
        {
            $unwind: '$rooms'
        },
        {
            $match: match
        }, {
            $project: {'rooms': 1}
        }
        //子文档分页写法
        // ,  {
        //     $skip:0
        // }
        // ,  {
        //     $limit:2
        // }
    ], cb);

    //查询Test表下所有子文档不为空的集合
    // this.aggregate([
    //     {
    //         $unwind: '$rooms'
    //     },
    // ],cb);

    //根据条件查询
    // this.aggregate([
    //     {
    //         $unwind: '$rooms'
    //     },
    //     {
    //         $match: {floorNo: parseInt(params.floor)}//聚合查询强制字段类型
    //     }
    // ],cb);
};

conn.model('Test', TestSchema);
module.exports = conn.model('Test');