/**
 * Create by CC on 2018/12/21
 */
'use strict'
const db = require('../dao/daoConnection')
const AdminAccess = db.getEntity('AdminAccess')
const httpFinished = require('on-finished')
const Utils = require('../util/Utils')

class CmsAopAspect {

  static async logAspect(req, res) {
    if (req.method === 'OPTIONS') {
      return
    }
    let date = new Date()
    let adminSession = Utils.getAdminSession(req)
    if (!adminSession) {
      adminSession = {
        adminId: req.headers['adminid'] || 'NULL',
        shopId: req.headers['shopid'] || 'NULL',
        selfShop: req.headers['shopid'] || 'NULL'
      }
    }
    let ip = Utils.getRequestIP(req)
    let method = req.method
    let url = req.url
    let body = req.query || {}
    let query = req.body || {}

    let params = {...query, ...body}
    let createParams = {}
    try {
      let aid = adminSession.adminId
      let shopId = adminSession.shopId
      const adminType = await AdminAccess.queryAdmin(aid, adminSession.selfShop)
      let isIndex = url.indexOf(CGlobal.GlobalStatic.baseUrl) !== -1//如果url含有index,说明是网页进来的
      createParams = {
        adminId: aid,
        adminType: adminType ? adminType.adminType : 'NULL',
        shopId: shopId,//用登录时的shopId
        date: date,
        iP: ip,
        url: url,
        params: Utils.isHasSoapHeader(req) ? req.xmlData : JSON.stringify(params),
        type: isIndex ? CGlobal.GlobalStatic.Log_Type.BROWSER : CGlobal.GlobalStatic.Log_Type.INTERFACE,
        method: method.toLowerCase(),
        headers: JSON.stringify(req.headers)
      }
      // AdminAccess.create(createParams, function (err) {
      //     if (err) console.error(err);
      // });
    } catch (e) {
      console.error(e)
    }

    httpFinished(res, () => {
      const timestamp = new Date().getTime() - req.aop.startTime
      createParams.timestamp = timestamp

      // let returnData = res.returnData;
      // if(req.isUrlNotFound){
      //     console.log(returnData)
      //     let temp = JSON.parse(returnData);
      //     temp.code = 404;
      //     returnData = JSON.stringify(temp);
      // }
      // createParams.send = returnData;

      // 这里无法清除session中的rights
      // 改用直接操作数据库来弄吧
      const store = req.sessionStore
      // const sessions = db.getCollection('sessions')
      const sessionID = req.sessionID
      store.get(sessionID, (err, session) => {
        if (session) {
          delete session.adminSession.rights
          delete session.adminSession.shopList
          delete session.adminSession.sessionID
          delete session.adminSession.orgRights
          delete session.adminSession.isFirstLogin
          store.set(sessionID, session, err => {
            if (err) {
              console.error(err)
            }
          })
        }
      })

      createParams.send = res.returnData
      createParams.date = new Date()
      AdminAccess.create(createParams, function (err) {
        if (err) console.error(err)
      })
    })
  }
}


module.exports = CmsAopAspect
