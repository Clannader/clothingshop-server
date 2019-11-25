/**
 * Create by CC on 2019/9/22
 */
'use strict';

const BaseCache = require('../CacheUtil');

/**
 * 第三方用户登录系统缓存类
 */
class UserCache extends BaseCache{

    getUserCache(key){
        return this.getCacheMap(key);
    }

}

module.exports = new UserCache();