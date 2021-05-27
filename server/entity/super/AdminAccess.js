/**
 * Created by CC on 2017/12/16.
 */
'use strict';
console.log('require AdminAccess');
let Schema = require('mongoose').Schema;
let conn = require('../../dao/daoConnection').getConnection();

let Utils = require('../../util/Utils');
let Admin = require('./Admin');

let AdminAccess = {
    adminId: {
        type: String
        , required: true
    },//登录时的管理员ID,唯一
    adminType: {
        type: String
        , required: true
        , enum: [CGlobal.GlobalStatic.User_Type.NORMAL, CGlobal.GlobalStatic.User_Type.SYSTEM
            , CGlobal.GlobalStatic.User_Type.THIRD, 'NULL']
    },//用户类型:SYSTEM,NORMAL,3RD
    shopId: {
        type: String
        , required: true
    },//所属的商店名
    date: {
        type: Date
        , required: true
    },//访问时间
    ip: {
        type: String
        , required: true
        , match: CGlobal.GlobalStatic.ipExp
    },//远程IP
    url: {
        type: String
        , required: true
    },//请求地址
    params: {
        type: Object,
        default: {}
    },//请求内容参数
    type: {
        type: String
        , required: true
        , enum: [CGlobal.GlobalStatic.Log_Type.BROWSER, CGlobal.GlobalStatic.Log_Type.INTERFACE
            , CGlobal.GlobalStatic.Log_Type.WSDL]
    },//请求类型browser,interface,wsdl
    method: {
        type: String
        , required: true
        , enum: ['get', 'post', 'options']
    },//请求方式
    timestamp: {
        type: Number
    },//请求时间
    send: {
        type: Object
    },//请求返回内容
    headers: {
        type: Object
    }//请求头内容
};
let AdminAccessSchema = new Schema(AdminAccess);

AdminAccessSchema.statics.queryAdmin = function (aid, shopId, cb){
    return new Promise(((resolve, reject) => {
        const where = {
            shopId: Utils.getIgnoreCase(shopId),
            adminId: Utils.getIgnoreCase(aid)
        };
        Admin.findOne(where, {adminType:1, _id:0}, function (err, doc) {
            if(err){
                cb && cb(err);
                return reject(err);
            }
            cb && cb(null, doc);
            resolve(doc);
        });
    }));
};

// AdminAccessSchema.statics.createLog = async function (req, type, timestamp, send) {
//     let date = new Date();
//     // let timestamp = date.getTime() - req.aop.startTime;
//     let adminSession = Utils.getAdminSession(req);
//     if (!adminSession) {
//         adminSession = {
//             adminId: req.headers['adminId'],
//             shopId: req.headers['shopId'],
//             selfShop: req.headers['shopId']
//         };
//     }
//     let ip = Utils.getRequestIP(req);
//     let method = req.method;
//     let url = req.url;
//     let body = {};
//     let query = {};
//
//     if('GET' === method){
//         query = req.query;
//     }else if('POST' === method){
//         body = req.body;
//     }
//
//     let params = {...query, ...body};
//
//     //版本1
//     // let aid = adminSession.adminId;
//     // let shopId = adminSession.shopId;
//     // let that = this;
//     // Admin.searchAdmin(aid, shopId, function (err, result) {
//     //     if (err) return;
//     //     let admin = result.admin;
//     //     let createParams = {
//     //         adminId: admin.adminId,
//     //         adminType: admin.adminType,
//     //         shopId: adminSession.shopId,//用登录时的shopId
//     //         date: date,
//     //         iP: ip,
//     //         url: url,
//     //         params: JSON.stringify(params),
//     //         type: type || CGlobal.GlobalStatic.Log_Type.BROWSER,
//     //         method: method.toLowerCase(),
//     //         timestamp: timestamp
//     //     };
//     //     //1.过滤url:super/index/*和super/web/*
//     //     //2.wsdl调用没有adminSession
//     //     if (!CGlobal.containsString(url, '/super/index', '/super/abort', '/super/web/navbar/navlink')) {
//     //         that.create(createParams, function (err) {
//     //             if (err) console.error(err);
//     //         });
//     //     }
//     // });
//
//     //版本2
//     try{
//         let aid = adminSession.adminId;
//         let shopId = adminSession.shopId;
//         const adminType = await this.queryAdmin(aid, adminSession.selfShop);
//         let createParams = {
//             adminId: aid,
//             adminType: adminType.adminType || CGlobal.GlobalStatic.User_Type.NORMAL,
//             shopId: shopId,//用登录时的shopId
//             date: date,
//             iP: ip,
//             url: url,
//             params: JSON.stringify(params),
//             type: type || CGlobal.GlobalStatic.Log_Type.BROWSER,
//             method: method.toLowerCase(),
//             headers: JSON.stringify(req.headers)
//         };
//         if(timestamp){
//             createParams.timestamp = timestamp;
//         }
//         if(send){
//             createParams.send = send;
//         }
//         this.create(createParams, function (err) {
//             if (err) console.error(err);
//         });
//     }catch (e) {
//         console.error(e);
//     }
// };

conn.model('AdminAccess', AdminAccessSchema);
module.exports = AdminAccessSchema;
