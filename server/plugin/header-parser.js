/**
 * Create by CC on 2018/11/1
 */
'use strict';
let Config = require('../util/Config');
let cookies = require('cookie');

module.exports = function () {
    return function (req, res, next) {
        let credential = req.headers['credential'];
        //这里有点坑爹啊,坑了我2天,由于我写的swagger的httpClient只实例化一次
        //这边的登录会设置cookie,导致那边的client存了一个cookie,并且不知道怎么删除
        //要是以后知道删除就好办了
        //或者不实例化一次
        //存了cookie导致新用户登录会删除上一个用户的信息
        let cookie = req.headers.cookie || '';
        // let cookieJSON = Config.parse(cookie, ';');
        let cookieJSON = cookies.parse(cookie);
        if(credential != null){
            //判断如果是swagger那边过来的,删除cookie
            delete req.cookies[CGlobal.GlobalStatic.sessionName];
            delete cookieJSON[CGlobal.GlobalStatic.sessionName];
            cookieJSON[CGlobal.GlobalStatic.sessionName] = credential;
        }
        req.headers.cookie = Config.stringifyParams(cookieJSON, ';');
        next();
    }
};