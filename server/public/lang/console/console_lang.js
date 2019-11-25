/**
 * Created by CC on 2017/5/16.
 * 控制台翻译
 */
'use strict';
console.log('require console_lang');
let language={
    //Examples:key:[value1,value2,...]
    //log翻译
    '注册 {0} 实体成功':['注册 {0} 实体成功'
        ,'Register {0} Entity is successful'],
    '注册 {0} 实体失败\n失败原因:{1}':['注册 {0} 实体失败\n失败原因:{1}'
        ,'Registration {0} entity failed \n failed reason: {1}'],
    'ServerID {0} 请求:{1}':['ServerID {0} 请求:{1}','ServerID {0} request: {1}'],
    '错误LOG:请求路径为 {0} 的网页找不到,发生404错误':['错误LOG:请求路径为 {0} 的网页找不到,发生404错误'
        ,'Error LOG: Requested path for {0} page not found, 404 error occurred'],
    '错误LOG:请求服务器 {0} 错误':['错误LOG:请求服务器 {0} 错误'
        ,'Error LOG: request server {0} error'],
    'clothingshop:server HTTP启动成功,{0} IP地址为:{1}':['clothingshop:server HTTP启动成功,{0} IP地址为:{1}'
        ,'Clothingshop: server HTTP started successfully, {0} IP address: {1}'],
    'clothingshop:server HTTPS启动成功,{0} IP地址为:{1}':['clothingshop:server HTTPS启动成功,{0} IP地址为:{1}'
        ,'Clothingshop: server HTTPS started successfully, {0} IP address: {1}'],
    '获取索引失败:原因{0}':['获取索引失败:原因{0}','Get index failed: Reason {0}'],
    '{0} 创建{1} 索引失败':['{0} 创建{1} 索引失败','{0} created {1} index failed'],
    '{0} 创建{1} 索引失败原因:{2}':['{0} 创建{1} 索引失败原因:{2}','{0} created {1} index failed:Reason{2}'],
    '{0} 创建{1} 索引成功':['{0} 创建{1} 索引成功','{0} Create {1} index successful'],
    '索引创建完毕':['索引创建完毕','Create Index is completed'],
    '测试服务未开启':['测试服务未开启',''],
};

module.exports=language;