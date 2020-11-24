/**
 * Create by CC on 2020/11/24
 */
'use strict'

const SwaggerResources = require('../schema/SwaggerResources')
const Login = require('./Login')
const Rights = require('./Rights')

const mudules = {
  Login, Rights
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
