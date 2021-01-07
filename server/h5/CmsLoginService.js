/**
 * Create by CC on 2018/11/1
 */
'use strict'

let Utils = require('../util/Utils')
let adminService = require('../admin/AdminService')

function CmsLoginService() {

}

CmsLoginService.checkCors = function (req, res, next) {
  // 这句话写到了initData.js里面去了
  // if(Utils.readConfig('cors') === 'true'){
  //     res.setHeader('Access-Control-Allow-Origin', '*');
  //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  //     res.setHeader('Access-Control-Allow-Headers', '*');
  // }
  let method = req.method
  if ('OPTIONS' === method) {
    return res.send({})
  }
  //重新赋值语言类型
  let language = req.headers['language'] || CGlobal.GlobalStatic.CN
  CGlobal.GlobalLangType = language
  // let session = Utils.getAdminSession(req);
  // if (session){
  //     session.language = language
  // }
  if (!Utils.isHasJsonHeader(req)) {
    return res.send({code: 900, msg: CGlobal.serverLang(req.lang, '缺少content-type头信息', 'admin.invContent')})
  }
  if (!Utils.isHasXMLHeader(req)) {
    return res.send({code: 900, msg: CGlobal.serverLang(req.lang, '缺少x-requested-with头信息', 'admin.invRequest')})
  }
  let url = req.url
  if (url === '/user/login') {
    return next()
  }
  adminService.allSuper.apply(adminService, arguments)
}

CmsLoginService.userLogin = function (req, res) {
  adminService.doLogin.apply(adminService, arguments)
}

CmsLoginService.userLogout = function (req, res) {
  adminService.abort.apply(adminService, arguments)
}

module.exports = CmsLoginService
