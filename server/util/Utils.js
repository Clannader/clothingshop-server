/**
 * Created by CC on 2016/10/12.
 * 公共的工具类
 */
'use strict';
//加打印log,看加载时的顺序
console.log('require Utils');

let Config = require('./Config');
let CryptoJS = require('crypto-js');//引这个是总类库,只引crypto-js会是引到index,然后导入其他加密算法而已
let util = require('util');
let validator = require('validator');
let uuid = require('node-uuid');
let userCache = require('../util/cache/UserCache');
let os = require('os');

// let config = new Config(__dirname + "/../../config/config.ini", true);//Config对象
let config = new Config(process.env.CONFIG_PATH, true);

function Utils() {

}

//MD5加密方法
Utils.md5 = function (string) {
    //方式1:
    // let md5sum = crypto.createHash('md5');
    // md5sum.update(string);
    // string = md5sum.digest('hex');
    //方式2:
    return CryptoJS.MD5(string).toString();
};

Utils.sha256 = function (str, key) {
    if (key) {
        return CryptoJS.HmacSHA256(str, key).toString();
    }
    return CryptoJS.SHA256(str).toString();
};

Utils.sha1 = function (str, key) {
    if (key) {
        return CryptoJS.HmacSHA1(str, key).toString();
    }
    return CryptoJS.SHA1(str).toString();
};

//复杂加密密码
Utils.complexEncryption = function (userid, userPws) {
    //128位太多了,使用64位的
    if (!validator.isMD5(userPws)) {
        userPws = this.md5(userPws);
    }
    return this.sha256(userPws, this.sha256(userid));
};

Utils.isSha256 = function (pws){
    return validator.isHash(pws, 'sha256');
};

//创建SUPERVISOR用户,SUPERVISOR的json结构
Utils.getSuper = function () {
    return {
        adminId: 'SUPERVISOR',
        adminName: '系统超级用户',
        password: this.sha256('s'),
        shopId: 'SYSTEM',
        rights: CGlobal.GlobalStatic.Supervisor_Rights,
        adminType: 'SYSTEM',
        adminStatus: true,
        email:'oliver.wu@shijigroup.com'
    }
};

//读取config.ini配置文件
Utils.readConfig = function (key) {
    return config.read(key);
};

Utils.writeConfig = function (key, value) {
    config.write(key, value);
};

//转义函数
Utils.escapeString = function (str) {
    if (!util.isString(str))return '';
    return str.replace(/([.*+?^=!${}()|\[\]\/\\])/g, '\\$1');
};

/**
 * 获取req中的adminSession
 * @param req 必须是request,因为不做什么校验
 * @returns {*}
 */
Utils.getAdminSession = function (req) {
    let interfaceHeader = req.headers['api-cms-interface'];
    if (req && req.session && req.session.adminSession) {
        // req.session.adminSession.requestIP = this.getRequestIP(req);
        return req.session.adminSession;
    } else if (this.isPressureTest()) {
        return this.getSuper();
    } else if(interfaceHeader && interfaceHeader === CGlobal.GlobalStatic.interfaceHeader){
        let adminId = req.headers['api-id'];
        let shopId = req.headers['api-shopid'] || 'SYSTEM';
        let cacheKey = adminId.toUpperCase() + '@' + shopId.toUpperCase();
        return userCache.getUserCache(cacheKey);
    } else {
        return null;
    }
};

/**
 * 测试用户Schema
 * @returns {{}}
 */
Utils.getTestUser = function () {
    return {};
};

Utils.isPressureTest = function () {
    return this.readConfig('pressureTest') === 'true';
};

Utils.isMongoId = function (id) {
    return validator.isMongoId(id);
};

Utils.getUUID = function () {
    return uuid.v4().replace(/\-/g, '');
};

Utils.getIgnoreCase = function (name, mode) {
    if (typeof mode === 'boolean' && mode) {
        return {$regex: name, $options: 'i'};
    }
    return {$regex: '^' + name + '$', $options: 'i'};
};

Utils.getRightsArray = function (session) {
    let rightsData = [];
    CGlobal.forEach(CGlobal.Rights, function (i, v) {
        if((session.rights === CGlobal.GlobalStatic.Supervisor_Rights
            || session.rights.indexOf(v.code) !== -1)&& v.scope === 'ALL'){
            rightsData.push({
                code: v.code + '',
                desc: CGlobal.serverLang(v.desc)
            });
        }
    });
    return rightsData;
};

Utils.getShopIds = function (shopList) {
    if (!Array.isArray(shopList))return [];
    let arr = [];
    shopList.forEach(function (value) {
        arr.push(value.shopId);
    });
    return arr;
};

Utils.replaceArgsFromTemplate = function (str, obj, exp, isReturnNull) {
    let message = '';
    if (typeof str !== 'string')return message;
    if (!CGlobal.isPlainObject(obj))return str;
    exp = exp || /\{[\w]+\}/g;
    isReturnNull = isReturnNull || true;
    message += str.replace(exp, function (match) {
        let index = match.slice(1, -1);

        if (!obj[index]) {
            return isReturnNull ? match : '';
        }
        return obj[index];
    });

    return message;
};

Utils.escapePath = function (path) {
    if (process.platform === 'win32')
        return path.replace(/\/+/g, '\\');
    else
        return path.replace(/\\+/g, '//');
};

Utils.getSessionID = function (req) {
    // let cookieSession = req.cookies[CGlobal.GlobalStatic.sessionName];
    // if(!cookieSession)return null;
    // if(cookieSession.substr(0, 2) !== 's:') return null;
    // let value = cookieSession.slice(2);
    // if(value.lastIndexOf('.') !== -1){
    //     return value.substr(0,value.lastIndexOf('.'));
    // }else {
    //     return value;
    // }
    return req.sessionID;
};

Utils.getRequestIP = function (req) {
    let ip = req.connection.remoteAddress;
    if(ip && typeof ip === 'string'){
        ip = ip.substr(ip.lastIndexOf(':') + 1);
    }
    if(!CGlobal.GlobalStatic.ipExp.test(ip)){
        let interfaces = os.networkInterfaces();
        ip = null;//置null
        CGlobal.forEach(interfaces, function (key, value) {
            if(ip)return false;//ip有值就跳出循环
            CGlobal.forEach(value, function (k, v) {
                if(v.family === 'IPv4'){
                    ip = v.address;
                    return false;
                }
            });
        });
    }
    return ip || '127.0.0.1';
};

Utils.getSortOrder = function (sort) {
    let st = {};
    if(CGlobal.isPlainObject(sort)){
        if (sort.order === 'desc') {
            st[sort.sort] = -1;//降序
        } else {
            if (sort.sort) {
                st[sort.sort] = 1;//升序
            } else {
                st['_id'] = -1;
            }
        }
    }
    return st;
};

//版本改变,返回下一个版本号
Utils.changeVersion = function (version) {
    let initVersion = '1.0.0.0';
    if(typeof version !== 'string')return initVersion;
    let exp = /^(\d+\.){3}\d+$/;
    if(!version.match(exp))return initVersion;
    let vArr = version.split('\.');
    let vNode1 = vArr[0],
        vNode2 = vArr[1],
        vNode3 = vArr[2],
        vNode4 = vArr[3];
    vNode4++;
    if(vNode4 >= 10){
        vNode4 = 0;
        vNode3++;
    }
    if(vNode3 >= 20){
        vNode3 = 0;
        vNode2++;
    }
    if(vNode2 >= 50){
        vNode2 = 0;
        vNode1++
    }
    return CGlobal.replaceArgs('{0}.{1}.{2}.{3}', vNode1, vNode2, vNode3, vNode4);
};

Utils.isHasXMLHeader = function (req) {
    return req.headers && req.headers['x-requested-with']
        && req.headers['x-requested-with'] === 'XMLHttpRequest';
};

Utils.isHasSwaggerHeader = function (req) {
    //以后这个判断可以换成判断credential即可
    return req.headers && req.headers['swagger-ui']
        && req.headers['swagger-ui'] === 'SwaggerUI';
};

Utils.isHasJsonHeader = function (req) {
    return req.headers && req.headers['content-type']
        && req.headers['content-type'] === 'application/json';
};

Utils.isHasSoapHeader = function (req) {
    const xmlHeader = req.headers['content-type'];
    return xmlHeader && xmlHeader.indexOf('xml') !== -1;
};

//Utils读关于CMS的配置,因为无法在全局函数初始化,只能在这里初始化了
//给全局对象新增字段值
//因为这些值是读配置的,配置类又得先加载全局类,所以只能这里加了- -

let cms = {
    author: Utils.readConfig('author'),
    version: Utils.readConfig('version'),
    copyright: Utils.readConfig('copyright')
};
CGlobal.extend(CGlobal.aboutCMS, cms);


//给打印log类型赋值
CGlobal.logLangType = Utils.readConfig('defaultLogLang');
CGlobal.isClusterServer = Utils.readConfig('clusterServer') === 'true';

module.exports = Utils;
