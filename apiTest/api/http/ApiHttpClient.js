/**
 * Create by CC on 2019/9/13
 */
'use strict';

const axios = require('axios')
const log4js = require('log4js')

class ApiHttpClient {

    constructor() {
        this.currentConfig = CGlobal.env['currentConfig']
        this.apiLogs = log4js.getLogger('apiLogs')
        this.init()
    }

    init() {
        this.initHttp()
    }

    initHttp() {
        this.service = axios.create({
            baseURL: this.currentConfig.read('url'),
            timeout: 30000, // 请求超时设置
            headers: { // 自定义请求头
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'language': 'CN'
            }
        });
        this.service.interceptors.request.use(
            req => {
                req.headers['credential'] = this.currentConfig.read('session') || ''
                console.log('请求地址:' + req.baseURL + req.url)
                this.apiLogs.info('请求地址: %s', req.baseURL + req.url)
                const params = req.params ? req.params : (req.data ? req.data : {})
                this.apiLogs.info('请求参数: %s', JSON.stringify(params))
                return req
            },
            error => {
                return Promise.reject(error)
            }
        )

        this.service.interceptors.response.use(
            resp => {
                this.apiLogs.info('返回参数: %s', JSON.stringify(resp.data))
                return resp.data
            },
            error => {
                return Promise.reject(error)
            }
        )
    }

    getHttp() {
        return this.service
    }
}

module.exports = ApiHttpClient
