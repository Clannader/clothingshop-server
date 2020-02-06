/**
 * Create by CC on 2020/2/6
 */
'use strict'

const AskConfig = require('./ask/AskConfig')

class ApiTestApplication {

    constructor() {
        // this.basePath = CGlobal.env['basePath']
        // this.configFilePath = CGlobal.env['configFilePath']
        // this.configDirPath = CGlobal.env['configDirPath']
        this.askConfig = new AskConfig()
    }

    async start() {
        const [err, result] = await this.askConfig.askConfig().then(res => [null, res]).catch(err => [err])
        if (err) {
            console.error(err)
            setTimeout(() => {
                process.exit(0)
            }, 500)
            return
        }
    }
}

module.exports = ApiTestApplication
