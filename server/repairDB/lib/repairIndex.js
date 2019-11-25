/**
 * Created by CC on 2017/4/23.
 * 当使用一个新库的时候,有些索引必须要有的,每次重新服务器都要检测某些表的索引是否存在
 * 比如在上次启动时被人为删除了,下一次重启要直接修复,否则出问题
 * 但是有些索引是可有可无的,那么就不用修复
 */
'use strict';
//加打印log,看加载时的顺序
console.log('require repairIndex');

let async = require('async');
let db = require('../../dao/daoConnection');
let mustIndex = require('../../public/data/dataPool').mustIndex;

let errArray = [];
//创建必要表的索引
async.eachSeries(mustIndex, function (item, cb) {
    let entity = db.getCollection(item.dbname);
    //这里要判断是否存在索引,因为考虑到当数据量大的时候再次创建重复的索引会很耗时.
    //得到表的索引
    entity.getIndexes(function (err, getIndex) {
        //这里有错为什么不回调,原因是获取索引失败不一定不能创建索引
        if(err)console.error(CGlobal.logLang('获取索引失败:原因{0}',err.message));
        //这里返回的错误只有出现不存在这个表时进行创建索引,或者有这个表的存在没有这个索引。
        //判断表是否存在这个索引,有就就不创建
        //这个判断还是有个BUG 的,如果比较1,2,3 和 3,1,2 就会返回false
        //删除默认的_id索引
        if(!getIndex)return cb();
        delete getIndex._id_;
        //没有BUG了
        if(compareIndex(getIndex,getCustomIndex(item))){
            return cb();
        }
        entity.createIndex(item.fields, item.option, function (err, indexResult) {
            if (err){
                console.log(CGlobal.logLang('{0} 创建{1} 索引失败'
                    , item.dbname, JSON.stringify(item.fields)));
                errArray.push(CGlobal.logLang('{0} 创建{1} 索引失败原因:{2}',item.dbname
                    ,JSON.stringify(item.fields),err.message));
                return cb();
            }
            //创建索引成功
            // console.log(indexResult);//返回的是创建的索引字段还是索引名?
            console.log(CGlobal.logLang('{0} 创建{1} 索引成功'
                , item.dbname, JSON.stringify(item.fields)));
            cb();
        });
    });
}, function () {
    //这里的回调只有err,没有结果的
    if(errArray.length !== 0){
        console.log(errArray.join('\r\n'));
    }else{
        console.log(CGlobal.logLang('索引创建完毕'));
    }
});

//比较是否存在该索引
function compareIndex(dbIndex,customIndex) {
    let keyCustomIndex = Object.getOwnPropertyNames(customIndex)[0];
    if(!dbIndex[keyCustomIndex]){
        return false;
    }
    let index = {};
    index[keyCustomIndex] = _arrayToJson(dbIndex[keyCustomIndex]);
    if(!CGlobal.compareObjects(customIndex,index)){
        return false;
    }
    return true;
}

//得到自定义索引
function getCustomIndex(item) {
    let temp = {};
    //版本1
    // let arr = [];
    // CGlobal.forEach(item.fields,function (k,v) {
    //     let copy = [];
    //     copy.push(k);
    //     copy.push(v);
    //     arr.push(copy);
    // });
    // temp[item.option.name] = arr;
    //版本2
    temp[item.option.name] = item.fields;
    return temp;
}

//把[[key,value],[key,value]]==>{key:value,key:value}
function _arrayToJson(arr) {
    //判断它是否是Array
    if (!Array.isArray(arr))return arr;
    let obj = {};
    CGlobal.forEach(arr, function (i, value) {
        obj[value[0]] = value[1];
    });
    return obj;
}

/**
 * 是否存在该索引
 * @param index 索引 { _id_: [ [ '_id', 1 ] ], userId: [ [ 'userId', 1 ] ] }
 * @param fields 索引字段 {userId:1}
 */
function _hasIndex(index, fields) {
    let flag = false;
    CGlobal.forEach(index, function (key, value) {
        if (JSON.stringify(fields) === JSON.stringify(_arrayToJson(value))) {
            flag = true;
        }
    });
    return flag;
}
