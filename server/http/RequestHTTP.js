/**
 * Created by CC on 2017/10/21.
 */
'use strict';
console.log('require RequestHTTP');

let _url = require('url');
let http = require('http');
let https = require('https');
let queryString = require('querystring');

function RequestHTTP() {
}

RequestHTTP.prototype._accessHttp = function (url, header, method, body, cb) {
    cb = cb || function () {};
    if (arguments.length === 0 || typeof url === 'function') {
        throw new TypeError('Missing (url and callback) params');
    }
    if (typeof header === 'function') {
        cb = header;
        header = {};
        method = 'get';
    } else if (typeof method === 'function') {
        cb = method;
        method = 'get';
    } else if (typeof body === 'function') {
        if (typeof method === 'string') {
            if('get' === method.toLowerCase() || 'post' === method.toLowerCase()){
                method = method.toLowerCase();
            }else {
                method = 'get';
            }
        } else {
            method = 'get';
        }
        cb = body;
        body = '';
    }
    if(!CGlobal.isPlainObject(header)){
        header = {};
    }
    if (method === 'post') {
        if (!body) {
            // return cb({message:'Post request,missing (body) in params'});
            body = '';
        } else if (CGlobal.isPlainObject(body)) {
            header['content-type'] = 'application/json';
            body = JSON.stringify(body);
        }
    }else if(method === 'get'){
        let index = url.indexOf('?');
        let params = '';
        let bodyParams = body;
        let currentParams = '';
        if(index > 0){
            //说明含有?
            let currentUrl = url.substring(0, index);
            currentParams = url.substring(index+1);//截取?后面的参数
            url = currentUrl;//改变url,变成不带?号的url
        }
        if(!CGlobal.isPlainObject(body)){
            //如果body不是对象,把body转对象
            bodyParams = queryString.parse(body);
        }
        if(currentParams){
            //如果url带了参数
            if(bodyParams){
                //body也有参数,那么合并参数
                currentParams = queryString.parse(currentParams);//把参数转json
                params = queryString.stringify(CGlobal.extend(currentParams, bodyParams));
            }else {
                //body没有参数
                params = currentParams;
            }
        }else if(bodyParams){
            //url没有带参数
            params = queryString.stringify(bodyParams);
        }
        if(params) url = url + '?' + params;
    }
    //TODO 添加了打印url
    console.log(url);
    url = _url.parse(url);
    url.method = method;
    url.headers = header;
    if (url.protocol === 'https:') {
        return this._httpsData(body, url, cb);
    } else if (url.protocol === 'http:') {
        return this._httpData(body, url, cb);
    } else {
        return cb({message:'The protocol does not support'});
    }
};

RequestHTTP.prototype._httpData = function (args, options, cb) {
    let _data = '';
    let req = http.request(options, function (res) {
        res.on('data', function (data) {
            _data += data;
        });
        res.on('end', function () {
            cb(null, {
                headers: res.headers,
                data: _data
            });
        });
    }).on('error', function (e) {
        return cb(e);
    });
    if (options.method === 'post') {
        req.write(args);
    }
    req.end();
};

RequestHTTP.prototype._httpsData = function (args, options, cb) {
    let _data = '';
    options.rejectUnauthorized = false;
    let req = https.request(options, function (res) {
        res.on('data', function (data) {
            _data += data;
        });
        res.on('end', function () {
            cb(null, _data, {
                headers: res.headers,
                data: _data
            });
        });
    }).on('error', function (e) {
        return cb(e);
    });
    if (options.method === 'post') {
        req.write(args);
    }
    req.end();
};

RequestHTTP.prototype.get = function (url, header, params, cb) {
    return this._accessHttp(url, header, 'get', params, cb);
};

RequestHTTP.prototype.post = function (url, header, body, cb) {
    return this._accessHttp(url, header, 'post', body, cb);
};

module.exports = new RequestHTTP();
module.exports.Constructor = RequestHTTP;

//测试
// require('../public/globalServer');
// let req = new RequestHTTP();
// let url = 'https://cc:3001/cms/ifc/api/sequence/getid?type=MESSAGE';
// let header = {
//     Id:'IFC1',
//     Key:'6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
//     shopid:'1',
//     'CMS-Interface':'CMS-Interface'
// };
// let body = {
//     type:'MESSAGE'
//     groupName:'mailConfig'
// };
// let body = 'type=MESSAGE'
// let body = null;
// req.get(url,header,body,function (err,result) {
//     if(err)console.log(err);
//     if(result)console.log(result.data);
// });

// req.get('http://cc:8000/swagger-ui.html', function (err, result) {
//    if(err)console.log(err);
//    if(result){
//        console.log(result);
//    }else {
//        console.log('result: '+result);
//    }
// });