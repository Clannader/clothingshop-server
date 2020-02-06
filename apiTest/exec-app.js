/**
 * Create by CC on 2020/2/5
 */
'use strict'

const env = process.env.NODE_ENV || 'dev'
const config = require('./config/' + env + '.env')
for (let key in config) {
    process.env[key] = config[key]
}

const basePath = process.env['BASE_PATH']
const fs = require('fs')
// 判断是否存在config文件夹
const configDirPath = basePath + 'config'
if (!fs.existsSync(configDirPath)) {
    fs.mkdirSync(configDirPath)
}
const configFilePath = configDirPath + '/config.ini'
if (!fs.existsSync(configFilePath)) {
    fs.writeFileSync(configFilePath, '')
}

require('./api/public/globalServer')

const App = require('./api/ApiTestApplication')
const apiTest = new App()
apiTest.start()
