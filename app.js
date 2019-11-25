'use strict';
/**
 * 项目启动类
 */
//app启动时首先加载全局的js
require('./server/public/globalServer');
var Utils = require('./server/util/Utils');
if(Utils.readConfig('clusterServer') === 'true'){
    //启动集群服务
    require('./cluster_multiple');
}else {
    //启动单台服务
    require('./cluster_single');
}
