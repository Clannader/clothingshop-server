'use strict'
console.log('require ServerLogService')

let Utils = require('../util/Utils')
let fs = require('fs')
let logpath = process.env.BASE_PATH + 'logs'
let conn = require('../dao/daoConnection')
let AdminLog = conn.getEntity('AdminLog')

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
  let dirs = fs.readdirSync(logpath, 'UTF-8')
  let result = []
  dirs.forEach(function (value) {
    result.push({
      name: value
    })
  })
  res.send({code: 1, logs: result})
}

ServerLogService.downloadLogs = function (req, res) {
  let logname = req.query.logname
  if (!logname) {
    return res.send({code: 0, msg: CGlobal.serverLang('日志文件名不能为空!')})
  }
  let adminSession = Utils.getAdminSession(req)
  if (!CGlobal.isPermission(adminSession.rights, CGlobal.Rights.ServerLogs.code)) {
    return res.send({code: 0, msg: CGlobal.serverLang('抱歉,你没有 {0} 权限!', CGlobal.Rights.ServerLogs.code)})
  }
  //TODO 这里做成每次只读10M文件,当前端用户看到底部时,再加载10M
  //使用流来读文件
  fs.readFile(logpath + '/' + logname, function (err, text) {
    if (err) return res.send({code: 0, msg: err.message})
    res.send({code: 1, content: text + ''})
  })
}

ServerLogService.deleteLogs = function (req, res) {
  let logname = req.body.logname
  if (!logname) {
    return res.send({code: 0, msg: CGlobal.serverLang('日志文件名不能为空!')})
  }
  let adminSession = Utils.getAdminSession(req)
  if (!CGlobal.isPermission(adminSession.rights, CGlobal.Rights.ServerLogs.code)) {
    return res.send({code: 0, msg: CGlobal.serverLang('抱歉,你没有 {0} 权限!', CGlobal.Rights.ServerLogs.code)})
  }
  fs.unlink(logpath + '/' + logname, function (err) {
    if (err) return res.send({code: 0, msg: err.message})
    AdminLog.createLog({
      content: CGlobal.serverLang('删除服务器日志:{0}', logname),
      type: CGlobal.GlobalStatic.Log_Type.SERVER_LOG
    }, adminSession, CGlobal.noop)
    res.send({code: 1})
  })
}

module.exports = ServerLogService
