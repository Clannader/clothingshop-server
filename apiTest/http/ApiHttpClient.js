/**
 * Create by CC on 2019/9/13
 */
'use strict';
require('../../server/public/globalServer');
const Config = require('../../server/util/Config');
const apiConfig = new Config(__dirname + '/config.ini');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const service = axios.create({
    baseURL: apiConfig.read('baseUrl'),
    timeout: 30000, // 请求超时设置
    headers: { // 自定义请求头
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

service.interceptors.request.use(
    req => {
        req.headers['credential'] = apiConfig.read('session') || '';
        req.headers['language'] = 'EN';
        console.log(req.baseURL + req.url);
        return req
    },
    error => {
        return Promise.reject(error)
    }
);

service.interceptors.response.use(
    resp => {
        const data = resp.data;//获取返回数据
        const code = data.code;//获取返回状态码
        if (code === 1 || code === 901 || code === 902) {
            return resp.data
        } else {
            //其他code说明是失败的
            return Promise.reject(data)
        }
    },
    error => {
        return Promise.reject(error)
    }
);

const ApiHttpClient = function () {
    // this.autoLogin = true;
    this.retryCount = 0;
};

ApiHttpClient.prototype.request = async function (url, method = 'post', params = {}, config = {}) {
    config['method'] = method;
    if (['post', 'put', 'patch'].indexOf(method) !== -1) {
        config['data'] = params;
    } else {
        config['params'] = params;
    }
    let autoLogin = true;
    if (typeof config['autoLogin'] === 'boolean' && !config['autoLogin']) {
        autoLogin = config['autoLogin']
    }
    const [err, result] = await this.fn(service.request(url, config), false);
    if (err) {
        return Promise.reject(err)
    }
    if ((result.code === 901 || result.code === 902) && autoLogin/* && this.retryCount < 5*/) {
        this.retryCount++;
        const [loginErr] = await this.fn(this.login(), false);
        if (loginErr) {
            return Promise.reject(loginErr)
        }
        return this.request.apply(this, arguments)
    } else {
        return Promise.resolve(result);
    }
};

ApiHttpClient.prototype.login = async function () {
    const params = {
        adminId: apiConfig.read('username'),
        adminPws: CryptoJS.SHA256(apiConfig.read('password')).toString()
    };
    const [err, result] = await this.fn(service.post('/api/user/login', params), false);
    if (err) {
        return Promise.reject(err);
    }
    apiConfig.write('session', result['credential']);
    return Promise.resolve(result);
};

['delete', 'get', 'head', 'options', 'post', 'put', 'patch'].forEach(method => {
    ApiHttpClient.prototype[method] = function (url, params, config) {
        return this.request(url, method, params, config);
    };
});

ApiHttpClient.prototype.fn = function (pro, print = true) {
    return pro.then(res => {
        if(print){
            console.log(res);
        }
        return [null, res];
    }).catch(error => {
        if(print){
            console.error(error);
        }
        return [error, {}];
    });
};

module.exports = ApiHttpClient;
module.exports.http = service;
module.exports.config = apiConfig;