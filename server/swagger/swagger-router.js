/**
 * Create by CC on 2020/11/24
 */
'use strict'
console.log('require swagger-router')
const express = require('express')
const app = express.Router()

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

// 新增swagger功能页面
app.get('/v2/swagger.json', function (req, res) {
  res.send(swaggerDocument)
})

app.get('/v2/swagger2.json', function (req, res) {
  res.send(require('./swagger2.json'))
})

const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    // validatorUrl: null
    // url: 'http://petstore.swagger.io/v2/swagger.json'
    urls: [
      {
        url: 'http://localhost:3000/v2/swagger.json',
        name: 'Spec1'
      },
      {
        url: 'http://localhost:3000/v2/swagger2.json',
        name: 'Spec2'
      }
    ]
  }
  // customCss: '.swagger-ui .topbar { display: none }'
}

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions))

module.exports = app
