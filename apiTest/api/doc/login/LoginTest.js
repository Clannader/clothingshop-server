/**
 * Create by CC on 2020/2/6
 */
'use strict'

const ApiTestBase = require('../../base/ApiTestBase')

class LoginTest extends ApiTestBase{

    async testVersion() {
        const versionResult = await this.http.get('/api/test/version', {})
            .then(result => result)
        this.assertEqual(versionResult.code === this.apiCode.Success)
        return versionResult
    }

    beforeStart() {
        this.pushTest(this.testVersion())
    }
}

module.exports = function () {
    return new LoginTest()
}
