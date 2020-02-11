/**
 * Create by CC on 2020/2/6
 */
'use strict'
const Api = require('../http/ApiHttpClient')
const execArr = Symbol('execArr')
const success = Symbol('success')
const fail = Symbol('fail')

class ApiTestBase {

    constructor() {
        this.api = new Api()
        this.http = this.api.getHttp()
        this[execArr] = []
        this[success] = 0 //成功数
        this[fail] = 0 // 失败数
        this.apiCode = CGlobal.GlobalStatic.ApiCode
    }

    assertEqual(isSuccess = false) {
        if (isSuccess) {
            this[success]++
        } else {
            this[fail]++
        }
    }

    async start() {
        const className = this.constructor.name
        this.api.apiLogs.info(`执行测试类:[${className}]`)
        await this.beforeStart()
        await Promise.all(this[execArr]).then(() => {
            this.api.apiLogs.info(`-------------------------[${className}]测试结果-------------------------`)
            this.api.apiLogs.info(`[${className}]测试总数:%s`, this[success] + this[fail])
            this.api.apiLogs.info(`[${className}]成功总数:%s`, this[success])
            this.api.apiLogs.info(`[${className}]失败总数:%s`, this[fail])
        })
        // this.api.apiLogs.info('[' + this.constructor.name + ']测试结束')
        // this.api.apiLogs.info('-------------------------------------')
        return Promise.resolve({success: this[success], fail: this[fail]})
    }

    beforeStart() {

    }

    pushTest(fun) {
        this[execArr].push(fun || CGlobal.noop())
    }
}

module.exports = ApiTestBase
