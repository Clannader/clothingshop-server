/**
 * Created by CC on 2016/11/3.
 */
'use strict'
//加打印log,看加载时的顺序
console.log('require AdminService')
const db = require('../dao/daoConnection')
const Admin = db.getEntity('Admin')
const Shop = db.getEntity('Shop')
const AdminAccess = db.getEntity('AdminAccess')
const signature = require('cookie-signature')

const Utils = require('../util/Utils')

const AdminService = {
  //管理员进行登录
  async doLogin(req, res) {
    let aid = req.body['adminId']
    let password = req.body['adminPws']
    const [err, result] = await Admin.loginSystem(req, aid).then(result => [null, result])
        .catch(err => [err])
    if (err) return res.send({code: 0, msg: err.message})
    let admin = result.admin
    let shop = result.shop
    let otherInfo = result.otherInfo
    let msg = ''
    let code = 0
    if (!admin || admin.password !== password) {
      msg = CGlobal.serverLang(req.lang, '用户名或密码错误', 'admin.invPws')
    } else if (admin.adminStatus === false) {
      msg = CGlobal.serverLang(req.lang, '用户未激活', 'admin.invStatus')
    } else if (!admin.adminType || admin.adminType === CGlobal.GlobalStatic.User_Type.THIRD) {
      msg = CGlobal.serverLang(req.lang, '第三方用户不能登录系统', 'admin.invUser')
    } else if (shop === null) {
      msg = CGlobal.serverLang(req.lang, '店铺不存在', 'admin.noExistShop')
    }
    if (msg !== '') {
      return res.send({code: code, msg: msg})
    }
    //登录成功写log
    //登录时用cookie做默认语言
    let store = req.sessionStore
    let currentDate = new Date()
    //重新获取一个新的sessionID
    store.regenerate(req, function () {
      req.session.adminSession = {
        adminId: admin.adminId,
        adminName: admin.adminName,
        //TODO 权限这个也可以每次进来的时候查一遍,避免自己权限被别人更改,没有刷新最新的权限
        //以后会考虑压缩数据,加密后存库,使用参数控制
        //还可以避免数据库内存溢出
        // rights: admin.rights,
        loginTime: currentDate,//这个日期如果在网页显示没有错就可以,如果有错就转格式
        expires: currentDate.getTime(),//有效期
        // activeDate: currentDate.getTime(),//活跃时间
        lastTime: admin.loginTime || currentDate,//上次登录时间
        // language: CGlobal.GlobalLangType,//语言
        shopId: otherInfo.shopId,//当前登录的店铺ID
        // shopList: otherInfo.shopList,//该用户能够操作的店铺ID
        selfShop: otherInfo.selfShop,//用户自己的店铺ID
        // userImg: '/img/default.jpg',
        requestIP: Utils.getRequestIP(req),
        requestHost: req.headers['host'],
        supplierCode: admin.supplierCode || '',//集团代码
        shopName: otherInfo.shopName || ''//店铺名
      }
      let json = {
        code: 1,
        credential: 's:' + signature.sign(
            req.sessionID, CGlobal.GlobalStatic.sessionSecret)
      }
      res.send(json)
    })

    Admin.updateOne({adminId: admin.adminId, shopId: admin.shopId},
        {$set: {loginTime: currentDate}}, CGlobal.noop)
  },

  abort(req, res) {
    this.deleteSession(req, function () {
      return res.send({code: 1})
    })
  },

  deleteSession(req, cb) {
    delete req.session
    req.sessionStore.destroy(req.sessionID, cb)
  },

  allSuper(req, res, next) {
    let adminSession = req.session.adminSession
    if (!adminSession) {
      this.deleteSession(req, () => {
        res.send({code: 901, msg: CGlobal.serverLang(req.lang, '无效的凭证', 'admin.invSession')})
      })
      return
    }
    let currentDate = new Date()
    //这里不整合这2个判断条件是因为第一个条件不满足时,第二个条件无法获取expires值
    if (currentDate.getTime() - adminSession.expires
        > CGlobal.GlobalStatic.Session_Expires) {
      this.deleteSession(req, () => {
        res.send({code: 902, msg: CGlobal.serverLang(req.lang, '凭证过期', 'admin.sessionExp')})
      })
      return
    }
    // CGlobal.GlobalLangType = adminSession.language;
    req.session.adminSession.expires = currentDate.getTime()
        + CGlobal.GlobalStatic.Session_Expires
    next()
  }
}

module.exports = AdminService
