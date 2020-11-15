/**
 * Created by CC on 2017/9/17.
 * 操作log业务类
 */
'use strict'
console.log('require UserLogService')

let conn = require('../dao/daoConnection')
let Utils = require('../util/Utils')
let AdminLog = conn.getEntity('AdminLog')

// let Shop = conn.getEntity('Shop');

function UserLogService() {

}

UserLogService.getUserLogsList = function (req, res) {
  const session = Utils.getAdminSession(req)
  AdminLog.queryLog(req, session, function (err, result) {
    if (err) {
      return res.send({code: -1, msg: err.message})
    }
    res.send({code: 1, logs: result.rows, total: result.total})
  })
}

module.exports = UserLogService
