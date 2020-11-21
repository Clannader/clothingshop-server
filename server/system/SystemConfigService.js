/**
 * Create by CC on 2020/11/21
 */
'use strict'

const Utils = require('../util/Utils')

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

module.exports = SystemConfigService
