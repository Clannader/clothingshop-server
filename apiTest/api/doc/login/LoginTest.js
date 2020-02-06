/**
 * Create by CC on 2020/2/6
 */
'use strict'

const ApiTestBase = require('../../base/ApiTestBase')

class LoginTest extends ApiTestBase{

    async start() {
        const [err, result] = await this.api.service.get('/api/test/version', {})
            .then(result => [null, result]).catch(err => [err])
        if(err){
            console.error(err)
            return
        }
        console.log(result)
        return Promise.resolve({success: 1, fail: 0})
    }
}

module.exports = function () {
    return new LoginTest()
}
