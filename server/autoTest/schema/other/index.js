/**
 * Create by CC on 2018/11/24
 */
'use strict';

module.exports = [
    {
        name: '测试404地址',//测试案例名
        path: '/test/404',//测试的路径
        method: 'get',//测试的方法
        out: {
            key: 'code',//返回结果取的节点名
            value: 404//返回的期望值
        }
    },
    {
        name: '测试登录',
        path: '/api/user/login',
        method: 'get',
        out: {
            key: 'code',
            value: 404
        }
    },
    {
        name: '测试登录2',
        path: '/api/user/login',
        method: 'post',
        out: {
            value: 0,
            print: true//打印结果
        }
    },
    {
        name: '测试退出',
        path: '/api/user/logout',
        method: 'post',
        out: {
            value: 901,
            print: true//打印结果
        }
    },
    {
        name: '测试登录3',
        path: '/api/user/login',
        method: 'post',
        params: {
            adminId: 'SUPERVISOR',
            adminPws: 'a'
        },
        out: {
            value: 0,
            print: true//打印结果
        }
    },
    {
        name: '测试api404',
        path: '/api/config/test',
        method: 'post',
        out: {
            value: 901,
            print: true//打印结果
        }
    }
];