'use strict';
console.log('require HttpClient');
let http = require('./RequestHTTP');

function HttpClient(url, header) {
    this.url = url;
    if (this.url.endsWith('/')) {
        this.url = this.url.substring(0, this.url.length - 1);
    }
    this.oldUrl = this.url;
    this.header = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    };
    if (CGlobal.isPlainObject(header)) {
        CGlobal.extend(this.header, header);
    }
    this.params = {};
}

/**
 * 重设url地址
 * @param url
 * @returns {HttpClient}
 */
HttpClient.prototype.setUrl = function (url) {
    if (typeof url !== 'string') return this;
    if (url.endsWith('/')) {
        url = url.substring(0, url.length - 1);
    }
    this.url = url;
    return this;
};

HttpClient.prototype.getUrl = function () {
    return this.url;
};

HttpClient.prototype.setPath = function (path) {
    if (typeof path !== 'string') return this;
    if (!path.startsWith('/')) {
        path = '/' + path;
    }
    this.url = this.oldUrl + path;
    return this;
};

/**
 * 设置头部信息
 * @param key
 * @param value
 * @returns {HttpClient}
 */
HttpClient.prototype.setHeader = function (key, value) {
    let header = {};
    header[key] = value;
    CGlobal.extend(this.header, header);
    return this;
};

/**
 * 设置多个头部信息
 * @param headers
 * @returns {HttpClient}
 */
HttpClient.prototype.setHeaders = function (headers) {
    if (!CGlobal.isPlainObject(headers)) {
        return this;
    }
    CGlobal.extend(this.header, headers);
    return this;
};

/**
 * 根据key获取完整的头部信息json
 * @param key
 * @returns {*}
 */
HttpClient.prototype.getHeaderJson = function (key) {
    let header = {};
    if (this.header[key]) {
        header[key] = this.header[key];
    }
    return header;
};

HttpClient.prototype.getHeaderValue = function (key) {
    return this.header[key];
};

HttpClient.prototype.addParams = function (params) {
    if (!CGlobal.isPlainObject(params)) {
        return this;
    }
    CGlobal.extend(this.params, params);
    return this;
};

HttpClient.prototype.addParam = function (key, value) {
    let param = {};
    param[key] = value;
    CGlobal.extend(this.params, param);
    return this;
};

HttpClient.prototype.clearParams = function () {
    this.params = {};
    return this;
};

HttpClient.prototype.get = function (params, cb) {
    this.method = 'get';
    http.get(this.url, this.header, CGlobal.extend(params, this.params), cb);
};

HttpClient.prototype.post = function (body, cb) {
    this.method = 'post';
    http.post(this.url, this.header, CGlobal.extend(body, this.params), cb);
};

module.exports = HttpClient;