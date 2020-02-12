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

class ApiTestSingle extends ApiTestBase{

    constructor() {
        super()
        this.config = CGlobal.env['currentConfig']
    }

    async beforeStart() {
        // 先登录
        const session = this.config.read('session')
        if (!CGlobal.isEmpty(session)) {
            await this.logout(session)
        }
        const loginResult = await this.login(this.config.read('userName'), this.config.read('password'))
            .then(res => res)
        this.config.write('session', loginResult.credential)

        this.pushTest(this.testLang1())
        this.pushTest(this.testLang2())

    }

    async start() {
        console.log('-------------------开始测试-------------------')
        console.time('耗时')

        await super.start().then(res => res)

        console.timeEnd('耗时')
        setTimeout(() => {
            process.exit(0)
        }, 500)
    }

    async testLang1() {
        const langResult = await this.http.get('/api/test/lang', {}, {
            headers: {
                'language': 'CN'
            }
        }).then(res => res)
        this.assertEqual(langResult.code === this.apiCode.Success
            && langResult.lang === 'CN')
        return ''
    }

    async testLang2() {
        const langResult = await this.http.get('/api/test/lang', {
            headers: {
                'language': 'EN'
            }
        }).then(res => res)
        this.assertEqual(langResult.code === this.apiCode.Success
            && langResult.lang === 'EN')
        return ''
    }
}


const api = new ApiTestSingle()
api.start()
