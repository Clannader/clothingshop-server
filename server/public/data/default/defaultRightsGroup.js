/**
 * Create by CC on 2018/10/24
 */
'use strict';
let allRights = [];
let Rights = CGlobal.Rights;
CGlobal.forEach(Rights, function (i, v) {
    allRights.push(v.code);
});

module.exports = [
    {
        groupName: 'SUPERVISOR',
        desc: '系统权限组',
        rightsCode: allRights.join(',')
    },
    {
        groupName: 'UserManager',
        desc: '用户操作最高权限',
        rightsCode: [Rights.OtherSetup.code,Rights.UserSetup.code
            ,Rights.CreateIFCUser.code,Rights.CreateSYSUser.code,Rights.ChangeUserPws.code
            ,Rights.DeleteSYSUser.code,Rights.ChangeUserStatus.code].join(',')
    }
];