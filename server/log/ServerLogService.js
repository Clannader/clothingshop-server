'use strict'
console.log('require ServerLogService')

let Utils = require('../util/Utils')
let fs = require('fs')
let logpath = process.env.BASE_PATH + 'logs'
// let conn = require('../dao/daoConnection')
// let AdminLog = conn.getEntity('AdminLog')

function ServerLogService() {

}

ServerLogService.searchLogs = function (req, res) {
  let adminSession = Utils.getAdminSession(req)
  if (!CGlobal.isPermission(adminSession.rights, CGlobal.Rights.ServerLogs.code)) {
    return res.send({
      code: 0, msg: CGlobal.serverLang(req.lang, '抱歉,你没有 [{0}] 权限访问!'
          , 'admin.noRights', CGlobal.Rights.ServerLogs.code)
    })
  }
  const dirs = fs.readdirSync(logpath, 'UTF-8')
      .map(value => {
        const time = fs.statSync(logpath + '/' + value).birthtimeMs // 取创建的时间
        return {
          name: value, // 文件名
          time: time, // 创建日期的时间戳
          date: CGlobal.dateFormat(time, 'YYYY-MM-DD') // 返回标准格式日期
        }
      })
      .sort((t1, t2) => {
        // 按创建日期倒叙
        return t2.time - t1.time
      })
  // let result = []
  // dirs.forEach(function (value) {
  //   result.push({
  //     name: value
  //   })
  // })
  res.send({code: 1, logs: dirs})
}

ServerLogService.downloadLogs = function (req, res) {
  let logName = req.body.logName
  if (!logName) {
    return res.send({
      code: 0, msg: CGlobal.serverLang(req.lang, '日志文件名不能为空!'
          , 'serverLog.logNameIsEmpty')
    })
  }
  let adminSession = Utils.getAdminSession(req)
  if (!CGlobal.isPermission(adminSession.rights, CGlobal.Rights.ServerLogs.code)) {
    return res.send({
      code: 0, msg: CGlobal.serverLang(req.lang, '抱歉,你没有 [{0}] 权限访问!'
          , 'admin.noRights', CGlobal.Rights.ServerLogs.code)
    })
  }
  //使用流来读文件
  // 1.下载文件判断大小,超过大小的,按最末尾的下载最大文件回去
  // 2.该方法兼容查看的api
  // 3.判断文件是否存在
  const startByte = req.body.startByte
  const endByte = req.body.endByte

  // Begin 这个写法虽然可以按照开始结束符读取文件,但是无法知道文件的总大小,有点坑爹
  const options = {
    encoding: 'UTF-8'
  }
  if (!CGlobal.isEmpty(startByte) && !CGlobal.isEmpty(endByte)) {
    options.start = startByte
    options.end = endByte
  }
  const stream = fs.createReadStream(logpath + '/' + logName, options)
  let bufferArr = ''
  stream.on('data', function (chunk) {
    // 这里也很坑爹,根本无法返回buffer对象,但是其他fs的方法读文件就能返回
    bufferArr += chunk
  })

  stream.on('end', function () {
    // 读取文件结束时,查一下文件的总大小
    const fsStat = fs.statSync(logpath + '/' + logName)
    res.send({
      code: 1,
      content: Utils.stringToBase64(bufferArr),
      hasMore: fsStat.size > endByte
    })
  })

  stream.on('error', function (err) {
    res.send({code: 0, msg: err.message})
  })
  // End

  // 读取文件
  // fs.readFile(logpath + '/' + logName, function (err, text) {
  //   if (err) return res.send({code: 0, msg: err.message})
  //   res.send({code: 1, content: Utils.stringToBase64(text + '')})
  // })
}

// 服务器日志不能删除,所以该方法注掉
// ServerLogService.deleteLogs = function (req, res) {
//   let logname = req.body.logname
//   if (!logname) {
//     return res.send({code: 0, msg: CGlobal.serverLang('日志文件名不能为空!')})
//   }
//   let adminSession = Utils.getAdminSession(req)
//   if (!CGlobal.isPermission(adminSession.rights, CGlobal.Rights.ServerLogs.code)) {
//     return res.send({code: 0, msg: CGlobal.serverLang('抱歉,你没有 {0} 权限!', CGlobal.Rights.ServerLogs.code)})
//   }
//   fs.unlink(logpath + '/' + logname, function (err) {
//     if (err) return res.send({code: 0, msg: err.message})
//     AdminLog.createLog({
//       content: CGlobal.serverLang('删除服务器日志:{0}', logname),
//       type: CGlobal.GlobalStatic.Log_Type.SERVER_LOG
//     }, adminSession, CGlobal.noop)
//     res.send({code: 1})
//   })
// }

module.exports = ServerLogService
