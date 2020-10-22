/**
 * Create by CC on 2020/4/19
 *
 * 初始化用户的权限和能操作的店铺ID列表
 */
'use strict'

const conn = require('../dao/daoConnection')
const Rights = conn.getEntity('Rights')
const Admin = conn.getEntity('Admin')
const Utils = require('../util/Utils')
const adminInfoCache = require('../util/cache/AdminInfoCache')

const initAdminInfo = async function (req, res, next) {
    req.lang = req.headers['language'] || CGlobal.GlobalStatic.CN
    if(Utils.readConfig('cors') === 'true'){
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
    }
    if (req.method === 'OPTIONS') {
        return next()
    }
    let adminSession = Utils.getAdminSession(req)
    if(!adminSession){
        return next()
    }
    let field = {
        adminId: 1,
        rights: 1
    }
    let adminInfo = await Admin._getAdminInfo(adminSession.adminId, adminSession.selfShop, field)
        .then(res => res).catch(err => {
            console.error(err)
            return null
        })
    if (!adminInfo) {
        return res.send({code: 0,
            msg: CGlobal.serverLang(req.lang, '获取权限失败', 'admin.errorRights')})
    }
    const adminRights = adminInfo.rights
    const rights = await Rights._getAdminRights(adminRights).then(res => res).catch(err => {
        console.error(err)
        return null
    })
    if(!rights){
        return res.send({code: 0,
            msg: CGlobal.serverLang(req.lang, '获取权限失败', 'admin.errorRights')})
    }
    adminSession.rights = rights // 这个是换算后的权限列表,都是数字组成
    adminSession.orgRights = adminRights // 这个是用户原始的权限代码

    // 新增获取用户能操作的酒店列表
    const shopListResult = await adminInfoCache.getOperaShopList(adminSession)
    adminSession.shopList = shopListResult['shopList'] || []
    // console.log(adminSession.shopList)
    next()
}

module.exports = initAdminInfo
