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
    let shopList = this.getCacheMap('shopList')
    if (!shopList) {
      console.log('第一次初始化AdminInfoCache[getOperaShopList]')
      const shopListResult = await Admin.getOperaShopList(session).then(result => result).catch(err => {
        console.error(err)
        return null
      })
      this.setCacheMap('shopList', {shopList: shopListResult})
    }
    return Promise.resolve(this.getCacheMap('shopList'))
  }

}

module.exports = new AdminInfoCache()
