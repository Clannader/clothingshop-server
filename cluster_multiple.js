/**
 * Created by CC on 2017/7/8.
 * 集群启动服务,根据cpu个数启动几个服务器
 */
'use strict';
const cluster = require('cluster');
let numCPUs = require('os').cpus().length;
const Utils = require('./server/util/Utils');
// const setUpCache = require('./server/util/cache/SetUpCache');

if (cluster.isMaster) {
    console.log('Master Pid:%s is running', process.pid);
    if (!isNaN(Utils.readConfig('threadNum'))) {
        numCPUs = Utils.readConfig('threadNum');
    }

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
        // 做数据同步感觉不太可能,还是放弃吧
        // 主要原因是:虽然多个进程都是取的是master的内存,并不知道怎么取master的内存值
        // 通过process.send({cmd:'aboutCMS',vauel:{}}),在子进程中发消息给主进程
        // 改变了主进程的内存,但是取值的时候还是取的是子进程,并没有改变子进程的内存
        // 并且又不知道怎么取主进程的内存值
        // const worker = cluster.fork();
        // worker.on('message', function(msg) {
        //     if (msg.cmd && msg.cmd == 'aboutCMS') {
        //         setUpCache.setCacheSetUp('aboutCMS', msg.value);
        //     }
        // });
    }

    cluster.on('exit', function (worker, code) {//worker, code, signal
        //之所以打印2次监听是因为开启了http和https服务导致的
        console.log('Sub-thread-worker ID:%s exit, processID : %s', worker.id, worker.process.pid);
        console.log('Sub-thread-code Code:%s', code);
    });

    // 这里以后要研究一下cluster怎么用才得
    cluster.on('listening', function (worker) {//worker, address
        console.log('Sub-thread-worker ID:%s listening, processID : %s', worker.id, worker.process.pid);
    });

    // 主进程接收消息
    // cluster.on('message', function (worker, message) {
    // });

    //研究cluster是否可以获取每个进程的请求数
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    require('./cluster_single');
    console.log('Sub-thread-worker %s started,processID: %s', cluster.worker.id, cluster.worker.process.pid);
}
