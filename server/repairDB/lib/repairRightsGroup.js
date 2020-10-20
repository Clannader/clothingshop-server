/**
 * Create by CC on 2018/10/24
 * 修复权限组
 */
'use strict'
console.log('require repairRightsGroup')

let db = require('../../dao/daoConnection')
let defaultData = require('../../public/data/dataPool').defaultRightsGroup
let Utils = require('../../util/Utils')
let async = require('async')

let errArray = []
let Rights = db.getEntity('Rights')
async.eachSeries(defaultData, function (item, cb) {
  let where = {groupName: Utils.getIgnoreCase(item.groupName)}
  async.auto({
    findRights: function (next) {
      Rights.findOne(where, next)
    },
    compareRights: ['findRights', function (findResult, next) {
      let rights = findResult.findRights
      if (rights) {
        let code = rights.rightsCode
        let contains = true//是否包含的标志
        let defaultCode = item.rightsCode.split(',')
        defaultCode.forEach(function (value) {
          if (code.indexOf(value) === -1) {
            //不存在
            contains = false
            return false
          }
        })
        if (!contains) {
          Rights.update({_id: rights._id}, {$set: {rightsCode: item.rightsCode}}, CGlobal.noop)
          console.log('修复 %s 权限组', item.groupName)
        }
      } else {
        Rights.create(item)
        console.log('创建 %s 权限组', item.groupName)
      }
      next()
    }]
  }, function (err) {
    if (err) {
      errArray.push(err.message)
    }
    cb()
  })
}, function () {
  if (errArray.length !== 0) {
    console.log(errArray.join('\r\n'))
  } else {
    console.log(CGlobal.logLang('修复权限组完毕'))
  }
})
