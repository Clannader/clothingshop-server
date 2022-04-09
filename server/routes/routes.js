/**
 * Created by CC on 2016/10/12.
 * 总的路由设置
 */
'use strict'
// 打印加载时机,其实我也不知道当时为什么要写上这个加载时机,可能为了看看nodejs的加载顺序吧
// 一晃就过去6年了,这个项目还没有什么起色,还是以前的老样子,也没有什么时间和心情写,感觉很多事情要做,但是没有精力去完成了
// 似乎变成了我现在的一个遗憾,也不知道什么时候可以完成心中所想,或许真的要放弃很多东西,才能有时间完成理想吧
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
  // 其实这里还是有点问题的,如果使用Delete,Put等请求方式,就不会进来了,但是目前这个系统主要还是用get和post请求方式
  if ('GET' === method) {
    req.query = JSON.parse(nodeXss(JSON.stringify(req.query)))
  } else if ('POST' === method) {
    req.body = JSON.parse(nodeXss(JSON.stringify(req.body)))
  }

  // 其实这里这个语言类型已经没有用了
  // CGlobal.GlobalLangType = req.headers['language'] || CGlobal.GlobalStatic.CN

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
  // 这里先判断开参数再去重写end方法会比较好一点,这样减少end方法重写的开销
  // 2022-04-09 这里不能按照之前那样写,这样会导致记录用户行为的时候没办法记录返回的信息
  const _end = res.end
  res.end = function (chunk, encoding) {
    this.returnData = chunk + ''
    // 后期记得修改正确的返回状态码,改成1000,四位数,不能是1或者0了
    let resultJSON = chunk + ''
    if (Utils.convertStringToBoolean(Utils.readConfig('errorCatch'))) {
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
      } catch (e) {}
    }
    return _end.apply(this, [chunk, encoding])
  }

  // 这句话写到了initData.js里面去了
  // req.lang = req.headers['language'] || CGlobal.GlobalStatic.CN
  Aspect.logAspect(req, res)
  next()
})

// h5专用路由
// 这里进行路由的改革,虽然知道可以加contextPath,但是加了之后不利于我以后查找api的地址,所以还是沿用老方式来定义路由
// 这是新方式,不使用
// app.use('/cms/h5/api', require('./h5Routes/login_route'))
// 使用以下方式
app.use(require('./h5Routes/login_route'))
app.use(require('./h5Routes/user_route'))
app.use(require('./h5Routes/about_cms_route'))
app.use(require('./h5Routes/rights_route'))
// app.use(require('./h5Routes/upload_route'))// 上传文件路由
app.use(require('./h5Routes/server_logs_route'))
app.use(require('./h5Routes/system_config_route'))
// swagger 路由
app.use(require('../swagger/swagger-router'))

module.exports = app

