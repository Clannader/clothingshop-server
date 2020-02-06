/**
 * Created by CC on 2017/2/24.
 * 服务器端全局的js,启动服务时先加载
 */
'use strict'

let moment = require('moment')
Date.prototype.format = function (fmt) {
    fmt = fmt || 'YYYY-MM-DD'
    return moment(this).format(fmt.replace(/y/g, 'Y').replace(/d/g, 'D'))
}

function escapePath(path) {
    if (process.platform === 'win32')
        return path.replace(/\/+/g, '\\')
    else
        return path.replace(/\\+/g, '//')
}

// 加logs保存机制,这个log4js只能配置一次,第二次会把上一次的配置覆盖掉
let log4js = require('log4js')

//log4js 3.0.6版本的配置
function replaceConsole(logger) {
    function replaceWith(fn) {
        return function () {
            fn.apply(logger, arguments)
        }
    }

    ['log', 'debug', 'info', 'warn', 'error'].forEach(function (item) {
        console[item] = replaceWith(item === 'log' ? logger.info : logger[item])
    })
}

log4js.configure({
    appenders: {
        serverLogs: {
            type: 'dateFile',
            filename: escapePath(process.env.BASE_PATH + 'logs//server.log'),
            pattern: 'yyyy-MM-dd',
            level: 'all',
            alwaysIncludePattern: true,
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy-MM-dd hh:mm:ss,SSS} %p %c - %m',
            }
        },
        console: {
            type: 'console',
            layout: {
                type: 'pattern',
                pattern: '%[[%d{yyyy-MM-dd hh:mm:ss,SSS}] %p %c -%] %m',
            }
        }
    },
    categories: {
        default: {
            appenders: ['serverLogs', 'console'],
            level: 'all'
        }
    }
})
const consoleLogger = log4js.getLogger('console')
replaceConsole(consoleLogger)
console.log('require globalServer');

//改变全局函数,封装成一个对象即可
(function (global) {
    let util = require('util'),
        globalVariable = require('./globalVariable')

    let CGlobal = function () {

    }

    CGlobal.prototype = {
        env: {

        },
        GlobalStatic: globalVariable,
        //替换占位符
        replaceArgs: function () {
            let SKIP_INDEXES = 1

            let templateArgs = arguments
            let str = arguments[0]
            let message = ''

            if (typeof str !== 'string') {
                return ''
            }

            message += str.replace(/\{\d+\}/g, function (match) {
                let index = +match.slice(1, -1),//==>\d是什么数字,还有+match是什么意思
                    shiftedIndex = index + SKIP_INDEXES//==>替换字符的参数位置

                if (shiftedIndex < templateArgs.length) {
                    return templateArgs[shiftedIndex]
                }
                return match
            })

            return message
        },
        /**
         * 返回对象的长度 JSON
         * @param obj
         * @returns {Number}
         */
        getObjLength: function (obj) {
            if (!this.isPlainObject(obj)) {
                return 0
            }
            return Object.keys(obj).length
        },
        /**
         * 循环JSON Or Array
         * @param obj
         * @param callback(key[JSON] Or i[Array],value)
         * @returns {*}
         */
        forEach: function (obj, callback) {
            let length, i = 0

            if (util.isArray(obj)) {
                length = obj.length
                for (; i < length; i++) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break
                    }
                }
            } else {
                for (i in obj) {
                    if (obj.hasOwnProperty(i) && callback.call(obj[i], i, obj[i]) === false) {
                        break
                    }
                }
            }

            return obj
        },
        //空函数
        noop: function () {
        },
        //格式化日期
        dateFormat: function (date, format) {
            return moment(date).format(format || this.GlobalStatic.dateSdf)
        },
        //扩展json,或者数组
        extend: function () {
            let options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false

            // Handle a deep copy situation
            if (typeof target === 'boolean') {
                deep = target

                // Skip the boolean and the target
                target = arguments[i] || {}
                i++
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== 'object' && !util.isFunction(target)) {
                target = {}
            }

            // Extend jQuery itself if only one argument is passed
            if (i === length) {
                target = this
                i--
            }

            for (; i < length; i++) {

                // Only deal with non-null/undefined values
                if ((options = arguments[i]) != null) {

                    // Extend the base object
                    for (name in options) {
                        src = target[name]
                        copy = options[name]

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && (this.isPlainObject(copy) ||
                            (copyIsArray = util.isArray(copy)))) {

                            if (copyIsArray) {
                                copyIsArray = false
                                clone = src && util.isArray(src) ? src : []

                            } else {
                                clone = src && this.isPlainObject(src) ? src : {}
                            }

                            // Never move original objects, clone them
                            target[name] = this.extend(deep, clone, copy)

                            // Don't bring in undefined values
                        } else if (copy !== undefined) {
                            target[name] = copy
                        }
                    }
                }
            }

            // Return the modified object
            return target
        },
        //判断是否是纯粹的对象,例如{}-->true
        //Check to see if an object is a plain object (created using "{}" or "new Object").
        isPlainObject: function (obj) {
            //以后要理解这里代码什么意思
            let class2type = {}
            let toString = class2type.toString
            let hasOwn = class2type.hasOwnProperty
            let fnToString = hasOwn.toString
            let proto, Ctor

            // Detect obvious negatives
            // Use toString instead of jQuery.type to catch host objects
            if (!obj || toString.call(obj) !== '[object Object]') {
                return false
            }

            proto = Object.getPrototypeOf(obj)

            // Objects with no prototype (e.g., `Object.create( null )`) are plain
            if (!proto) {
                return true
            }

            // Objects with prototype are plain iff they were constructed by a global Object function
            Ctor = hasOwn.call(proto, 'constructor') && proto.constructor
            return typeof Ctor === 'function' && fnToString.call(Ctor) === fnToString.call(Object)
        },
        /**
         * 判断元素是否在指定数组中
         * @param elem 要判断的元素
         * @param arr 传入的数组
         * @param i 从数组的第几个开始找起,即索引
         * @returns {number}
         */
        inArray: function (elem, arr, i) {
            return arr == null ? -1 : [].indexOf.call(arr, elem, i)
        },
        compareObjects: function (objA, objB) {
            let objectAProperties = Object.getOwnPropertyNames(objA),
                objectBProperties = Object.getOwnPropertyNames(objB),
                propName = ''

            if (objectAProperties.length !== objectBProperties.length) {
                return false
            }

            for (let i = 0; i < objectAProperties.length; i++) {
                propName = objectAProperties[i]
                if (this.inArray(propName, objectBProperties) > -1) {
                    let isObj = this.isPlainObject(objA[propName]) && this.isPlainObject(objB[propName])
                    let isArr = Array.isArray(objA[propName]) && Array.isArray(objB[propName])
                    if (isArr || isObj) {
                        if (!this.compareObjects(objA[propName], objB[propName])) {
                            return false
                        }
                    } else if (objA[propName] !== objB[propName]) {
                        return false
                    }
                } else {
                    return false
                }
            }
            return true
        },
        isEmpty: function (obj) {
            return obj == null || obj === '' || obj === 'undefined'
        },
        objTrim: function (obj) {
            let isArray = Array.isArray(obj)
            let isObj = this.isPlainObject(obj)
            if (!isObj && !isArray) return obj
            //这里new的自定义对象时,isPlainObject是false的
            let that = this
            let deleteArrayIndex = []//删除数组的下标集合
            this.forEach(obj, function (key, value) {
                if (that.isPlainObject(value) || Array.isArray(value)) {
                    return that.objTrim(value)
                }
                if (that.isEmpty(value)) {
                    if (isArray) {
                        deleteArrayIndex.push(key)
                    } else {
                        delete obj[key]
                    }
                }
            })
            if (isArray) {
                this.forEach(deleteArrayIndex, function (i, value) {
                    if (i === 0) obj.splice(value, 1)
                    else obj.splice(value - 1, 1)
                })
            }
            return obj
        }
    }

    global.CGlobal = new CGlobal()

})(global)
