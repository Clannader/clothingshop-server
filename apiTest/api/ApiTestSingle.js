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
    }

    async start() {
        const result = await this.api.getHttp()
            .get('/api/test/network', {}).then(res => {
                return res
            }).catch(err => err)
        console.log(result)

        setTimeout(() => {
            process.exit(0)
        }, 500)
    }
}

const api = new ApiTestSingle()
api.start()
