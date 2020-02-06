/**
 * Create by CC on 2019/9/13
 */
'use strict';

const axios = require('axios')
const CryptoJS = require('crypto-js')

class ApiHttpClient {

    constructor() {
        this.currentConfig = CGlobal.env['currentConfig']
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
                return req
            },
            error => {
                return Promise.reject(error)
            }
        )

        this.service.interceptors.response.use(
            resp => {
                return resp.data
            },
            error => {
                return Promise.reject(error)
            }
        )
    }
}

module.exports = ApiHttpClient
