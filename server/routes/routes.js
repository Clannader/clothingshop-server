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

  req.fullPath = url
  req.aop = {
    startTime: new Date().getTime()
  }

  // 只能在这里重写了,不然取到的返回值不对
  // 重写response.end方法
  const _end = res.end
  res.end = function (chunk, encoding) {
    this.returnData = chunk + ''
    // 后期记得修改正确的返回状态码,改成1000,四位数,不能是1或者0了
    if (Utils.convertStringToBoolean(Utils.readConfig('errorCatch'))) {
      let resultJSON = chunk + ''
      try {
        resultJSON = JSON.parse(resultJSON)
        if (resultJSON.code && resultJSON.code === CGlobal.GlobalStatic.ApiCode.Error) {
          const printJSON = Object.assign({}, resultJSON, {
            url: url
          })
          console.error(JSON.stringify(printJSON))
          resultJSON.msg = 'System Exception'
          chunk = Buffer.from(JSON.stringify(resultJSON), 'utf8')
          this.set('Content-Length', chunk.length) // 如果不设置这句话,修改chunk是没有返回的
        }
      }catch (e) {
      }
    }
    return _end.apply(this, [chunk, encoding])
  }

  // 这句话写到了initData.js里面去了
  // req.lang = req.headers['language'] || CGlobal.GlobalStatic.CN
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

