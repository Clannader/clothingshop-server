/**
 * Create by CC on 2020/2/6
 */
'use strict'

const AskConfig = require('./ask/AskConfig')
const log4js = require('log4js')
const CryptoJS = require('crypto.js')
const HttpClient = require('./http/ApiHttpClient')

class ApiTestApplication {

    constructor() {
        // this.basePath = CGlobal.env['basePath']
        // this.configFilePath = CGlobal.env['configFilePath']
        // this.configDirPath = CGlobal.env['configDirPath']
        this.apiLogs = log4js.getLogger('apiLogs')
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
        this.http = new HttpClient()
        this.http.setPrint(false)
        this.apiLogs.info('-------------------------API测试开始-------------------------')
        this.apiLogs.info('-------------------------执行时间 %s-------------------------',
            new Date().format('yyyy-MM-dd HH:mm:ss'))
        // 测试输入的地址,用户名密码是否正确
        const startTime = new Date().getTime()

        // 测试地址是否404
        console.log('-------------------------测试网络-------------------------')
        const notFoundErr = await this.http.getHttp()
            .get('/api/test/network', {}).then(() => {
                return null
            }).catch(err => err)
        if (notFoundErr) {
            console.error(notFoundErr.message)
            this.apiLogs.error(notFoundErr.message)
            this.apiLogs.info('-------------------------API测试结束-------------------------')
            this.apiLogs.info('测试总时间: %s ms', new Date().getTime() - startTime)
            setTimeout(() => {
                process.exit(0)
            }, 500)
            return
        }

        // 先把上一个session退出,登录新的用户session
        const session = currentConfig.read('session')
        if (!CGlobal.isEmpty(session)) {
            // session不为空则退出
            await this.http.getHttp().post('/api/user/logout', {})
        }
        //进行api登录
        console.log('-------------------------测试登录-------------------------')
        const loginParams = {
            adminId: currentConfig.read('userName'),
            adminPws: CryptoJS.sha256(currentConfig.read('password'))
        }
        const loginResult = await this.http.getHttp().post('/api/user/login', loginParams).then(res => res)
        // 校验用户名密码是否正确
        if (loginResult.code !== CGlobal.GlobalStatic.ApiCode.Success) {
            console.error(loginResult.msg)
            this.apiLogs.error(loginResult.msg)
            this.apiLogs.info('-------------------------API测试结束-------------------------')
            this.apiLogs.info('测试总时间: %s ms', new Date().getTime() - startTime)
            setTimeout(() => {
                process.exit(0)
            }, 500)
            return
        }
        currentConfig.write('session', loginResult.credential)

        // 获取API版本号
        console.log('-------------------------获取版本-------------------------')
        const versionRes = await this.http.getHttp().get('/api/test/version', {})
            .then(res => res)
        const version = versionRes.version
        this.apiLogs.info('-------------------------API版本 %s-------------------------', version)
        // 校验完了才开始测试
        console.log('-------------------------开始测试案例-------------------------')
        const execTestArr = []
        execTestArr.push(require('./doc/login/LoginTest')().start())
        execTestArr.push(require('./doc/admin/AdminTest')().start())
        Promise.all(execTestArr).then(async allResult => {
            let success = 0
            let fail = 0
            allResult.forEach(result => {
                success += result.success
                fail += result.fail
            })
            this.apiLogs.info('-------------------------API测试结果-------------------------')
            this.apiLogs.info('测试总数:%s', success + fail)
            this.apiLogs.info('成功总数:%s', success)
            this.apiLogs.info('失败总数:%s', fail)
            this.apiLogs.info('测试总时间: %s ms', new Date().getTime() - startTime)
            console.log('测试总数:%s', success + fail)
            console.log('成功总数:%s', success)
            console.log('失败总数:%s', fail)
            console.log('耗时:%s ms', new Date().getTime() - startTime)
            // 这里退出
            console.log('-------------------------测试结束退出-------------------------')
            await this.http.getHttp().post('/api/user/logout', {})
            // 把session清空
            currentConfig.write('session', '')
            console.log('-------------------------API测试结束-------------------------')
            this.apiLogs.info('-------------------------API测试结束-------------------------')
            setTimeout(() => {
                process.exit(0)
            }, 500)
        })

    }
}

module.exports = ApiTestApplication
