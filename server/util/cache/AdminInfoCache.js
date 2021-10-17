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
    this.expires = 3 * 60 * 1000
  }

  async getOperaShopList(session) {
    // TODO 这里应该改方法名,应该是一个session对应一个json结构的数据,然后想取什么从结构中取
    // 这里还需要思考的是什么时候回收内存
    const key = session.sessionID
    let shopList = this.getCacheMap(key)
    if (!shopList) {
      console.log('第一次初始化AdminInfoCache[getOperaShopList][%s]', key)
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
