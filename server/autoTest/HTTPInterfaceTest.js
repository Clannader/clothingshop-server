/**
 * Create by CC on 2018/11/23
 * 自动化测试cms接口
 */
'use strict';
require('../public/globalServer');
let HttpClient = require('../http/HttpClient');
let schema = require('./schema');
let http = new HttpClient(schema.url, schema.headers);
let async = require('async');

function HTTPInterfaceTest() {

}

HTTPInterfaceTest.prototype.start = function () {
    console.time('总测试时间');
    let total = 0;
    let successT = 0;
    let failT = 0;
    let that = this;
    async.mapValuesSeries(schema.cases, function (caseVaule, caseName, cb) {
        console.time(CGlobal.replaceArgs('[{0}-测试时间]', caseName));
        let tempResult = {};//保存每次请求的结果
        async.eachOfSeries(caseVaule, function (value, key, callback) {
            total++;
            http.setPath(value.path);
            let method = value.method;
            let headers = value.headers;
            let copyHeaders = {};
            if (CGlobal.isPlainObject(headers)) {
                CGlobal.forEach(headers, function (key, value) {
                    if (value.startsWith('$')) {
                        let index = value.indexOf('.');
                        let cKey = value.substring(1, index);
                        let cValue = tempResult[caseName + '.' + cKey];
                        if (cValue) {
                            copyHeaders[key] = eval('cValue.' + value.substring(index + 1));
                        } else {
                            copyHeaders[key] = value;
                        }
                    } else {
                        copyHeaders[key] = value;
                    }
                });
            }
            http.setHeaders(copyHeaders);
            let params = value.params;
            let copyParams = {};
            if (CGlobal.isPlainObject(params)) {
                copyParams = that.getParams(tempResult, caseName, params);
            }
            let caseKey = CGlobal.replaceArgs('{0}.{1}', caseName, value.name);
            console.log('请求参数: %s', JSON.stringify(copyParams));
            http[method].call(http, copyParams, function (err, result) {
                if (err) {
                    tempResult[caseKey] = {};
                    console.error(CGlobal.replaceArgs(
                        '[{0}]-{1}:报错信息:{2}'
                        , caseName, value.name, err.message));
                    failT++;
                }
                if (result) {
                    result = JSON.parse(result);
                    tempResult[caseKey] = result;
                    let isSuccess = result[value.out.key || 'code'] === value.out.value;
                    let text = isSuccess ? '成功' : '失败';
                    console.log(CGlobal.replaceArgs('[{0}]-{1}:测试{2}', caseName
                        , value.name, text));
                    if (!isSuccess) {
                        failT++;
                        console.log('失败结果:' + JSON.stringify(result));
                    } else {
                        successT++;
                    }
                    if (typeof value.out.print === 'boolean' && value.out.print) {
                        console.log('返回结果:' + JSON.stringify(result));
                    }
                }
                console.log();
                callback();
            });
        }, function () {
            console.timeEnd(CGlobal.replaceArgs('[{0}-测试时间]', caseName));
            cb();
        });
    }, function () {
        console.timeEnd('总测试时间');
        console.log(CGlobal.replaceArgs('总共:[{0}],成功:[{1}],失败:[{2}]',
            total, successT, failT));
    });
};

HTTPInterfaceTest.prototype.getParams = function (tempResult, caseName, params) {
    let temp = {};
    let that = this;
    if (CGlobal.isPlainObject(params)) {
        CGlobal.forEach(params, function (key, value) {
            let isObjValue = CGlobal.isPlainObject(value);
            if(isObjValue){
                temp[key] = that.getParams(tempResult, caseName, value);
            }else if(typeof value === 'string'){
                if (value.startsWith('$')) {
                    let index = value.indexOf('.');
                    let cKey = value.substring(1, index);
                    let cValue = tempResult[caseName + '.' + cKey];
                    if (cValue) {
                        temp[key] = eval('cValue.' + value.substring(index + 1));
                    } else {
                        temp[key] = value;
                    }
                } else {
                    temp[key] = value;
                }
            }else {
                temp[key] = value;
            }
        });
    }
    return temp;
};

let httpTest = new HTTPInterfaceTest();
httpTest.start();