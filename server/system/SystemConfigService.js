/**
 * Create by CC on 2020/11/21
 */
'use strict'

const Utils = require('../util/Utils')
const conn = require('../dao/daoConnection')
const SystemConfig = conn.getEntity('SystemConfig')

function SystemConfigService() {

}

SystemConfigService.getSystemConfig = function (req, res) {
  const config = {
    config: {
      dateFormat: 'yyyy/MM/dd',
      version: Utils.readConfig('version'),
      author: Utils.readConfig('author'),
      copyright: Utils.readConfig('copyright')
    },
    code: 1
  }
  return res.send(config)
}

SystemConfigService.getSystemGroup = async function (req, res) {
  const session = Utils.getAdminSession(req)
  const [err, result] = await SystemConfig.getSystemGroupPage(req, session)
      .then(result => [null, result]).catch(err => [err])
  if (err) {
    return res.send({code: 0, msg: err.message})
  }
  return res.send({
    ...result,
    code: 1
  })
}

SystemConfigService.createSystemGroup = function (req, res) {

}

SystemConfigService.modifySystemGroup = function (req, res) {

}

SystemConfigService.getSystemInfo = async function (req, res) {
  const session = Utils.getAdminSession(req)
  const id = req.query.id
  if (CGlobal.isEmpty(id)) {
    return res.send({code: 0, msg: CGlobal.serverLang(req.lang, '查询ID不能为空'
          , 'systemConfig.isEmptyId')})
  }
  // 避免前端乱传值进来
  req.body = Object.assign({}, { id })
  const [err, result] = await SystemConfig.findGroupByWhere(req, session)
      .then(result => [null, result]).catch(err => [err])
  if (err) {
    return res.send({code: 0, msg: err.message})
  }
  return res.send({
    ...result,
    code: 1
  })
}

module.exports = SystemConfigService
