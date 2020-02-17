/**
 * Created by CC on 2017/5/6.
 */
'use strict';
console.log('require AboutCmsService');
const Utils = require('../util/Utils');
const setUpCache = require('../util/cache/SetUpCache');

const AboutCmsService = {
    aboutCms(req, res) {
        /**
         * 测试缓存类是否有效
         */
        let setup = setUpCache.getCacheAboutCMS();
        return res.send(CGlobal.extend({code: 1}, setup));
    },
    gotoIndex(req, res) {
        return res.render('index');
    },
    testLang(req, res) {
        /**
         * 测试语言类型是否能全局初始化,发现不可以,放弃
         */
        console.log(req.lang)
        if (req.lang === 'EN') {
            setTimeout(() => {
                return res.send({lang: req.lang, code: 1});
            }, 1000)
        } else {
            process.nextTick(()=>{
                return res.send({lang: req.lang, code: 1});
            })
        }
    },
    getAppVersion(req, res) {
        return res.send({code: 1, version: Utils.readConfig('version')})
    }
};

module.exports = AboutCmsService;
