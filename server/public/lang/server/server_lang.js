/**
 * Created by CC on 2017/3/13.
 * 服务器端翻译语言函数
 */
'use strict';
/**
 * 翻译内容是一个数组,第一个下标是中文,第二个是英文,如果有其他语言往数组后面加即可
 */
console.log('require server_lang');
let language={
    //公共的
    '主页':['主页','Home'],
    '新建':['新建','New'],
    '删除':['删除','Delete'],
    '编辑':['编辑','Edit'],
    '查询':['查询','Search'],
    '关闭':['关闭','Close'],

    //Examples:key:[value1,value2,...]
    //admin_login.html
    '衣购商城后台--登录':['衣购商城后台--登录','Clothing shop backstage -- Login'],
    '登录':['登录','Login'],
    '衣购商城管理系统':['衣购商城管理系统','Clothing Shop MS'],
    '用户名':['用户名','User'],
    '密码':['密码','Password'],
    '用户ID,邮箱地址':['用户ID,邮箱地址','UserId,Email...'],
    '语言':['语言','Language'],
    '登{0}录':['登{0}录','Login'],
    '记住用户名':['记住用户名','Remember Me'],
    '忘记密码':['忘记密码','I forgot my password'],

    //权限翻译
    '订单权限':['订单权限','Order Rights'],
    '权限组名_h':['权限组名','Group Name'],
    '权限代码':['权限代码','Rights Code'],
    '描述':['描述','Description'],

    //AdminService.js
    '用户未激活':['用户未激活','Invalid user status'],
    '用户名或密码错误':['用户名或密码错误','Invalid username or password'],
    '请输入用户名':['请输入用户名','Please input username'],
    '用户名含有非法字符':['用户名含有非法字符','The user name contains illegal characters'],
    '您已登录,请勿再次登录':['您已登录,请勿再次登录','You are logged in, do not login again'],
    '第三方用户不能登录系统':['第三方用户不能登录系统','Interface users can not login into the system'],
    '不支持 {0} 请求方式':['不支持 {0} 请求方式','Does not support {0} request mode'],

    //admin_index.html
    '衣购商城后台--管理':['衣购商城后台--管理','Clothing shop backstage -- Management'],
    '工作室':['工作室','Studio'],
    '版权所有':['版权所有','All rights reserved.'],
    '版本':['版本','Version'],
    '退出':['退出','Log Out'],

    //navbar
    '前台管理':['前台管理','Front'],
    '服装管理':['服装管理','Clothing'],
    '分类管理':['分类管理','Category'],
    '店铺管理':['店铺管理','Shop'],
    '日志管理_h':['日志管理','Logs'],
    '操作日志':['操作日志','User'],
    '访问日志':['访问日志','User Access'],
    '服务器日志_h':['服务器日志','Server'],
    '其他设置':['其他设置','Setting'],
    '供应商设置':['供应商设置','Supplier'],
    '用户设置':['用户设置','User'],
    '权限设置':['权限设置','Rights group'],
    '系统数据设置':['系统数据设置','System data'],
    '修复数据':['修复数据','Repair data'],
    '数据统计':['数据统计','Data statistics'],
    '订单统计':['订单统计','Order'],
    '收益统计':['收益统计','Income'],
    '个人信息':['个人信息','Profile'],
    '修改密码':['修改密码','Modify Password'],

    //rights_service
    '无效的id值':['无效的id值','Invalid id value'],
    '权限组已不存在':['权限组已不存在','Permissions group no longer exists'],
    '删除成功':['删除成功','Successfully deleted'],
    '删除失败':['删除失败','Failed to delete'],
    '请输入权限组名':['请输入权限组名','Please enter the permission group name'],
    '组名含有特殊字符':['组名含有特殊字符','Group name contains special characters'],
    '请输入权限代码':['请输入权限代码','Please enter the permission code'],
    '组名已存在':['组名已存在','The group name already exists'],
    '创建成功':['创建成功','Created successfully'],
    '修改成功':['修改成功','Successfully modified'],
    '删除 {0} 权限组':['删除 {0} 权限组','Delete the {0} permissions group'],

    //User
    '新建用户':['新建用户','New User'],
    '编辑{0}用户':['编辑{0}用户','Edit {0} user'],
    '该用户不存在!':['该用户不存在!','The user does not exist!'],
    '{0}不存在':['{0}不存在','{0} does not exist'],
    '{0}已存在':['{0}已存在','{0} already exists'],
    '查询结果':['查询结果','The query results'],
    '后退':['后退','Back'],
    '皮肤':['皮肤','The skin'],
    '全部':['全部','ALL'],
    '激活':['激活','Activate'],
    '未激活':['未激活','Inactivate'],
    '系统用户':['系统用户','Administrator'],
    '普通用户':['普通用户','Normal User'],
    '接口用户':['接口用户','IFC User'],
    '用户ID,用户名,商店ID,邮箱地址...':['用户ID,用户名,商店ID,邮箱地址...'
        ,'UserId,Username,ShopId,Email...'],
    '保存':['保存','Save'],
    '保存&关闭':['保存&关闭','Save&Close'],

    '店铺不存在':['店铺不存在','The shop does not exist'],
    '店铺ID':['店铺ID','Shop ID'],
    '用户ID':['用户ID','User ID'],
    '用户名_h':['用户名','User Name'],
    '用户类型':['用户类型','User Type'],
    '权限':['权限','Rights'],
    '邮箱地址':['邮箱地址','Email'],
    '用户状态':['用户状态','User Status'],
    '集团代码':['集团代码','SupplierCode'],
    '主导航':['主导航','MAIN NAVIGATION'],
    '日志管理':['日志管理','Logs Management'],
    '用户日志':['用户日志','User Logs'],
    '用户访问日志':['用户访问日志','User Access Logs'],
    '服务器日志':['服务器日志','Server Logs'],
    '抱歉,你没有权限访问!':['抱歉,你没有权限访问!','Sorry, you do not have permission to access!'],

    '订单管理':['订单管理','Order'],
    '用户操作日志':['用户操作日志','User Logs'],
    '创建 {0} 权限组':['创建 {0} 权限组','Create the {0} permission group'],
    '权限组名':['权限组名','Group Name'],
    '权限组描述':['权限组描述','Description'],
    '权限组代码':['权限组代码','Rights Code'],
    '编辑 {0} 权限组:':['编辑 {0} 权限组:','Edit {0} permission group:'],
    '删除失败:{0}个':['删除失败:{0}个','Delete failed: {0}'],
    '失败原因:{0}{1}':['失败原因:{0}{1}','Failure reason:{0}{1}'],
    '成功删除:{0}个':['成功删除:{0}个','Successfully deleted: {0}'],
    '查询错误!-->错误代码:{0}':['查询错误!-->错误代码:{0}','Query error!-->Error code:{0}'],

    '敏捷工作':['敏捷工作','Agile board'],
    '便利贴':['便利贴','Pin Board'],
    '杂项':['杂项','Miscellaneous'],
    '请求地址':['请求地址','Request address'],
    ' 哎呀！找不到网页。':[' 哎呀！找不到网页。',' Oops! Page not found.'],
    '对不起，我们无法找到您正在寻找的页面。':['对不起，我们无法找到您正在寻找的页面。','Sorry,we could not find the page you were looking for. '],
    '尝试检查网址是否存在错误。同时，你可以返回':['尝试检查网址是否存在错误。同时，你可以返回','Try checking the URL for error.Meanwhile, you may return to '],
    '页面。':['页面。',' page.'],
    '登录_4':['登录','login'],
    '确定':['确定','Ok'],
    '取消':['取消','Cancel'],
    '请输入{0}':['请输入{0}','Please enter the {0}'],
    '无效的凭证':['无效的凭证','Invalid credential'],
    '请求 {0} 地址不存在':['请求 {0} 地址不存在', 'The url {0} is not found.']
};

module.exports=language;
