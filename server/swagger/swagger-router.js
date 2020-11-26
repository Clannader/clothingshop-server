/**
 * Create by CC on 2020/11/24
 */
'use strict'
console.log('require swagger-router')
const express = require('express')
const app = express.Router()

const swaggerService = require('./service')

// 新增swagger功能页面
app.get('/v2/api-docs', function (req, res) {
  const module = req.query.group
  return res.send(swaggerService.mudules[module])
})

app.get('/swagger-resources$', function (req, res) {
  return res.send(swaggerService.resources)
})

app.get('/swagger-resources/configuration/ui$', function (req, res) {
  const config = {
    apisSorter: "alpha",
    deepLinking: true,
    defaultModelExpandDepth: 1,
    defaultModelRendering: "example",
    defaultModelsExpandDepth: 1,
    displayOperationId: true,
    displayRequestDuration: false,
    docExpansion: "none",
    filter: true,
    jsonEditor: false,
    operationsSorter: "alpha",
    showExtensions: false,
    showRequestHeaders: false,
    tagsSorter: "alpha"
  }
  return res.send(config)
})

app.get('/swagger-resources/configuration/security$', function (req, res) {
  return res.send({})
})

app.get('/swagger-ui/$', function (req, res) {
  return res.render('swagger-ui.html')
})

// const swaggerOptions = {
//   explorer: true,
//   swaggerOptions: {
//     // validatorUrl: null
//     // url: 'http://petstore.swagger.io/v2/swagger.json'
//     urls: swaggerService.urls
//   }
//   // customCss: '.swagger-ui .topbar { display: none }'
// }

module.exports = app
