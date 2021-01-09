/**
 * Created by CC on 2017/3/10.
 */
'use strict';
console.log('require Config');
let fs = require('fs');
let util = require('util');
let stringify = JSON.stringify;

function Config(filePath, isWatch) {
    /**
     * 对象的方法的优先级,实例化对象的method > this.method > prototype.method
     */
    let map = {};
    let path = filePath;
    let watch = isWatch || false;//是否监控文件变化,如果有变化则重新解析文件

    this.getMap = function () {
        return map;
    };

    this.getPath = function () {
        return path;
    };

    this._initConfig();

    if (watch) {
        this._watchConfig();
    }
}

/**
 * @private
 */
Config.prototype._initConfig = function () {
    let fileStr = fs.readFileSync(this.getPath(), 'utf-8');
    let lineList = this.parse(fileStr);
    //这里每次初始化要把map清空
    clearMap(this.getMap());
    let map = this.getMap();
    CGlobal.forEach(lineList, function (key, value) {
        if (key.trim() !== '' && value.trim() !== '') {
            map[key.trim()] = value.trim();//map的内存地址指向this.getMap()
        }
    });
};

function clearMap(map) {
    CGlobal.forEach(map, function (key) {
        delete map[key];
    });
}

/**
 * @private
 */
Config.prototype._watchConfig = function () {
    let that = this;
    //触发这个要保存文件才能立刻触发,如果用Nodejs自动检测会很慢
    fs.watchFile(this.getPath(), {
        persistent: true,
        interval: 1000
    }, function (current, prev) {
        if (current.mtime > prev.mtime) {
            that._initConfig();
        }
    });
};

/**
 * @public
 * @param key
 * @returns {string}
 */
Config.prototype.read = function (key) {
    if (!key)return '';
    return this.getMap()[key];
};

/**
 * @public
 * @param key
 * @param value
 */
Config.prototype.write = function (key, value) {
    if (value == null || value === '') {
        // delete this.map key;
        delete this.getMap()[key];
    } else {
        this.getMap()[key] = value;
    }
    fs.writeFileSync(this.getPath(), this.getMapToString(this.getMap()));
};

/**
 * @public
 * 格式化字符串
 * 把字符串按照分隔符分隔,变成json对象
 */
Config.parse = Config.prototype.parse = function (qs, sep, eq) {
    let obj = {},
        _sep = sep || '\r\n',
        _eq = eq || '=',
        regex = new RegExp('^(.+)(?<!=)' + _eq + '(?!=)(.+)$');// 由于部分配置进行了加密,正则需要匹配
        // 第一个等号的分隔

    if (typeof qs !== 'string' || qs.length === 0) {
        return obj;
    }
    if (!util.isString(_sep))
        _sep += '';//其实是把sep转成字符串类型而已
    let strArray = qs.split(_sep);

    CGlobal.forEach(strArray, function (i, value) {
        parseRows(obj, regex, i, value);
    });

    return obj;
};

function parseRows(obj, regex, i, str) {
    let matches = str.match(regex);
    if (matches) {
        obj[matches[1].trim()] = matches[2].trim();
    } else {
        obj['#' + i] = str;
    }
}

/**
 * map是一个JSON对象集合
 * 其实就是把json对象转变成string,按照指定的分隔符sep和键值对的显示key eq value返回
 * 这里还有个功能没做,就是{a:{b:1,c:2}} ==> a.b=1&a.c=2 反之也要做
 * 所以要判断它的值是否是json
 * {name:felx,age:23} ==> name=felx&age=23
 * @public
 * @param map
 * @param sep
 * @param eq
 * @returns {string}
 */
Config.getMapToString = Config.prototype.getMapToString = function (map, sep, eq) {
    let temp = [],
        _sep = sep || '\r\n',
        _eq = eq || '=';
    if (!CGlobal.isPlainObject(map) || CGlobal.getObjLength(map) === 0) {
        return '';
    }

    CGlobal.forEach(map, function (key, value) {
        if (/^#\d+$/.test(key)) {
            temp.push(value);//-->value\r\n
        } else {
            temp.push(key + _eq + value);//-->key=value\r\n
        }
    });

    return temp.join(_sep);
};

/*
 * string-->json
 * 解析格式:a=1&b=2&c.d=3&c.e=4-->{a:1,b:2,c:{d:3,e:4}}
 */
Config.parseParams = function (str, sep, eq) {
    let obj = {},
        _sep = sep || '&',
        _eq = eq || '=',
        regex = new RegExp('^(.+)' + _eq + '(.+)$');

    if (!util.isString(str) || str.length === 0)return obj;
    if (!util.isString(_sep))
        _sep += '';//其实是把sep转成字符串类型而已
    let strArray = str.split(_sep);

    CGlobal.forEach(strArray, function (i, value) {
        let matches = value.match(regex);
        if (matches) {
            let objKey = matches[1];
            let objValue = matches[2];
            createNode(obj, objKey, objValue);
        }
    });

    return obj;
};

function createNode(obj, objKey, objValue) {
    let objKeyArr = objKey.split('.');
    let temp = '';
    for (let i = objKeyArr.length - 1; i >= 0; i--) {
        if (i === objKeyArr.length - 1) {
            temp = '"' + objKeyArr[i] + '"' + ':' + objValue;
            continue;
        }
        temp = '"' + objKeyArr[i] + '"' + ':' + '{' + temp + '}';
    }
    temp = "{" + temp + "}";
    CGlobal.extend(true, obj, JSON.parse(temp));
}

/**
 * json-->string
 * 解析格式:{a:1,b:2,c:{d:3,e:4}}-->a=1&b=2&c.d=3&c.e=4
 */
Config.stringifyParams = function (obj, sep, eq) {
    let temp = stringify(obj),
        _sep = sep || '&',
        _eq = eq || '=';

    if (!CGlobal.isPlainObject(obj) || CGlobal.getObjLength(obj) === 0) {
        // if (temp === 'null' || temp === undefined) {
        //     return '';
        // }
        return temp;
    }
    let arr = [];//只有用引用变量才能不用返回而改变值
    appendParams(arr, obj, _eq);
    temp = [];//把临时字符串清空
    CGlobal.forEach(arr, function (i, value) {
        temp.push(value);//换成数组push,用join()
    });
    return temp.join(_sep);
};

/**
 * 解析json中的节点
 * @param arr 保存截取的row
 * @param obj 解析的json
 * @param eq
 * @param prefix 它的前缀
 */
function appendParams(arr, obj, eq, prefix) {
    CGlobal.forEach(obj, function (key, value) {
        if (prefix) key = prefix + '.' + key;
        let row = stringify(value);
        if (!CGlobal.isPlainObject(value) || row === '{}') {
            //值不是对象,或者是数组处理
            if (row === 'null' || row === undefined) {
                row = '';
            }
            arr.push(key + eq + row);
        } else {
            //值是一个对象处理
            appendParams(arr, value, eq, key);
        }
    });
}

module.exports = Config;

/**
 * 对对象的原型方法和静态方法的总结
 * 1.静态方法只能访问静态方法,原型方法也如此
 * 2.function里面定义的this.xxx只能原型方法访问,静态方法只能访问静态的变量,但是静态方法访问this.name时,
 * 它的值this.name=类名,其他的不知道
 * 3.可以定义static=prototype=function(){},这样不管是静态还是new对象都可以访问同一个方法
 * 但是这样定义的方法里面如果调用其他方法,那么静态只能访问静态的方法,如1
 * 也就是说,第3点定义的方法用了A方法,但是A方法是原型的,那么静态调用时,A方法就不存在
 * 也可以根据静态调用和new调用,申明不同的逻辑的A方法,并且不会被覆盖
 *
 */
