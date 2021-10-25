'use strict'
console.time('HTTP service start time is')
console.time('HTTPS service start time is')

//Express框架
const express = require('express')
const app = express()
// const path = require('path');
const helmet = require('helmet')//防止XSS攻击
const Utils = require('./server/util/Utils')
const fs = require('fs')
const contextPath = Utils.getContextPath()

// 如果不加contextPath的话,默认是/,加了的话,就是匹配contextPath才会进入接口了
app.use(helmet())
//设置响应头
app.disable('x-powered-by')//不要这个头
app.use(contextPath, function initXmlData(req, res, next) {
  // res.setHeader('Strict-Transport-Security','max-age=31536000');
  // res.setHeader('X-Content-Type-Options','nosniff');
  // res.setHeader('X-Frame-Options','SAMEORIGIN');
  // res.setHeader('X-Xss-Protection','1;mode=block');
  // res.setHeader('Content-Security-Policy',"script-src 'self' 'unsafe-inline'; object-src 'self'");

  //解析格式化xml请求体
  if (Utils.isHasSoapHeader(req)) {
    const xmlData = []
    let xmlLen = 0
    req.on('data', data => {
      xmlData.push(data)
      xmlLen += data.length
    })
    req.on('end', () => {
      req.xmlData = Buffer.concat(xmlData, xmlLen).toString()
      next()
    })
  } else {
    next()
  }
})

//请求中加cookie
const cookieParser = require('cookie-parser')
app.use(cookieParser())

//请求解析body
const bodyParser = require('body-parser')
app.use(bodyParser.json({limit: '10mb'}))
app.use(bodyParser.urlencoded({extended: false, limit: '10mb'}))

//加载静态资源
app.use(contextPath, express.static('./public'))

const headerParser = require('./server/plugin/header-parser')//自定义解析头部信息中间件
app.use(contextPath, headerParser())

//请求中加log
//以后看看这个模块是怎么获取每次请求的时间的
//研究如何记录每个请求的响应时间,记录在哪还是单纯的写LOG
//是否是在这里写个回调就是req最后end的地方了吗?BUG
// const logger = require('morgan');
//log模块包使用例子,打印url Log
// logger.token('url',function (req,res) {
//     console.log(req.url);
// });
//打印请求的资源路径log
// app.use(logger('dev'));

//请求中加session
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
// const db_url = 'mongodb://'+Utils.readConfig('db_user')+':'+Utils.readConfig('db_pws')+
//         '@'+Utils.readConfig('db_url').split('//')[1];
// const db_url = Utils.readConfig('db_url').replace('\/\/'
//     , '\/\/' + Utils.readConfig('db_user') + ':' + Utils.readConfig('db_pws') + '@');

// 新增重写 MongoStore 里面的set(session)的方法,改变存储session的结构
class TemplateMongoStore extends MongoStore {
  // 其实这里改源码是最方便的,但是为了避免升级模块包的时候,覆盖代码了,还是这里重写比较好
  set(sid, session, callback) {
    // Removing the lastModified prop from the session object before update
    if (this.options.touchAfter > 0 && session && session.lastModified) {
      delete session.lastModified
    }

    let s

    if (this.Crypto) {
      try {
        session = this.Crypto.set(session)
      } catch (error) {
        return this.withCallback(Promise.reject(error), callback)
      }
    }

    // 其实这里把我们代码自定义的session结构丢进去存就可以了,这样就可以统计很多东西了
    // lodash.assignIn这样引入导致打包过大
    try {
      s = CGlobal.extend({
        _id: this.computeStorageId(sid),
        session: this.transformFunctions.serialize(session)
      }, session.adminSession)
    } catch (err) {
      return this.withCallback(Promise.reject(err), callback)
    }

    if (session && session.cookie && session.cookie.expires) {
      s.expires = new Date(session.cookie.expires)
    } else {
      // If there's no expiration date specified, it is
      // browser-session cookie or there is no cookie at all,
      // as per the connect docs.
      //
      // So we set the expiration to two-weeks from now
      // - as is common practice in the industry (e.g Django) -
      // or the default specified in the options.
      s.expires = new Date(Date.now() + this.ttl * 1000)
    }

    if (this.options.touchAfter > 0) {
      s.lastModified = new Date()
    }

    return this.withCallback(
      this.collectionReady()
        .then(collection =>
          collection.updateOne(
            { _id: this.computeStorageId(sid) },
            { $set: s },
            Object.assign({ upsert: true }, this.writeOperationOptions)
          )
        )
        .then(rawResponse => {
          if (rawResponse.result) {
            rawResponse = rawResponse.result
          }
          if (rawResponse && rawResponse.upserted) {
            this.emit('create', sid)
          } else {
            this.emit('update', sid)
          }
          this.emit('set', sid)
        }),
      callback
    )
  }

  // 对于promise和callback的使用,可以参考这个方法,或者这个store类,是一个比较好的例子
  withCallback(promise, cb) {
    if (cb) {
      promise.then(res => cb(null, res)).catch(cb)
    }
    return promise
  }
}

const conn = require('./server/dao/daoConnection')
require('./server/dao/registerEntity')
app.use(contextPath, session({
  name: CGlobal.GlobalStatic.sessionName, secret: CGlobal.GlobalStatic.sessionSecret,
  // saveUninitialized: false, resave: true,//这种模式每次产生的session都是相同的
  saveUninitialized: false,// 是否自动保存未初始化的会话
  resave: true,//是否每次都重新保存会话
  // cookie:{
  //     autoSetup: false//自定义字段控制不设cookie
  // maxAge: CGlobal.GlobalStatic.Cookie_Expires,
  // expires: 0,
  // secure: true
  // },//session存在cookie的有效时间,我觉得可以不用设置
  store: new TemplateMongoStore({
    // url: db_url,
    mongooseConnection: conn.getConnection(),
    // collection:'sessions',//默认这个库
    //数据库的session过期时间,不是自己定义的session过期时间
    ttl: CGlobal.GlobalStatic.dbSession_Expires
    // autoRemove: 'native',// mongo2.2+自动移除过期的session,disable为禁用,默认native
    // autoRemoveInterval: 10, //移除过期session间隔时间,默认为10分钟
    // touchAfter: 24 * 3600 //同步session间隔,默认每次请求都会同步到数据库
  })
}))

//添加网站的图标
//const favicon = require('serve-favicon');
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//加载ejs视图框架包
const ejs = require('ejs')
//页面视图采用html
app.set('views', process.env.BASE_PATH + 'views')
app.engine('.html', ejs.__express)
app.set('view engine', 'html')

// app.use(require('./server/swagger/swagger-router'))
// 初始化用户数据
app.use(contextPath, require('./server/plugin/initData'))
//加载路由
app.use(contextPath, require('./server/routes/routes'))
//修复必要数据
require('./server/repairDB/repair')

// catch 404 and forward to error handler
// 404的产生是访问服务器没有匹配的路由才会调到这里来
app.use(function notFoundError(req, res) {
  //有三个参数req,res,next
  // console.error(CGlobal.logLang('错误LOG:请求路径为 {0} 的网页找不到,发生404错误', req.url));
  // 如果有的去404页面,如果是user进来的再说,如果是新页面进来的又再说,
  //流程如下:
  /*
     1.新页面路径/index,定义一条
     2.super路径的,以super开头的,没有session,进一个界面,返回superLogin
          有session的,进另外一个
     3.user路径的暂时不考虑
     4.不满足上面的,不管有没有session都返回一个json即可,考虑到接口问题
   */

  // const url = req.url;
  // const isSuper = url.startsWith('/super');
  //要以super开头,并且没有"x-requested-with"这个头才是网页调用
  // const isHasXMLHeader = Utils.isHasXMLHeader(req);//是否有x-requested-with头???
  // const isHasJsonHeader = req.headers['content-type']
  //     && req.headers['content-type'] === 'application/json';
  // if (isSuper && !isHasXMLHeader) {
  //     if (req.session.adminSession) {
  //         return res.render('public/404', {referer: url, redirectUrl: '/super/index/home'});
  //     } else {
  //         return res.redirect('/superLogin');
  //     }
  // }
  // req.isUrlNotFound = true;

  // 这里有个BUG,如果是在/cms/h5/api开头的地址,如果地址不存在,不会返回404,而会返回901,这个很尴尬
  // 其实也可以做到返回404,但是做法有点尴尬,不好理解,可以在aop那边修改返回值,判断如果进入了404的方法则修改返回值即可
  // 否则就是无效的凭证
  res.send({code: 404, msg: CGlobal.serverLang('请求 {0} 地址不存在', req.url)})
  //这里还有个隐患如果是用户session的话怎么办
  //这里无法区分是用户还是管理员访问的404页面BUG
})

// production error handler
// no stacktraces leaked to user
// 这里就是请求回调错误处理的地方
app.use(function unknownError(err, req, res, next) {//这里的next一定不能少不然不会进来,不知道为什么...
  if (Utils.readConfig('printError') === 'true') {
    console.error(err.stack || 'error stack:null')
    console.error(CGlobal.logLang('错误LOG:请求服务器 {0} 错误', err.message))
  }
  res.send({code: 999, msg: err.message})
  next()
})

const registerRouter = function (layer) {
  const stackObejct = {
    // 这里需要在express模块的layer.js里面的属性加入orgPath这个字段,否则获取的值不对
    orgPath: layer.orgPath,
    regexp: layer.regexp.toString()
  }
  const children = []
  if (layer.handle.stack) {
    layer.handle.stack.forEach(value => {
      children.push(registerRouter(value))
    })
  }
  // else if (layer.route) {
  //   layer.route.stack.forEach(value => {
  //     children.push(registerRouter(value))
  //   })
  // }
  if (children.length > 0) {
    stackObejct['children'] = children
  }
  // if (!Array.isArray(stackObejct['children'])) {
  //   delete stackObejct['children']
  // }
  return stackObejct
}
// 这里开始统计所有的路由
app._router.stack.forEach(v => {
  // 这里不能用filter的方法进行过滤,因为这样过滤出来的数据不对
  if (v.name === 'router') {
    const stack = []
    v.handle.stack.forEach(value => {
      stack.push(registerRouter(value))
    })
    fs.writeFileSync(process.env.BASE_PATH + 'routerGenerator/router.json', JSON.stringify(stack))
  }
})


if (Utils.readConfig('startHTTP') === 'true') {
  startHTTP()
}
else {
  //为了让定时器定时结束,否则这个console.time会一直计时下去的
  console.timeEnd('HTTP service start time is')
  console.log('But HTTP service did not start')
}

if (Utils.readConfig('startHTTPS') === 'true') {
  startHTTPS()
}
else {
  console.timeEnd('HTTPS service start time is')
  console.log('But HTTPS service did not start')
}

//这里如果设置ip为127.0.0.1就是localhost,但是如果其他服务用了这个端口,
//用127.0.0.1这个ip是检测不出被占用的,所以要定义undefined
// const ip = Utils.readConfig('ip');
// const os = require('os');
// const hostname = Utils.readConfig('ip');
// if (ip === '127.0.0.1' || ip === 'localhost') {
//     ip = undefined;
//     hostname = os.hostname();
// }

function startHTTP() {
  /**
   * Create HTTP server.
   */
  let ip = Utils.readConfig('ip')
  if (ip === '127.0.0.1' || ip === 'localhost') {
    ip = undefined
  }
  const http = require('http')
  const server = http.createServer(app)
      .listen(Utils.readConfig('http_port'), ip)
      .on('error', onError)
      .on('listening', onListening)

  // app.set('port', Utils.readConfig('http_port'));
  /**
   * Event listener for HTTP server "error" event.
   */
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error
    }

    const bind = typeof Utils.readConfig('http_port') === 'string'
        ? 'Pipe ' + Utils.readConfig('http_port')
        : 'Port ' + Utils.readConfig('http_port')

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges')
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(bind + ' is already in use')
        process.exit(1)
        break
      default:
        throw error
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */
  function onListening() {
    const addr = server.address()
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port: ' + addr.port
    //打印log
    console.log(CGlobal.logLang('clothingshop:server HTTP启动成功,{0} IP地址为:{1}', bind, ip || 'localhost'))
    console.timeEnd('HTTP service start time is')
    console.log('界面访问 http://%s:%s%s/index', 'localhost', addr.port, contextPath === '/' ? '' : contextPath)
    console.log('swagger界面访问 http://%s:%s%s/swagger-ui/', 'localhost', addr.port, contextPath === '/' ? '' : contextPath)
    // console.log('Node 界面访问 http://%s:%s/superLogin', hostname, addr.port);
    // console.log('Vue 界面访问 http://%s:%s/v-index', hostname, addr.port);
    // console.log('Angular 界面访问 http://%s:%s/ng-index', hostname, addr.port);
  }
}

function startHTTPS() {
  /************启动HTTPS服务********************/
      //Create HTTPS server
  const https = require('https')
  // const os = require('os')
  let ip = Utils.readConfig('ip')
  // let hostname = ip
  if (ip === '127.0.0.1' || ip === 'localhost') {
    ip = undefined
    if (Utils.readConfig('clusterServer') !== 'true') {
      // hostname = os.hostname
    }
  }
  const options = {
    key: fs.readFileSync('./certs/privateKey.pem'),
    cert: fs.readFileSync('./certs/certificate.pem')
  }
  const https_server = https.createServer(options, app)
      .listen(Utils.readConfig('https_port'), ip)
      .on('error', onHttpsError)
      .on('listening', onHttpsListening)

  /**
   * Event listener for HTTP server "error" event.
   * 这里不能共用一个onError方法,因为传入的第一个参数就是error,不懂怎么传进第二个参数
   * 要是以后懂再整合代码吧
   * 这里的服务的on方法到底是怎么调用的????
   * 方法的参数可以改变吗???
   * onListening同理
   */
  function onHttpsError(error) {
    if (error.syscall !== 'listen') {
      throw error
    }

    const bind = typeof Utils.readConfig('https_port') === 'string'
        ? 'Pipe ' + Utils.readConfig('https_port')
        : 'Port ' + Utils.readConfig('https_port')

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges')
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(bind + ' is already in use')
        process.exit(1)
        break
      default:
        throw error
    }
  }

  /**
   * Event listener for HTTPS server "listening" event.
   */
  function onHttpsListening() {
    const addr = https_server.address()
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port: ' + addr.port
    //打印log
    console.log(CGlobal.logLang('clothingshop:server HTTPS启动成功,{0} IP地址为:{1}', bind, ip || 'localhost'))
    console.timeEnd('HTTPS service start time is')
    // console.log('Node 界面访问 https://%s:%s/superLogin', hostname, addr.port);
    // console.log('界面访问 https://%s:%s/index', hostname, addr.port);
    // console.log('Angular 界面访问 https://%s:%s/ng-index', hostname, addr.port);
  }
}

//防止未知的错误导致服务器中断
//其实这个方法看到网上说不建议这样做,以后懂了再想想怎么处理这个问题
//不建议这样做的原因是: uncaughtException 事件来阻止进程退出,这种做法有内存泄露的风险,所以千万不要这么做
//以后学习Nodejs的process进程机制,看报错如何处理
//2017.7.16这里是处理异步执行on('error')时报的错误,或者是throw error捕获的错误
//避免服务器停止罢了,无法返回客户端会一直堆栈
//请求一直在等待,内存上涨.原因在于res.end 永远不会执行
//现有的I/O处于等待的状态,已经开辟的资源不仅不会被释放,而且服务器还在不知疲倦地接受新的用户请求.
process.on('uncaughtException', function (err) {
  //打印出错误
  console.log(CGlobal.logLang('process的错误信息:'))
  console.error(err)
  //这里就不打印错误了,已经有方法打印了
  //如果没有加这个方法,如果报错,服务器就中断了,所以还是得加,哎
})

