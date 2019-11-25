/**
 * Create by CC on 2019/3/24
 */
'use strict';


//测试
// require('../public/globalServer');
// let url = 'https://cc:3001/cmsService';
// let soap = new HttpSoap(url);

// let body = soap.parseElement(null, {
//     auth:{
//         key:'6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
//         id:'IFC1',
//         shopid:'1'
//     },
//     configKey:'mail_pws',
//     groupName:'mailConfig'
// });
// let params = {
//     getSystemConfig: body
// };
// soap.post(params, function (err, result) {
//     // if(err)console.log(err);
//     if(result)console.log(result);
// }, 'tns');

// soap.setSoapHeaders('q', {
//     a1: {
//       _:'11'
//     },
//     a2: {
//         attr: {
//             id: '2'
//         },
//         value: 'a2'
//     },
//     a3: {
//         attr: {
//             id: '3'
//         },
//         b1: 'b1',
//         b2: {
//             attr: {
//                 id: '4'
//             },
//             value: 'b2'
//         }
//     },
//     a4: [{
//         attr: {
//             id:'ds'
//         }
//     }, '22',{
//         value:'33',
//         attr:{
//             id:'ww'
//         }
//     }]
// });

// let k = {
//     'a5':{
//         _:'a5'
//     }
// }
// soap.setSoapHeaders(null, soap.parseElement('e', k))
// console.log(soap._getXML());