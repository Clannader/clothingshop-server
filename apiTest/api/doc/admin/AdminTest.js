/**
 * Create by CC on 2020/2/6
 */
'use strict'

const ApiTestBase = require('../../base/ApiTestBase')

class AdminTest extends ApiTestBase {

    start() {
        return Promise.resolve({success: 0, fail: 0})
    }
}

module.exports = function () {
    return new AdminTest()
}
