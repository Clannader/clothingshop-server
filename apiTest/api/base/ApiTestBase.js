/**
 * Create by CC on 2020/2/6
 */
'use strict'
const Api = require('../http/ApiHttpClient')

class ApiTestBase {

    constructor() {
        this.api = new Api()
        this.success = 0 //成功数
        this.fail = 0 // 失败数
    }

    assertEqual(isSuccess = false) {
        if (isSuccess) {
            this.success++
        }else {
            this.fail++
        }
    }
}

module.exports = ApiTestBase
