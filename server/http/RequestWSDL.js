/**
 * Created by CC on 2017/10/21.
 */
'use strict';
console.log('require RequestWSDL');

let soap = require('soap');

function RequestWsdl(path) {
    if(typeof path !== 'string')throw new TypeError('The path is not a string');
    this._path = path;
}

RequestWsdl.prototype.getWsdlClient = function (options, cb) {
    soap.createClient(this._path, options, cb);
};

module.exports = RequestWsdl;

/**
 * 请求wsdl的时候如果是url,会访问服务器2次,一次是通过url获取wsdl的xml去解析,
 * 然后再用client去调方法,如果不是url,那么解析文本直接变成client调方法
 *
 * 如果url是https的,那么要加参数
 * let options = {
 *  wsdl_options:{
 *      strictSSL: false
 *   }
 * };
 * wsdlObject.getWsdlClient(options, cb)
 * 调用client的时候也要加参数
 * client.Myfunction(args, {strictSSL: false}, cb)
 */

//测试
// require('../public/globalServer');
// let wsdl = new RequestWsdl('https://cc:3001/cmsService?wsdl');
// let wsdl = new RequestWsdl('http://cc:3000/cmsService?wsdl');
// let wsdl = new RequestWsdl(__dirname+'/wsdl/cmsService.wsdl');
// let options = {
//     wsdl_options:{
//         strictSSL: false
//     }
// };
// wsdl.getWsdlClient(options, function (e, client) {
//     if(e)return console.log(e);
//     let args = {
//         auth:{
//             key:'6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
//             id:'IFC',
//             shopid:'1'
//         },
//         configKey:'mail_pws',
//         groupName:'mailConfig'
//     };
//     if(client){
//         client.getSystemConfig(args, {strictSSL: false}, function (e, result) {
//             if(e)console.log(e);
//             if(result){
//                 console.log(result);
//             }
//         });
//     }
// });
