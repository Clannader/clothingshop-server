/**
 * Create by CC on 2020/11/24
 */
'use strict'

const SwaggerResources = require('./../schema/SwaggerResources')
const Login = require('./Login')
const Rights = require('./Rights')
const Logs = require('./Logs')
// 1.以后新增模块在这里引入

// 2.把module加入进去
const mudules = {
  Login, Rights, Logs
}

const resources = []
const urls = []

CGlobal.forEach(mudules, (key) => {
  const urlModule = new SwaggerResources(key)
  resources.push(urlModule)
  urls.push({
    url: urlModule.url,
    name: urlModule.name
  })
})

module.exports = {
  resources: resources,
  mudules: mudules,
  urls: urls
}
