/**
 * Created by CC on 2017/2/24.
 * 服务器端全局的js,启动服务时先加载
 */
'use strict'

let env = process.env.NODE_ENV || 'dev'
let config = require('../../config/' + env + '.env')
for (let key in config) {
    process.env[key] = config[key]
}
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
//log4js 1.1.1版本的配置
// log4js.configure({
//     appenders:[{
//         type:'console',
//         category: 'console'
//     },{
//         type:'dateFile',
//         filename: escapePath(__dirname+'//..//..//logs//server.log'),
//         pattern:'_yyyy-MM-dd',// 指定pattern后无限备份
//         level:'all',
//         // backups: 2,//backups,默认为5,指定了pattern之后backups参数无效了,
//         // 除非pattern是小于backups的数字,原理是不指定pattern时备份的文件是在文件名后面加'.n'的数字,
//         // n从1开始自增
//         alwaysIncludePattern: true, // 该参数不写时默认是undefined,就会变成false,
//         // 值为false时就会出现bug,多线程或者过零点时会不改变文件,所以一般设true.
//         //或者指定pattern为'_yyyy-MM-dd'
//         // 不指定pattern时,若为true会使用默认值'.yyyy-MM-dd'
//         layout: {
//             type: 'pattern',
//             pattern: '%d{yyyy-MM-dd hh:mm:ss,SSS} %p %c - %m'
//         },
//         category: 'console'
//     },{
//         type: 'file',
//         filename: escapePath(__dirname+'\\..\\..\\file_logs\\file.log'),
//         maxLogSize: 10 * 1024 * 1024, // = 10Mb
//         numBackups: 5, // keep five backup files
//         alwaysIncludePattern: true,
//         layout: {
//             type: 'pattern',
//             pattern: '%d{yyyy-MM-dd hh:mm:ss,SSS} [%z] %p %c - %m'
//         },
//         category: 'CMS'
//     }],
//     replaceConsole:true
// });

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
        fileLogs: {
            type: 'file',
            filename: escapePath(process.env.BASE_PATH + 'file_logs\\file.log'),
            maxLogSize: 10 * 1024 * 1024, // = 10Mb
            numBackups: 5, // keep five backup files
            alwaysIncludePattern: true,
            /**
             * 这里发现有个好玩的配置
             * 1.使用type:'dateFile',可以使用pattern配置隔多久生成一次文件
             * 例如想每次运行代码生成新的,则配置
             * {    type:'dateFile',
             *      filename: escapePath(process.env.LOG_PATH + 'file_logs\\'),
             *      pattern: 'file_' + new Date.format('yyyy-MM-dd_HH:mm:ss') + '.log'
             *      //也可以配置进程号process.pid.toString()
             *  }
             */
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy-MM-dd hh:mm:ss,SSS} [%z] %p %c - %m'
            }
        },
        serverLogs: {
            type: 'dateFile',
            filename: escapePath(process.env.BASE_PATH + 'logs//server.log'),
            pattern: 'yyyy-MM-dd',
            level: 'all',
            // daysToKeep: 10, //删除10天前的日志,感觉没什么用
            alwaysIncludePattern: true,
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy-MM-dd hh:mm:ss,SSS} %x{author} %X{appName} %p %c - %m',
                tokens: {
                    author: function (logEvent) {
                        // logEvent =>
                        // let _logEvent = {
                        //     "startTime": "2019-09-13T06:18:02.679Z",
                        //     "categoryName": "console",
                        //     "data": ["require globalServer"],
                        //     "level": {"level": 20000, "levelStr": "INFO", "colour": "green"},
                        //     "context": {},
                        //     "pid": 5740
                        // }
                        return 'oliver'
                    }
                }
            }
        },
        console: {
            type: 'console',
            layout: {
                type: 'pattern',
                //%[ %]标志从哪到哪需要加颜色显示
                pattern: '%[[%d{yyyy-MM-dd hh:mm:ss,SSS}] %p %c -%] %m',
            }
        }
    },
    categories: {
        default: {
            appenders: ['serverLogs', 'console'],
            level: 'all'
        },
        fileLogs: {
            appenders: ['fileLogs', 'console'],
            //appenders: ['fileLogs', 'console']这样配置可以在控制台输出
            //appenders: ['fileLogs']不需要在控制台输出
            level: 'all'
        }
    }
})
const consoleLogger = log4js.getLogger('console')
replaceConsole(consoleLogger)
consoleLogger.addContext('appName', 'cmsServer')
console.log('require globalServer');

//改变全局函数,封装成一个对象即可
(function (global) {
    let util = require('util'),
        globalVariable = require('./globalVariable'),
        Rights = require('../rights/Rights'),
        CryptoJS = require('crypto-js')

    let CGlobal = function () {

    }

    CGlobal.prototype = {
        languageLogo: {
            CN: '简体中文',
            EN: 'English'
        },
        //关于CMS的描述信息json
        aboutCMS: {},
        // GlobalMoment: moment,
        //静态变量值
        GlobalStatic: globalVariable,
        //全局打印错误
        handleServerError: function (err) {
            err && console.error(err)
        },
        //服务器端翻译函数
        /**
         * @param lang 传入语言类型,因为不能使用全局语言那个方式写,异步出去之后的语言会有问题
         * 除非使用ts写,否则目前不懂如何用线程保护的写法保证异步后的语言类型是正确的
         * @param orgin 传入原始的中文翻译
         * @param key 翻译文件对应的key
         * @param args 参数
         */
        serverLang: function (lang, orgin, key, ...args) {
            // return this._translation(this.GlobalLangType, arguments);
            // 这里重新规划翻译逻辑
            const properties = langProperties[lang]
            if (this.isEmpty(properties)) {
                return this.replaceArgs(orgin, ...args)
            }
            const langKey = this._parseProperties(properties, key)
            if(typeof langKey !== 'string'){
                return this.replaceArgs(orgin, ...args)
            }
            return this.replaceArgs(langKey, ...args)
        },
        _parseProperties: function (properties, key) {
            const keyList = key.split('.')
            let temp = properties
            if (keyList.length > 0) {
                keyList.forEach(k => {
                    try {
                        temp = temp[k]
                        if (this.isEmpty(temp)) {
                            return false
                        }
                    } catch (e) {
                        return false
                    }
                })
            }
            return temp
        },
        //输出控制台打印log翻译
        logLang: function () {
            return this.replaceArgs.apply(this, arguments)
        },
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
        //翻译总函数(内部函数使用)
        _translation: function (type, args) {
            let str = args[0]
            switch (type) {
                case this.GlobalStatic.EN:
                    langProperties[str]
                        ? str = langProperties[str][1]
                        : str
                    break
                default:
                    //避免客户端的language Cookie被修改不是CN 或者 EN 导致不能翻译
                    langProperties[str]
                        ? str = langProperties[str][0]
                        : str
                    break
            }
            //要把参数的第一个值替换成翻译后的值,判断翻译是否是空格,是空格则不翻译
            args[0] = str || args[0]//避免翻译是空格时,返回原值
            //把serverLang的参数传递给replaceArgs函数
            //意思是this这个对象有replaceArgs这个方法,传入参数是arguments
            //apply传入的是数组,call传入的是args1,args2,...
            return this.replaceArgs.apply(this, args)
        },
        //全局语言类型
        //默认是中文
        //js严格模式中,全局的变量是不能改变值的,也不知道是不是的,猜测是不能改变的
        //项目的相对路径
        GlobalLangType: globalVariable.CN,
        //Log语言类型
        logLangType: globalVariable.CN,
        GlobalProjectPath: escapePath(__dirname + '\\..\\'),
        /**
         * 判断权限
         * @param rights 用户权限的字符串,以','分隔
         * @param rightCode 权限代码,允许多个权限
         */
        isPermission: function (rights, rightCode) {
            return this._permission(true, arguments)
        },
        isPermissionOr: function () {
            return this._permission(false, arguments)
        },
        _permission: function (isAnd, args) {
            //考虑同时需要多个权限才能访问的情况
            let rights = args[0]
            let rightCode = args[1]
            if (rights === this.GlobalStatic.Supervisor_Rights) {
                return true
            }
            let flag = isAnd
            let arr = null
            if (util.isString(rightCode)) {
                delete args[0]
                arr = args
            } else if (util.isArray(rightCode)) {
                arr = rightCode
            } else {
                return false//参数错误时返回false
            }
            this.forEach(arr, function (i, value) {
                if (flag) {
                    if (rights.indexOf(value) < 0) {
                        flag = !flag
                        return false//跳出循环
                    }
                } else {
                    if (rights.indexOf(value) > 0) {
                        flag = !flag
                        return false//跳出循环
                    }
                }
            })
            return flag
        },
        //权限代码
        Rights: Rights,
        //判断用户名是否是SUPERVISOR
        isSupervisor: function (session) {
            if (!this.isPlainObject(session)) return false
            if (typeof session.adminId !== 'string') return false
            return 'SUPERVISOR' === session.adminId.toUpperCase()
                || (session.rights && session.rights.indexOf('SUPERVISOR') !== -1)
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
        DESEncrypt: function (msg, key) {
            return CryptoJS.DES.encrypt(msg, key).toString()
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
        },
        modelToJSON: function (obj) {
            return JSON.parse(JSON.stringify(obj))
        },
        containsString: function (str) {
            let flag = true
            if (typeof str !== 'string') return !flag
            for (let i = 1; i < arguments.length; i++) {
                if (str.indexOf(arguments[i]) !== -1) {
                    //包含了
                    flag = true
                    break
                }
                flag = false
            }
            return flag
        },
        getAllRights: function () {
            let arr = []
            this.forEach(Rights, function (key, value) {
                arr.push(value.code)
            })
            return arr
        }
    }

    global.CGlobal = new CGlobal()

    //语言langPool依赖CGlobal,要初始化CGlobal后才能初始化langPool
    //js初始化对象的时候,她的prototype方法里面的定义的变量不会初始化,只要需要的变量定义在new之后
    //她也会找到变量的值,果然是一个神奇的机制
    // let langProperties = require('./lang/langPool');
    let langProperties = require('./lang/i18n/index')
})(global)
