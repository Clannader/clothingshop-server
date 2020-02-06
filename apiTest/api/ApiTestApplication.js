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

        console.time('测试总时间')
        const execTestArr = []
        execTestArr.push(require('./doc/login/LoginTest')().start())
        execTestArr.push(require('./doc/admin/AdminTest')().start())
        Promise.all(execTestArr).then(allResult => {
            let success = 0
            let fail = 0
            allResult.forEach(result => {
                success += result.success
                fail += result.fail
            })
            console.log('测试总数:%s', success + fail)
            console.log('成功总数:%s', success)
            console.log('失败总数:%s', fail)
            console.timeEnd('测试总时间')
            setTimeout(() => {
                process.exit(0)
            }, 500)
        })

    }
}

module.exports = ApiTestApplication
