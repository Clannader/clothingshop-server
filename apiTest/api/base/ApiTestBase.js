/**
 * Create by CC on 2020/2/6
 */
'use strict'
const Api = require('../http/ApiHttpClient')

class ApiTestBase {

    constructor() {
        this.api = new Api()
    }
}

module.exports = ApiTestBase
