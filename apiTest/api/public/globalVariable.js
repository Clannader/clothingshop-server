/**
 * Created by CC on 2017/3/14.
 * 全局的静态变量
 */
'use strict';
console.log('require globalVariable');
let staticVal = {
    //日期格式化格式
    dateSdf: 'YYYY-MM-DD HH:mm:ss',
    userNameExp: /^[\w\u4e00-\u9fa5\@\.]+$/,
    mailExp: /^[\w\.\-]+@[\w]+((\.[\w]{2,3}){1,2})$/,
    nameExp: /^[\w\u4e00-\u9fa5]+$/,
    codeExp: /^[\w]+$/,
    rightsExp: /^(\-?([1-9]{1}\d{3}|[A-Za-z]{2,15}),)*(?=(\-?([1-9]{1}\d{3}|[A-Za-z]{2,15}))$)/,//^(\d+,?)*(?=\d$)
    ipExp: /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/,
    ApiCode: {
        Success: 1,
        Error: 0,
        NotFound: 404,
        Invalid: 901, // 无效的凭证
        Expired: 902 // 凭证过期
    }
};
module.exports = staticVal;
