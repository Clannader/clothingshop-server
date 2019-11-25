/**
 * Create by CC on 2019/9/21
 */
'use strict';
const Client = require('../http/ApiHttpClient');
const service = new Client();
const CryptoJS = require('crypto-js');

class BaseTest {

    constructor() {
        this.success = 0;
        this.fail = 0;
        this.http = service;
        this.config = Client.config;
    }

    getSHA256(str = '') {
        return CryptoJS.SHA256(str).toString();
    }

    async logOut() {
        const params = {};
        await service.fn(service.post('/api/user/logout', params), false);
    }

    async initCase() {
        throw new TypeError('抽象方法,必须重写');
    }

    async start() {
        await this.initCase();
        console.log('----------- %s 测试结果----------------', this.constructor.name);
        if (this.success > 0) {
            console.log('测试成功 %s个', this.success);
        }
        if (this.fail > 0) {
            console.error('测试失败 %s个', this.fail);
        }
        console.log('测试总计 %s个', this.success + this.fail);
    }

    equalResult(result) {
        if (typeof result !== 'boolean') {
            throw new TypeError('result 类型错误')
        }
        if (result) {
            this.success++;
        } else {
            this.fail++;
        }
    }
}

module.exports = BaseTest;