/**
 * Created by CC on 2017/3/14.
 * 全局的静态变量
 */
'use strict';
console.log('require globalVariable');
let staticVal = {
    //日期格式化格式
    dateSdf: 'YYYY-MM-DD HH:mm:ss',
    //语言类型
    CN: 'CN',
    EN: 'EN',
    //Session过期时间,这里的过期时间要重新定义,不是自己定义的session过期时间,而是Mongodb Session过期时间
    dbSession_Expires: 60 * 60,//1小时,单位秒,其实现在这个就是session失效的时间
    Session_Expires: 60 * 60 * 1000,//1小时,单位毫秒
    Active_Expires: 10 * 60 * 1000,//用户活跃时间
    Cookie_Expires: 7 * 24 * 60 * 60 * 1000,//7天
    Cache_Expires: 10 * 60 * 1000,//缓存失效时间
    //Supervisor权限
    Supervisor_Rights: 'SUPERVISOR',
    User_Type: {
        SYSTEM: 'SYSTEM',
        NORMAL: 'NORMAL',
        THIRD: '3RD'
    },
    Log_Type: {
        Right: 'Right',
        CONFIG: 'SystemConfig',
        BROWSER: 'Browser',
        INTERFACE: 'Interface',
        WSDL: 'Wsdl',
        SERVER_LOG: 'ServerLog',
        USER: 'User'
    },
    userNameExp: /^[\w\u4e00-\u9fa5\@\.]+$/,
    mailExp: /^[\w\.\-]+@[\w]+((\.[\w]{2,3}){1,2})$/,
    nameExp: /^[\w\u4e00-\u9fa5]+$/,
    codeExp: /^[\w]+$/,
    rightsExp: /^(\-?([1-9]{1}\d{3}|[A-Za-z]{2,15}),)*(?=(\-?([1-9]{1}\d{3}|[A-Za-z]{2,15}))$)/,//^(\d+,?)*(?=\d$)
    ipExp: /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/,
    sessionName: 'cmsApp',
    sessionSecret: '123456cms',
    interfaceHeader: 'CMS-Interface',
    sequenceType: ['MESSAGE','ROOMNO'],
    baseUrl: '/index'
};
module.exports = staticVal;