'use strict'
console.log('require ServerLogService')

let Utils = require('../util/Utils')
let fs = require('fs')
let logpath = process.env.BASE_PATH + 'logs'
// let conn = require('../dao/daoConnection')
// let AdminLog = conn.getEntity('AdminLog')

function ServerLogService() {

}

ServerLogService.searchLogs = function (req, res) {
  let adminSession = Utils.getAdminSession(req)
  if (!CGlobal.isPermission(adminSession.rights, CGlobal.Rights.ServerLogs.code)) {
    return res.send({
      code: 0, msg: CGlobal.serverLang(req.lang, '抱歉,你没有 [{0}] 权限访问!'
          , 'admin.noRights', CGlobal.Rights.ServerLogs.code)
    })
  }
  const dirs = fs.readdirSync(logpath, 'UTF-8')
      .map(value => {
        const stat = fs.statSync(logpath + '/' + value)
        return {
          name: value, // 文件名
          time: stat.birthtimeMs, // 创建日期的时间戳 // 取创建的时间
          size: Utils.getFileSize(stat.size),
          date: CGlobal.dateFormat(stat.birthtimeMs, 'YYYY-MM-DD') // 返回标准格式日期
        }
      })
      .sort((t1, t2) => {
        // 按创建日期倒叙
        return t2.time - t1.time
      })
  // let result = []
  // dirs.forEach(function (value) {
  //   result.push({
  //     name: value
  //   })
  // })
  res.send({code: 1, logs: dirs})
}

ServerLogService.downloadLogs = function (req, res) {
  let logName = req.body.logName
  if (!logName) {
    return res.send({
      code: 0, msg: CGlobal.serverLang(req.lang, '日志文件名不能为空!'
          , 'serverLog.logNameIsEmpty')
    })
  }
  let adminSession = Utils.getAdminSession(req)
  if (!CGlobal.isPermission(adminSession.rights, CGlobal.Rights.ServerLogs.code)) {
    return res.send({
      code: 0, msg: CGlobal.serverLang(req.lang, '抱歉,你没有 [{0}] 权限访问!'
          , 'admin.noRights', CGlobal.Rights.ServerLogs.code)
    })
  }
  //使用流来读文件
  // 1.下载文件判断大小,超过大小的,按最末尾的下载最大文件回去
  // 2.该方法兼容查看的api
  // 3.判断文件是否存在
  let startByte = req.body.startByte
  let endByte = req.body.endByte

  // Begin 这个写法虽然可以按照开始结束符读取文件,但是无法知道文件的总大小,有点坑爹
  const options = {
    encoding: 'UTF-8'
  }
  const isView = !CGlobal.isEmpty(startByte) && !CGlobal.isEmpty(endByte)
  // 这里为了兼容下载,判断是否为空
  if (isView) {
    options.start = startByte
    options.end = endByte
  }
  const stream = fs.createReadStream(logpath + '/' + logName, options)
  let bufferArr = ''
  stream.on('data', function (chunk) {
    // 这里也很坑爹,根本无法返回buffer对象,但是其他fs的方法读文件就能返回
    bufferArr += chunk
  })

  stream.on('end', function () {
    // 读取文件结束时,查一下文件的总大小
    const fsStat = fs.statSync(logpath + '/' + logName)
    const hasMore = fsStat.size > endByte
    if (isView) {
      startByte = endByte + 1 // 这里返回给前端下一次加载的开始位
      endByte += 10 * 1024
      // 判断bufferArr的最后一位是否是乱码,否则不返回
      const lastChar = bufferArr.substr(bufferArr.length - 1, bufferArr.length)
      if (lastChar === '�') {
        // 这里占了1个位数
        bufferArr = bufferArr.substr(0, bufferArr.length - 1)
        // 这里确实有需要研究一下,因为中文在utf-8里面占用3个字节
        // 然后满3位的时候可以变成真的中文,但是满1位或者2位的时候,会变成�
        // 然后这时候bufferArr里面的�,并不知道是占了2位还是1位,所以才导致了
        // 有时候要减2位或者1位的情况
        /**
         * 中文汉字：
         字节数 : 2;编码：GB2312
         字节数 : 2;编码：GBK
         字节数 : 2;编码：GB18030
         字节数 : 1;编码：ISO-8859-1
         字节数 : 3;编码：UTF-8
         字节数 : 4;编码：UTF-16
         字节数 : 2;编码：UTF-16BE
         字节数 : 2;编码：UTF-16LE
         */
        startByte -= 2
      }
      const firstChar = bufferArr.substr(0, 1)
      if (firstChar === '�') {
        // 如果startByte减多了1,就会导致第一个是乱码,去掉即可
        bufferArr = bufferArr.substr(1)
      }
    }
    res.send({
      code: 1,
      content: Utils.stringToBase64(bufferArr),
      hasMore: hasMore,
      startByte: startByte,
      endByte: endByte
    })
  })

  stream.on('error', function (err) {
    res.send({code: 0, msg: err.message})
  })
  // End

  // 读取文件
  // fs.readFile(logpath + '/' + logName, function (err, text) {
  //   if (err) return res.send({code: 0, msg: err.message})
  //   res.send({code: 1, content: Utils.stringToBase64(text + '')})
  // })
}

// 服务器日志不能删除,所以该方法注掉
// ServerLogService.deleteLogs = function (req, res) {
//   let logname = req.body.logname
//   if (!logname) {
//     return res.send({code: 0, msg: CGlobal.serverLang('日志文件名不能为空!')})
//   }
//   let adminSession = Utils.getAdminSession(req)
//   if (!CGlobal.isPermission(adminSession.rights, CGlobal.Rights.ServerLogs.code)) {
//     return res.send({code: 0, msg: CGlobal.serverLang('抱歉,你没有 {0} 权限!', CGlobal.Rights.ServerLogs.code)})
//   }
//   fs.unlink(logpath + '/' + logname, function (err) {
//     if (err) return res.send({code: 0, msg: err.message})
//     AdminLog.createLog({
//       content: CGlobal.serverLang('删除服务器日志:{0}', logname),
//       type: CGlobal.GlobalStatic.Log_Type.SERVER_LOG
//     }, adminSession, CGlobal.noop)
//     res.send({code: 1})
//   })
// }

module.exports = ServerLogService
