/**
 * Created by CC on 2016/10/12.
 * 总的路由设置
 */
'use strict'
//打印加载时机
console.log('require route')
let express = require('express')
let app = express.Router()
let cluster = require('cluster')
let Utils = require('../util/Utils')
let nodeXss = require('node-xss').clean
let Aspect = require('../h5/CmsAopAspect')

app.all('/*', function (req, res, next) {
  //防止XSS攻击
  let url = req.url
  let method = req.method
  if ('GET' === method) {
    req.query = JSON.parse(nodeXss(JSON.stringify(req.query)))
  } else if ('POST' === method) {
    req.body = JSON.parse(nodeXss(JSON.stringify(req.body)))
  }

  // 其实这里这个语言类型已经没有用了
  CGlobal.GlobalLangType = req.headers['language'] || CGlobal.GlobalStatic.CN

  if (Utils.readConfig('printUrl') === 'true') {
    console.log(CGlobal.logLang('ServerID {0} 请求:{1}'
        , cluster.worker ? cluster.worker.id : 1
        , url))
  }

  req.aop = {
    startTime: new Date().getTime()
  }
  // 这句话写到了initData.js里面去了
  // req.lang = req.headers['language'] || CGlobal.GlobalStatic.CN
  //重写res.end方法
  let _end = res.end
  res.end = function (chunk) {
    res.returnData = chunk + ''
    return _end.apply(this, Array.prototype.slice.apply(arguments))
  }
  Aspect.logAspect(req, res)
  next()
})

//h5专用路由
app.use('/cms/h5/api', require('./h5Routes/login_route'))
app.use('/cms/h5/api/user', require('./h5Routes/user_route'))
app.use(require('./h5Routes/about_cms_route'))
app.use('/cms/h5/api/rights', require('./h5Routes/rights_route'))
// app.use(require('./h5Routes/upload_route'))// 上传文件路由
app.use('/cms/h5/api/logs', require('./h5Routes/server_logs_route'))
app.use('/cms/h5/api/system', require('./h5Routes/system_config_route'))
// swagger 路由
app.use(require('../swagger/swagger-router'))

module.exports = app

