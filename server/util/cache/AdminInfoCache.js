/**
 * Create by CC on 2020/10/15
 */
'use strict'
const BaseCache = require('../CacheUtil')
const conn = require('../../dao/daoConnection')
const Admin = conn.getEntity('Admin')

/**
 * Admin用户信息缓存类
 */
class AdminInfoCache extends BaseCache {

  constructor() {
    super()
    this.expires = 60 * 1000
  }

  async getOperaShopList(session) {
    const key = session.sessionID
    let shopList = this.getCacheMap(key)
    if (!shopList) {
      console.log('第一次初始化AdminInfoCache[getOperaShopList]')
      const shopListResult = await Admin.getOperaShopList(session).then(result => result).catch(err => {
        console.error(err)
        return null
      })
      this.setCacheMap(key, {shopList: shopListResult})
    }
    return Promise.resolve(this.getCacheMap(key))
  }

}

module.exports = new AdminInfoCache()
