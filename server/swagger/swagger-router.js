/**
 * Create by CC on 2020/11/24
 */
'use strict'
console.log('require swagger-router')
const express = require('express')
const app = express.Router()

const swaggerUi = require('swagger-ui-express')
const swaggerService = require('./service')

// 新增swagger功能页面
app.get('/v2/api-docs', function (req, res) {
  const module = req.query.group
  res.send(swaggerService.mudules[module])
})

app.get('/swagger-resources', function (req, res) {
  res.send(swaggerService.resources)
})

const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    // validatorUrl: null
    // url: 'http://petstore.swagger.io/v2/swagger.json'
    urls: swaggerService.urls
  }
  // customCss: '.swagger-ui .topbar { display: none }'
}

app.use('/swagger-ui',
    swaggerUi.serve,
    swaggerUi.setup(swaggerService.mudules[swaggerService.urls[0].name], swaggerOptions)
)

module.exports = app
