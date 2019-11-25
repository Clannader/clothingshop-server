/**
 * Created by CC on 2017/3/25.
 */
'use strict';
console.log('require Rights');
let Rights = {
    FrontdeskManager: {
        code: '1000',
        desc: '前台管理',
        scope:'ALL'
    },
    ShopInfo: {
        code: '1001',
        desc: '店铺信息',
        scope:'ALL'
    },
    CategoryManager: {
        code: '1002',
        desc: '分类管理',
        scope:'ALL'
    },
    ClothesManager: {
        code: '1003',
        desc: '服装管理',
        scope:'ALL'
    },
    OrderManager: {
        code: '1004',
        desc: '订单管理',
        scope:'ALL'
    },
    LogsManager: {
        code: '2000',
        desc: '日志管理',
        scope:'ALL'
    },
    UserLogs:{
        code: '2001',
        desc: '用户日志',
        scope:'ALL'
    },
    ServerLogs:{
        code: '2002',
        desc: '服务器日志',
        scope:'ALL'
    },
    MailLogs:{
        code: '2003',
        desc: '邮件日志',
        scope:'ALL'
    },
    OtherSetup: {
        code: '3000',
        desc: '其他设置',
        scope: 'ALL'//权限允许的范围
    },
    SupplierSetup: {
        code: '3001',
        desc: '集团设置',
        scope: 'ALL'//权限允许的范围
    },
    ShopSetup: {
        code: '3002',
        desc: '店铺设置',
        scope:'ALL'
    },
    UserSetup: {
        code: '3003',
        desc: '用户设置',
        scope: 'ALL'//权限允许的范围
    },
    RightsSetup: {
        code: '3004',
        desc: '权限设置',
        scope: 'ALL'//权限允许的范围
    },
    SystemSetup: {
        code: '3005',
        desc: '系统数据设置',
        scope: 'ALL'//权限允许的范围
    },
    MailSetup: {
        code: '3006',
        desc: '系统数据设置',
        scope: 'ALL'//权限允许的范围
    },
    RepairData: {
        code: '3007',
        desc: '修复数据',
        scope: 'ALL'//权限允许的范围
    },
    Miscellaneous: {
        code: '4000',
        desc: '杂项设置',
        scope: 'ALL'
    },
    AgileBoard: {
        code: '4001',
        desc: '敏捷看板',
        scope: 'ALL'
    },
    PinBoard: {
        code: '4002',
        desc: '便利贴看板',
        scope: 'ALL'
    },
    StatisticSetup: {
        code: '5000',
        desc: '数据统计模块',
        scope: 'ALL'
    },
    OrderStatistic: {
        code: '5001',
        desc: '店铺订单统计',
        scope: 'ALL'
    },
    IncomeStatistic: {
        code: '5002',
        desc: '店铺收益统计',
        scope: 'ALL'
    },
    UserAccessStatistic: {
        code: '5003',
        desc: '用户访问统计',
        scope: 'ALL'
    },
    InterfaceStatistic: {
        code: '5004',
        desc: '接口调用统计',
        scope: 'ALL'
    },
    SystemMonitor: {
        code: '6000',
        desc: '系统监控',
        scope: 'ALL'
    },
    UserAccessMonitor: {
        code: '6001',
        desc: '用户访问数据监控',
        scope: 'ALL'
    },
    InterfaceMonitor: {
        code: '6002',
        desc: '接口调用监控',
        scope: 'ALL'
    },
    DBMonitor: {
        code: '6003',
        desc: '数据库性能监控',
        scope: 'ALL'
    },
    ChangeUserPws: {
        code: '9000',
        desc: '能否修改用户密码',
        scope: 'ALL'
    },
    CreateIFCUser: {
        code: '9001',
        desc: '能否创建接口用户',
        scope: 'ALL'
    },
    CreateSYSUser: {
        code: '9002',
        desc: '能否创建SYSTEM用户',
        scope: 'ALL'
    },
    DeleteSYSUser: {
        code: '9003',
        desc: '能否删除用户',
        scope: 'ALL'
    },
    ChangeUserStatus: {
        code: '9004',
        desc: '能否修改用户状态',
        scope: 'ALL'
    },
    PrivateCustom: {
        code: '8000',
        desc: '私人定制权限',
        scope: 'Private'
    },
    PrivateNovel: {
        code: '8001',
        desc: '写小说',
        scope: 'Private'
    }
};

module.exports = Rights;