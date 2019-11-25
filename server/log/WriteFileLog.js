/**
 * Created by CC on 2017/11/20.
 * 把log写入文件 工具类
 */

'use strict';
console.log('require WriteFileLog')
let log4js = require('log4js');
let Utils = require('../util/Utils');

function WriteFileLog(format, type) {
    this._log_format = format || '[{userName}]-[{date}]-[{content}]-[{shopId}]-[{type}]';
    this._type = type || 'CMS';
}

WriteFileLog.prototype.getLogger = function (type) {
    return log4js.getLogger(type);
};

WriteFileLog.prototype.info = function (msgObj, regExp) {
    this.formatMsgObj(msgObj);
    this.getLogger(this._type).info(Utils.replaceArgsFromTemplate(this._log_format, msgObj, regExp));
};

WriteFileLog.prototype.debug = function (msgObj, regExp) {
    this.formatMsgObj(msgObj);
    this.getLogger(this._type).debug(Utils.replaceArgsFromTemplate(this._log_format, msgObj, regExp));
};

WriteFileLog.prototype.error = function (msgObj, regExp) {
    this.formatMsgObj(msgObj);
    this.getLogger(this._type).error(Utils.replaceArgsFromTemplate(this._log_format, msgObj, regExp));
};

// WriteFileLog.prototype.setType = function (type) {
//     if (typeof type !== 'string')return;
//     this._type = type;
// };

WriteFileLog.prototype.setFormat = function (fmt) {
    if (typeof fmt !== 'string')return;
    this._log_format = fmt;
};

WriteFileLog.prototype.formatMsgObj = function (msgObj) {
    if(!CGlobal.isPlainObject(msgObj))return {};
    if(!msgObj.date){
        msgObj.date = new Date().format('yyyy-MM-dd hh:mm:ss,SSS');
    }
    return msgObj;
};

module.exports = new WriteFileLog();
module.exports.Constructor = WriteFileLog;