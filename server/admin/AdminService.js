/**
 * Created by CC on 2016/11/3.
 */
'use strict'
//加打印log,看加载时的顺序
console.log('require AdminService')
const db = require('../dao/daoConnection')
const Admin = db.getEntity('Admin')
// const Shop = db.getEntity('Shop')
// const AdminAccess = db.getEntity('AdminAccess')
const signature = require('cookie-signature')
const moment = require('moment')

const Utils = require('../util/Utils')

const AdminService = {
  //管理员进行登录
  async doLogin(req, res) {
    let aid = req.body['adminId']
    let password = req.body['adminPws']
    const [err, result] = await Admin.loginSystem(req, aid).then(result => [null, result])
        .catch(err => [err])
    if (err) return res.send({code: 0, msg: err.message})
    // 其实到这里,用户不可能不存在了
    let admin = result.admin
    let shop = result.shop
    let otherInfo = result.otherInfo
    let msg = ''
    let code = 0
    let isUpdate = false // 判断是否更新用户信息
    let updateWhere = {} // 用户更新条件
    let retryNumber = admin.retryNumber || 0
    let lockTime = admin.lockTime
    const expireTime = admin.expireTime
    // 1.新增用户密码输错次数
    // 2.新增用户锁定时间
    // 3.新增用户有限期使用时间
    // if (!admin || admin.password !== password) {
    //   msg = CGlobal.serverLang(req.lang, '用户名或密码错误', 'admin.invPws')
    // }
    if (!CGlobal.isEmpty(lockTime)) {
      if (moment().isBefore(moment(lockTime))) {
        return res.send({code: 0, msg: CGlobal.serverLang(req.lang, '该用户已锁定与{0}', 'admin.lockTime'
              , moment(lockTime).format('YYYY-MM-DD HH:mm:ss,SSS'))})
      } else {
        retryNumber = 0 //锁过期之后,重设次数为0
        lockTime = null
      }
    }
    if (admin.password !== password) {
      retryNumber++
      if (retryNumber >= 5) {
        // 输入错误第五次锁定用户
        lockTime = moment().add(1, 'days').toDate()
      }
      updateWhere.retryNumber = retryNumber
      updateWhere.lockTime = lockTime
      isUpdate = true
      msg = CGlobal.serverLang(req.lang, '用户名或密码错误, 今日还可输错{0}次', 'admin.retryPws', 5-retryNumber)
    } else {
      // 密码正确之后,清空错误次数和锁定时间
      isUpdate = true
      updateWhere.retryNumber = 0
      updateWhere.lockTime = null
    }
    if (msg === '') {
      // 避免密码错误了,还会返回其他的错误信息
      if (admin.adminStatus === false) {
        msg = CGlobal.serverLang(req.lang, '用户未激活', 'admin.invStatus')
      } else if (!admin.adminType || admin.adminType === CGlobal.GlobalStatic.User_Type.THIRD) {
        msg = CGlobal.serverLang(req.lang, '第三方用户不能登录系统', 'admin.invUser')
      } else if (shop === null) {
        msg = CGlobal.serverLang(req.lang, '店铺不存在', 'admin.noExistShop')
      } else if (!CGlobal.isEmpty(expireTime) && moment(expireTime).isBefore(moment())) {
        msg = CGlobal.serverLang(req.lang, '该用户已过期', 'admin.expireTime')
      }
    }

    let currentDate = new Date()

    if (isUpdate) {
      if (msg === '') {
        // 没有错误信息,才是登录成功,才会记录登录的时间
        updateWhere.loginTime = currentDate
      }
      Admin.updateOne({adminId: admin.adminId, shopId: admin.shopId},
          {$set: updateWhere}, CGlobal.noop)
    }

    if (msg !== '') {
      return res.send({code: code, msg: msg})
    }
    //登录成功写log
    //登录时用cookie做默认语言
    let store = req.sessionStore
    //重新获取一个新的sessionID
    store.regenerate(req, function () {
      req.session.adminSession = {
        adminId: admin.adminId,
        adminName: admin.adminName,
        adminType: admin.adminType,
        //权限这个也可以每次进来的时候查一遍,避免自己权限被别人更改,没有刷新最新的权限
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
