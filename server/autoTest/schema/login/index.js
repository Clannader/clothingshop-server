/**
 * Create by CC on 2018/11/29
 */
'use strict';
let Utils = require('../../../util/Utils');
module.exports = [
    {
        name: 'Login',
        path: '/api/user/login',
        method: 'post',
        params: {
            adminId: 'SUPERVISOR',
            adminPws: Utils.sha256('s')
        },
        out: {
            value: 1
        }
    },
    {
        name: 'Logout',
        path: '/api/user/logout',
        method: 'post',
        headers: {
            //以$开头说明获取某个请求的数据
            'credential': '$Login.credential'
        },
        out: {
            value: 1,
            print: true//打印结果
        }
    }
];