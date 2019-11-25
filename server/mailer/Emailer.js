/**
 * Created by CC on 2017/10/24.
 */
'use strict';
console.log('require Emailer');
let nodemailer = require('nodemailer');
let Utils = require('../util/Utils');

function Emailer(opt) {
    opt = opt || {};
    let options = {
        host: opt.host || Utils.readConfig('mail_host'),
        secureConnection: opt.secureConnection || true,
        port: opt.port || Utils.readConfig('mail_port'),
        auth: {
            user: opt.user || Utils.readConfig('mail_user'),
            pass: opt.pass || Utils.readConfig('mail_pws')
        },
        logger: opt.logger || false
    };
    // secure:true for port 465, secure:false for port 587
    options.secure = options.port === 465;

    this.options = options;
    this.mailer = nodemailer.createTransport(options);
}

Emailer.prototype.close = function () {
    this.mailer.close();
};

Emailer.prototype.sendMail = function (opt, cb) {
    let mailOptions = {
        from: this.options.auth.user, // 发送者
        to: opt.to, // 接受者,可以同时发送多个,以逗号隔开,数组
        subject: opt.subject, // 标题
        text: opt.text, // 纯文本,如果没有html代码就是以纯文本的内容为准,如果有html代码就以html代码为准
        html: opt.html // html代码
    };
    //发送附件的节点
    if (opt.attachments) {
        /**
         * 格式
         *  [{filename:'test.txt',path:'../test.txt'}
         *  ,{filename:'test.txt',content:'xxxxx'//发送内容}]
         */
        mailOptions.attachments = opt.attachments;
    }
    this.mailer.sendMail(mailOptions, cb);
};

module.exports = Emailer;

//例子
// let mailer = new Emailer();
//
// mailer.sendMail({
//     to: '294473343@qq.com',
//     subject: '测试邮件',
//     text: 'hahha1',
//     html: 'dadsda1'
// },function (err,result) {
//     if(err)console.log(err);
//     if(result)console.log(result);
//     mailer.close();
// })