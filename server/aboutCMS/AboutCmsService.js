/**
 * Created by CC on 2017/5/6.
 */
'use strict';
console.log('require AboutCmsService');
const Utils = require('../util/Utils');
const setUpCache = require('../util/cache/SetUpCache');

const AboutCmsService = {
    aboutCms(req, res) {
        let setup = setUpCache.getCacheAboutCMS();
        return res.send(CGlobal.extend({code: 1}, setup));
    },
    gotoIndex(req, res) {
        return res.render('index');
    },
    testLang(req, res) {
        let type = req.params.type;
        // let _type = type;
        // Utils.type = type;
        CGlobal.GlobalLangType = type
        // process.nextTick()
        if (type === 'EN') {
            setTimeout(() => {
                return res.send({lang: CGlobal.GlobalLangType, code: 1});
            }, 1000)
        } else {
            process.nextTick(()=>{
                return res.send({lang: CGlobal.GlobalLangType, code: 1});
            })
        }
    }
};

module.exports = AboutCmsService;