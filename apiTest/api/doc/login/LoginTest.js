/**
 * Create by CC on 2020/2/6
 */
'use strict'

const ApiTestBase = require('../../base/ApiTestBase')

class LoginTest extends ApiTestBase{

    /**
     * 测试获取API版本
     * @return {Promise<any>}
     */
    async testVersion() {
        const versionResult = await this.http.get('/api/test/version', {})
            .then(result => result)
        this.assertEqual(versionResult.code === this.apiCode.Success)
        return versionResult
    }

    /**
     * 测试登录成功
     * @return {Promise<void>}
     */
    async testLogin() {
        const result = await this.login('supervisor', 'a')
            .then(result => result)
        console.log(result['credential'])
        this.assertEqual(result.code === this.apiCode.Success)
        if (result.code === this.apiCode.Success) {
            await this.logout(result['credential'])
        }
        return result
    }

    beforeStart() {
        this.pushTest(this.testVersion())
        this.pushTest(this.testLogin())
    }
}

module.exports = function () {
    return new LoginTest()
}
