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
        const [err, currentConfig] = await this.askConfig.askConfig().then(res => [null, res]).catch(err => [err])
        if (err) {
            console.error(err)
            setTimeout(() => {
                process.exit(0)
            }, 500)
            return
        }
        // 这里result返回的是当前执行的配置文件对象
        CGlobal.env['currentConfig'] = currentConfig

    }
}

module.exports = ApiTestApplication
