/**
 * Created by CC on 2017/6/26.
 * 缓存类
 */
'use strict';
console.log('require CacheUtil');
const map = Symbol('map');
const originalMap = Symbol('originalMap');
class CacheUtil {

    constructor() {
        this[map] = new Map();//在原本的值添加节点
        this[originalMap] = new Map();//保存原本的值
        this.expires = CGlobal.GlobalStatic.Cache_Expires;
    }

    getCacheMap(key) {
        let temp = this[map].get(key);
        let originalTemp = this[originalMap].get(key);
        if (temp) {
            //如果缓存有
            let current = new Date().getTime();
            if (current - temp['_cacheTime'] <= this.expires) {
                //在有效期内
                return originalTemp;
            }
            //失效的缓存,删除,并重新验证
            this[map].delete(key);
            this[originalMap].delete(key);
            console.log('类名:%s Key值:[%s] 缓存失效', this.constructor.name, key);
            originalTemp = null;
        }
        return originalTemp;
    }

    /**
     * 设置内存
     * @param key 可以是字符串也可以是数字
     * @param value 必须是json结构
     */
    setCacheMap(key, value = {}) {
        if (CGlobal.isEmpty(key)) {
            throw new TypeError('key必须有值');
        }
        if (!CGlobal.isPlainObject(value)) {
            value = {};
        }
        //刷新时间
        let _value = CGlobal.extend({_cacheTime: new Date().getTime()}, value);
        this[map].set(key, _value);
        this[originalMap].set(key, value);
    }

    visitorMap() {
        return this[map];
    }
}


module.exports = CacheUtil;