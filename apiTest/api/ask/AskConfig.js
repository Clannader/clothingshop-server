/**
 * Create by CC on 2020/2/5
 */
'use strict'

const Config = require('../public/Config')
const inquirer = require('inquirer')
const fs = require('fs')

class AskConfig {
    constructor() {
        this.basePath = CGlobal.env['basePath']
        this.configFilePath = CGlobal.env['configFilePath']
        this.configDirPath = CGlobal.env['configDirPath']
        this.config = new Config(this.configFilePath, true)// 主配置文件
        this.configArr = []
        this.currentConfig = null
    }

    async askConfig() {
        // 判断是否有执行配置文件
        let configName = this.config.read('configName')
        if (CGlobal.isEmpty(configName)) {
            configName = await this.createNewConfig().then(name => name)
        } else {
            // TODO 到时候注释回来
            // configName = await this.replaceConfig(configName).then(name => name)
        }
        if (configName === 'CreateNew') {
            //询问创建新的配置文件
            configName = await this.askCreateConfig().then(name => name)
        }
        // 判断是否存在configName,避免配置被误删
        const currentConfigPath = this.configDirPath + '/' + configName + '.ini'
        if (!fs.existsSync(currentConfigPath)) {
            fs.writeFileSync(currentConfigPath, '')
        }
        this.currentConfig = new Config(currentConfigPath, true)
        this.config.write('configName', configName)

        // 询问配置文件里面的节点内容了
        return this.askReadConfig()
    }

    async createNewConfig() {
        //遍历config文件夹下的ini文件列表
        //这里不使用递归
        let dirs = fs.readdirSync(this.configDirPath, 'UTF-8')
        for (let i = 0; i < dirs.length; i++) {
            let dir = dirs[i]
            let currentPath = this.configDirPath + '/' + dir//当前路径
            let file = fs.lstatSync(currentPath)
            if (file.isDirectory()) {
                //如果是文件夹,递归
                continue
            } else {
                let dirName = dir.substring(0, dir.lastIndexOf('.'))//获取文件名
                let dirSuffix = dir.substring(dir.lastIndexOf('.') + 1, dir.length)//获取文件名后缀
                if (dirSuffix === 'ini' && dirName !== 'config') {
                    this.configArr.push(dirName)
                }
            }
        }
        if (this.configArr.length === 0) {
            //询问创建新的配置文件
            const configName = await this.askCreateConfig().then(name => name)
            return Promise.resolve(configName)
        } else {
            // 新增一个选项标识用户想新增文件
            this.configArr.push('CreateNew')
        }
        const promptList = [
            {
                type: 'list',
                message: '选择配置文件',
                name: 'file',
                choices: this.configArr
            }
        ]
        const name = await inquirer.prompt(promptList).then(name => name)
        return Promise.resolve(name.file)
    }

    async replaceConfig(configName) {
        const promptList = [
            {
                type: 'confirm',
                message: `当前加载 ${configName}.ini 配置文件,是否更换配置文件?`,
                name: 'isCreate'
            }
        ]
        const result = await inquirer.prompt(promptList)
        if (result.isCreate) {
            //创建文件
            return this.createNewConfig()
        } else {
            //不创建则返回当前配置文件名
            return Promise.resolve(configName)
        }
    }

    async askCreateConfig() {
        const that = this
        const promptList = [
            {
                type: 'input',
                message: '输入配置文件名',
                name: 'configName',
                validate: function (val) {
                    if (CGlobal.isEmpty(val)) {
                        return '文件名为空'
                    } else if (val === 'config' || val === 'CreateNew') {
                        return `文件名不能为${val}`
                    } else if (that.configArr.indexOf(val) !== -1) {
                        return '文件名已存在'
                    }
                    return true
                }
            }
        ]
        const name = await inquirer.prompt(promptList).then(name => name)
        return Promise.resolve(name.configName)
    }

    async askReadConfig() {
        let url = this.currentConfig.read('url')
        let userName = this.currentConfig.read('userName')
        let password = this.currentConfig.read('password')
        let promptList = null
        if (CGlobal.isEmpty(url)) {
            promptList = [
                {
                    type: 'input',
                    message: '输入Url地址',
                    name: 'url'
                }
            ]
            const inputUrl = await inquirer.prompt(promptList).then(url => url)
            this.currentConfig.write('url', inputUrl.url)
        }
        if (CGlobal.isEmpty(userName)) {
            promptList = [
                {
                    type: 'input',
                    message: '输入用户名',
                    name: 'userName'
                }
            ]
            const inputUserName = await inquirer.prompt(promptList).then(name => name)
            this.currentConfig.write('userName', inputUserName.userName)
        }
        if (CGlobal.isEmpty(password)) {
            promptList = [
                {
                    type: 'password',
                    message: '输入密码',
                    name: 'password'
                }
            ]
            const inputPassword = await inquirer.prompt(promptList).then(pwd => pwd)
            this.currentConfig.write('password', inputPassword.password)
        }
        return Promise.resolve(this.currentConfig)
    }
}

module.exports = AskConfig
