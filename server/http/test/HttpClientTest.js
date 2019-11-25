/**
 * Create by CC on 2019/3/24
 */
'use strict';

//测试
//问题1:这里如果做到链式编程,最后在做回调函数?和mongoose的用法类似?
// require('../public/globalServer');
// let url = 'https://cc:3001/cms/ifc/api/sequence/getid';
// let header = {
//     Id:'IFC1',
//     Key:'6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
//     shopid:'1',
//     'CMS-Interface':'CMS-Interface'
// };
// let client = new HttpClient(url, header);
// let params = {
//     groupName:'mailConfig'
// };
// client.addParams({type:'MESSAGE'}).addParams({'age':20}).get(params, function (err, result) {
//     if(err)console.log(err);
//     if(result)console.log(result.data);
// });
// client.addParams({type:'MESSAGE'}).addParams({'age':20}).get(params, function (err, result) {
//     if(err)console.log(err);
//     if(result)console.log(result.data);
// });

// let url = 'http://localhost:8000/cms/api/config/query';
// let url = 'https://localhost:3001/cms/ifc/api/config/query';
// let header = {
//     'api-Id':'IFC',
//     'api-Key':'6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
//     'api-shopid':'1',
//     'api-CMS-Interface':'CMS-Interface'
// };
// let client = new HttpClient(url, header);
// let params = {
//     key:'mailConfig'
// };
// client.post(params, function (err, result) {
//     if(err)console.log(err);
//     if(result)console.log(result.data);
// });
require('../../public/globalServer');
let HttpClient = require('../HttpClient')
let url = 'https://cc:3001/cms/h5/api/sdsad';
let header = {
    language: 'CN',
    credential: 's:UtaYPjOnEHkRnCWgREcbp0alA1vYgUzJ.hF2ckIo1DfRi7Hb5d/23Y7/+TuwrEiyPOS+tmjpQZNM'
};
let client = new HttpClient(url, header);
let params = {
};
client.post(params, function (err, result) {
    if (err) console.log(err);
    if (result) console.log(result);
});