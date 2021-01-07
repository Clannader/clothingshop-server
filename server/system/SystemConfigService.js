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
  res.send({
    ...result,
    code: 1
  })
}

module.exports = SystemConfigService
