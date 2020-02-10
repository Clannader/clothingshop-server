/**
 * Create by CC on 2020/2/10
 */
'use strict'

const env = process.env.NODE_ENV || 'dev'
const config = require('../config/' + env + '.env')
for (let key in config) {
    process.env[key] = config[key]
}

require('./public/globalServer')

const Config = require('./public/Config')
const path = __dirname + '/../config/local.ini'

CGlobal.env['currentConfig'] = new Config(path, true)

const ApiTestBase = require('./base/ApiTestBase')
const CryptoJS = require('crypto.js')

class ApiTestSingle extends ApiTestBase{

    constructor() {
        super()
        this.http = this.api.getHttp()
        this.config = CGlobal.env['currentConfig']
    }

    async start() {
        // 先登录
        const session = this.config.read('session')
        if (!CGlobal.isEmpty(session)) {
            await this.http.post('/api/user/logout', {})
        }
        const loginParams = {
            adminId: this.config.read('userName'),
            adminPws: CryptoJS.sha256(this.config.read('password'))
        }
        const loginResult = await this.http.post('/api/user/login', loginParams).then(res => res)
        this.config.write('session', loginResult.credential)

        const execTestArr = []
        execTestArr.push(this.testLogin1())
        execTestArr.push(this.testLogin2())
        Promise.all(execTestArr).then(async allResult => {
            console.log(allResult)

            console.log('成功: %s', this.success)
            console.log('失败: %s', this.fail)
            setTimeout(() => {
                process.exit(0)
            }, 500)
        })

    }

    testLogin1() {

    }

    testLogin2() {

    }
}

const api = new ApiTestSingle()
api.start()
