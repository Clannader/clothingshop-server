/**
 * Create by CC on 2018/11/10
 * 服务器打包工具
 */
'use strict';
require('./server/public/globalServer');
var Utils = require('./server/util/Utils');
var currentVersion = Utils.readConfig('version');//当前版本
var newVersion = Utils.changeVersion(currentVersion);
var packagePath = Utils.readConfig('packagePath');//打包路径
var packageName = Utils.readConfig('packageName');
var packageSuffix = Utils.readConfig('packageSuffix');//压缩后缀
if (!packagePath) {
    packagePath = __dirname + '\\dist\\';
}
if (!packagePath.endsWith('\\') && !packagePath.endsWith('//')) {
    packagePath += '\\';
}
packagePath += CGlobal.replaceArgs(packageName+'-{0}.{1}', newVersion, packageSuffix);
packagePath = Utils.escapePath(packagePath);

Utils.writeConfig('version', newVersion);//先写新版本,不然打包出来的版本不是新的
var fs = require('fs');
var archiver = require('archiver');
var outStream = fs.createWriteStream(packagePath);
var zlib = archiver('zip',{
    zlib: { level: 9 }
});

// 监听要压缩的所有文件数据
outStream.on('close', function() {
    console.log(CGlobal.replaceArgs('总共 {0} 字节', zlib.pointer()));
    console.log('打包进程关闭');
});

outStream.on('end', function() {
    console.log('打包完成');
});

zlib.on('warning', function(err) {
    if (err.code === 'ENOENT') {
        console.warn(err.message);
    } else {
        throw err;
    }
});

zlib.on('error', function(err) {
    Utils.writeConfig('version', currentVersion);//报错回退版本
    throw err;
});

zlib.pipe(outStream);

zlib.directory('certs/', 'certs');
zlib.directory('config/', 'config');
// zlib.directory('public/', 'public');
zlib.directory('server/', 'server');
// zlib.directory('views/', 'views');
// zlib.directory('apiTest/', 'apiTest');
zlib.file('app.js', { name: 'app.js' });
zlib.file('app.bat', { name: 'app.bat' });
zlib.file('cluster_multiple.js', { name: 'cluster_multiple.js' });
zlib.file('cluster_single.js', { name: 'cluster_single.js' });
zlib.file('package.json', { name: 'package.json' });
// zlib.file('package-lock.json', { name: 'package-lock.json' });
zlib.file('README.md', { name: 'README.md' });
zlib.file('server-package.js', { name: 'server-package.js' });
zlib.file('npm-update.bat', { name: 'npm-update.bat' });
zlib.file('.babelrc', { name: '.babelrc' });

zlib.finalize();
