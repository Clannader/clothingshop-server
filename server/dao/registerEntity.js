/**
 * Created by CC on 2017/12/17.
 */
'use strict'
// let fs = require('fs');
// function registerEntity(path) {
//     let dirs = fs.readdirSync(path, 'UTF-8');
//     for (let i = 0; i < dirs.length; i++) {
//         let dir = dirs[i];
//         let currentPath = path + '/' + dir;//当前路径
//         let file = fs.lstatSync(currentPath);
//         if (file.isDirectory()) {
//             //如果是文件夹,递归
//             registerEntity(currentPath);
//         } else {
//             // let dirName = dir.substring(0, dir.lastIndexOf('.'));//获取文件名
//             // try {
//             //     let entity = require(currentPath);//如果报错就是这一步加载实体报错
//             //     let schema = new mongoose.Schema(entity.schemas);
//             //     db.model(dirName, schema, entity.rename);
//             //     console.log(CGlobal.logLang('注册 {0} 实体成功', dirName));
//             // } catch (e) {
//             //     console.error(CGlobal.logLang('注册 {0} 实体失败\n失败原因:{1}', dirName, e.message));
//             // }
//             require(currentPath);
//         }
//     }
// }

// registerEntity(process.env.ENTITY_PATH + 'entity');


/**
 * 更换webpack打包不能按照上面这样写了
 */
require('../entity/super/Admin')
require('../entity/super/AdminAccess')
require('../entity/super/AdminLog')
require('../entity/system/Sequence')
require('../entity/system/SystemConfig')
require('../entity/Cart')
require('../entity/Clothes')
require('../entity/Order')
require('../entity/Rights')
require('../entity/Shop')
require('../entity/Supplier')
require('../entity/Test')
