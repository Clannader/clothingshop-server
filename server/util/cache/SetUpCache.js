/**
 * Create by CC on 2019/9/22
 */
'use strict';
const BaseCache = require('../CacheUtil');

/**
 * 系统参数开关缓存类
 */
class SetUpCache extends BaseCache{

    constructor(){
        super();
        this.expires = 60 * 1000;
    }

    getCacheAboutCMS(){
        let setup = this.getCacheMap('aboutCMS');
        if (!setup) {
            this.setCacheMap('aboutCMS', CGlobal.aboutCMS);
        }
        return this.getCacheMap('aboutCMS');
    }
}

module.exports = new SetUpCache();