/**
 * Created by CC on 2016/11/3.
 * 管理员实体结果
 */
'use strict'
console.log('require Admin')
/**
 * 超级管理员应该是用户类型是SYSTEM,并且商店名是SYSTEM
 * 某牌子店铺超级管理员应该是用户类型是SYSTEM,并且商店名是牌子店名称(HAILAN)
 * 牌子店的普通用户是NORMAL,商店名是HAILAN
 * 接口用户是3RD,HAILAN
 */
let Schema = require('mongoose').Schema
let dao = require('../../dao/daoConnection')
let conn = dao.getConnection()
let Utils = require('../../util/Utils')
let async = require('async')
let Shop = require('../Shop')
let AdminLog = require('./AdminLog')
let Admin = {
  adminId: {
    type: String
    , required: true //设定是否必填
    , trim: true //去除数据前后的空格
    , uppercase: true // 总是将值转化为大写
  },//登录时的管理员ID,唯一
  adminName: {
    type: String
    , required: true
  },//管理员的名字
  adminType: {
    type: String
    , required: true
    , enum: [CGlobal.GlobalStatic.User_Type.NORMAL, CGlobal.GlobalStatic.User_Type.SYSTEM
      , CGlobal.GlobalStatic.User_Type.THIRD]
  },//用户类型:SYSTEM,NORMAL,3RD
  password: {
    type: String
  },//管理员的密码
  shopId: {
    type: String
    , required: true
  },//所属的商店名
  rights: {
    type: String
    , required: true
    , match: CGlobal.GlobalStatic.rightsExp
  },//权限
  email: {
    type: String
    , required: true
    , unique: true//索引值唯一
    , match: CGlobal.GlobalStatic.mailExp
  },//邮箱地址
  usedPws: {
    type: Array
    , maxlength: 3
  },//使用过的密码,最大长度3,BUG这个字段的类型还需要考虑考虑,如果修改要改动service
  supplierCode: {
    type: String
  },//供应商代码,BUG修改字段类型,研究还有什么属性可以控制字段的,比如长度,正则
  lasturl: {
    type: String
  },//上一次退出的地址
  // isLogin:{type:Boolean,default:false},//登录状态,是否处于正在登录
  loginTime: {
    type: Date
  },//登录时间
  adminStatus: {
    type: Boolean
    , default: false
  },//管理员的状态,false时不可登录
  createUser: {
    type: String//创建这个用户的人
  }
}
let AdminSchema = new Schema(Admin)

AdminSchema.statics.findBy_Id = function (id, session, cb) {
  let field = {password: 0, usedPws: 0, loginTime: 0, lasturl: 0}
  if (!Utils.isMongoId(id)) {
    return cb({message: '无效的id值'})
  }
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.UserSetup.code)) {
    return cb({message: '抱歉,你没有 {0} 权限!', code: CGlobal.Rights.UserSetup.code})
  }
  let that = this
  this.findById(id, field, function (err, user) {
    if (err) return cb(err)
    that._errorSearchHandler(user, session, cb)
  })
}

AdminSchema.statics.findByName = function (adminId, shopId, session, cb) {
  let field = {password: 0, usedPws: 0, loginTime: 0, lasturl: 0}
  if (!adminId) {
    return cb({message: '用户名不能为空'})
  }
  if (!shopId) {
    return cb({message: '店铺ID不能为空'})
  }
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.UserSetup.code)) {
    return cb({message: '抱歉,你没有 {0} 权限!', code: CGlobal.Rights.UserSetup.code})
  }
  let that = this
  this.findOne({adminId: adminId, shopId: shopId}, field, function (err, user) {
    if (err) return cb(err)
    that._errorSearchHandler(user, session, cb)
  })
}

AdminSchema.statics._errorSearchHandler = function (user, session, cb) {
  if (!user) return cb({message: '该用户不存在!'})
  //不能查询自己
  if (user.adminId === session.adminId) {
    // return cb({message: '查询错误!-->错误代码:{0}', code: 100});
    return cb({message: '不能查询自己', code: 100})
  }
  //不能查SUPERVISOR
  if ('SUPERVISOR' === user.adminId) {
    // return cb({message: '查询错误!-->错误代码:{0}', code: 101});
    return cb({message: '不能查询SUPERVISOR', code: 101})
  }
  if (CGlobal.isSupervisor(session)) {
    //如果是SUPERVISOR查询用户则无条件返回
    cb(null, user)
  } else if (CGlobal.GlobalStatic.User_Type.SYSTEM === session.selfShop) {
    //如果是管理员用户
    if (user.adminType === CGlobal.GlobalStatic.User_Type.SYSTEM) {
      //如果管理员查询的是SYSTEM用户,判断他有没有权限创建SYSTEM用户
      if (CGlobal.isPermission(session.rights, CGlobal.Rights.CreateSYSUser.code)) {
        if (user.createUser === session.adminId) {
          //如果有管理员权限,但是只能查询这个管理员自己创建的用户
          return cb(null, user)
        } else {
          // return cb({message: '查询错误!-->错误代码:{0}', code: 103});
          return cb({message: '该用户不是自己创建的', code: 103})
        }
      } else {
        //管理员用户也会区分能不能创建管理员用户这个权限,不能创建是不能查询其他管理员的
        // return cb({message: '查询错误!-->错误代码:{0}', code: 102});
        return cb({message: '没有权限查询系统用户', code: 102})
      }
    }
    //查询的是其他用户,例如第三方用户或者普通用户都是可以的
    //如果还想校验,那就是判断管理员用户是否能管理到该商铺的用户了,这个就麻烦了,就不写了
    cb(null, user)
  } else {
    //如果是普通用户
    if (user.adminType === CGlobal.GlobalStatic.User_Type.SYSTEM) {
      //普通用户不能查询管理员用户
      // return cb({message: '查询错误!-->错误代码:{0}', code: 103});
      return cb({message: '普通用户不能查询系统用户', code: 103})
    }
    cb(null, user)
  }
}

AdminSchema.statics.loginSystem = function (req, adminId) {
  //判断aid是否是邮箱地址,因为可以用邮箱地址登录
  if (!adminId) {
    return Promise.reject({message: CGlobal.serverLang(req.lang, '用户名不能为空', 'admin.userName')})
  }
  if (!adminId.match(CGlobal.GlobalStatic.userNameExp)) {
    return Promise.reject({message: CGlobal.serverLang(req.lang, '用户名含有非法字符', 'admin.invUserName')})
  }
  let where = {}
  let matches = adminId.match('^(.+)@(.+)$')
  let loginShop = ''
  let that = this
  if (adminId.match(CGlobal.GlobalStatic.mailExp)) {
    where.email = adminId
  } else if (matches) {
    where.adminId = Utils.getIgnoreCase(matches[1])
    where.$or = [{
      shopId: 'SYSTEM'
    }, {
      shopId: Utils.getIgnoreCase(matches[2])
    }]
    loginShop = matches[2]//@的shopId
  } else {
    where.adminId = Utils.getIgnoreCase(adminId)
    where.shopId = 'SYSTEM'
  }

  return new Promise((resolve, reject) => {
    async.auto({
      findAdmin: function (cb) {
        that.findOne(where, function (err, adminObj) {
          if (err) return cb(err)
          if (adminObj) return cb(null, JSON.parse(JSON.stringify(adminObj)))
          if (CGlobal.isSupervisor({adminId: adminId})) {
            that.create(Utils.getSuper(), function (err) {
              cb(err, Utils.getSuper())
            })
          }
          //登录用户名不是SUPERVISOR
          else {
            return cb({message: CGlobal.serverLang(req.lang, '用户名或密码错误', 'admin.invPws')})//让报错不往下走了
          }
        })
      },
      findShop: ['findAdmin', function (adminRes, cb) {
        let admin = adminRes.findAdmin
        //这个判断是判断普通用户使用邮箱登录时没有shopId的
        if (admin.adminType === CGlobal.GlobalStatic.User_Type.NORMAL) {
          loginShop = admin.shopId
        }
        if (!loginShop) return cb()
        let searchShop = {
          shopId: Utils.getIgnoreCase(loginShop)
        }
        if (admin.adminType === CGlobal.GlobalStatic.User_Type.SYSTEM
            && admin.supplierCode) {
          //就算数据库里面没有supplierCode这个字段,查出来的值会默认[]的
          searchShop = {
            $and: [{
              supplierCode: {$in: admin.supplierCode.split(',')}
            }, {
              shopId: Utils.getIgnoreCase(loginShop)
            }]
          }
        }
        Shop.findOne(searchShop, cb)
      }],
      findSupplierCode: ['findShop', function (returnRes, cb) {
        let supplier = returnRes.findAdmin.supplierCode
        if (CGlobal.isEmpty(supplier)) {
          //只有supervisor才会进来,现在除了supervisor的supplierCode会为空外,其他用户基本都不会了
          Shop.distinct('supplierCode', {}, function (err, result) {
            if (err) return cb(err)
            returnRes.findAdmin.supplierCode = result.join(',')
            cb()
          })
        } else {
          cb()
        }
      }]
      // findShopList: ['findShop', function (returnRes, cb) {
      //     let admin = returnRes.findAdmin;
      //     let shopObj = returnRes.findShop;
      //     if (admin.adminType === CGlobal.GlobalStatic.User_Type.SYSTEM) {
      //         let listWhere = {};
      //         if (!CGlobal.isSupervisor(admin)) {
      //             listWhere.supplierCode = {$in: admin.supplierCode.split(',')};
      //         }
      //         Shop.find(listWhere, {_id: 0, shopId: 1, shopName: 1, supplierCode: 1}, cb);
      //     } else if (shopObj) {
      //         let arr = [{
      //             shopId: shopObj.shopId,
      //             shopName: shopObj.shopName,
      //             supplierCode: shopObj.supplierCode
      //         }];
      //         cb(null, arr);
      //     } else {
      //         cb();
      //     }
      // }]
    }, function (err, result) {
      if (err) return reject(err)
      let other = {
        //这里最怕店铺多起来,一个用户能管理的店铺多了,报内存溢出...
        shopId: loginShop || 'SYSTEM',//当前登录的店铺ID
        // shopList: result.findShopList,//该用户能够操作的店铺ID
        selfShop: result.findAdmin.shopId//用户自己的店铺ID
      }
      if (result.findShop) {
        other.shopName = result.findShop.shopName//店铺名
      }
      // let supplier = result.findAdmin.supplierCode;
      // if(CGlobal.isEmpty(supplier)){
      //     //只有supervisor才会进来
      //     let supplierArr = [];
      //     CGlobal.forEach(other.shopList, function (i, value) {
      //         if(CGlobal.inArray(value.supplierCode, supplierArr) === -1){
      //             supplierArr.push(value.supplierCode);
      //         }
      //     });
      //     result.findAdmin.supplierCode = supplierArr.join(',');
      // }
      return resolve({
        admin: result.findAdmin, shop: result.findShop,
        otherInfo: other
      })
    })
  })
}

/**
 * 获取用户能操作的酒店列表
 * 这个应该使用内存缓存来搞
 */
AdminSchema.statics.getOperaShopList = function(session) {
  let listWhere = {}
  if (session.adminType === CGlobal.GlobalStatic.User_Type.SYSTEM) {
    if (!CGlobal.isSupervisor(session)) {
      listWhere.supplierCode = {$in: session.supplierCode.split(',')}
    }
  } else {
    listWhere.shopId = session.shopId
  }
  // console.log(listWhere)
  return new Promise(((resolve, reject) => {
    Shop.find(listWhere, {_id: 0, shopId: 1, shopName: 1, supplierCode: 1}, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  }))
}

/**
 * 通过adminId和shopId查询对应的用户
 * @param adminId
 * @param shopId
 * @param callback
 */
AdminSchema.statics.searchAdmin = function (req, adminId, shopId) {
  if (shopId !== 'SYSTEM') adminId = adminId + '@' + shopId
  return this.loginSystem(req, adminId)
}

/**
 * 通过查询条件分页查询用户
 * @param searchWhere
 * @param session
 * @param cb
 */
AdminSchema.statics.queryAdmins = function (searchWhere, session, cb) {
  let input = searchWhere['input'] || ''
  let where = {
    $or: [], $and: []
  }//查询条件
  CGlobal.forEach(input.split(' '), function (i, v) {
    if (!v) {
      return true
    }//判断如果v是''或者undefined
    where.$or.push({
      adminId: Utils.getIgnoreCase(v, true)
    })
    where.$or.push({
      adminName: Utils.getIgnoreCase(v, true)
    })
    where.$or.push({
      shopId: Utils.getIgnoreCase(v, true)
    })
    where.$or.push({
      email: Utils.getIgnoreCase(v, true)
    })
  })
  if (!CGlobal.isSupervisor(session)) {
    where.$and.push({adminId: {$ne: 'SUPERVISOR'}})
    //如果是系统用户,并且有创建system用户,那么可以查到他自己创建的用户,不能查其他system用户
    if (CGlobal.isPermission(session.rights, CGlobal.Rights.CreateSYSUser.code)) {
      where.$or.push({createUser: session.adminId})
      where.$or.push({shopId: {$in: Utils.getShopIds(session.shopList)}})

      //如果用supplierCode查,会可能查出system的用户,因为他的supplierCode也是一样的,
      //但是店铺ID是system
      // where.$or.push({supplierCode: {$in: session.supplierCode.split(',')}});
    } else {
      where.$and.push({shopId: {$in: Utils.getShopIds(session.shopList)}})
      // where.$and.push({supplierCode: {$in: session.supplierCode.split(',')}});
    }
  }
  //登录的shopId不是SYSTEM
  if (session.shopId !== 'SYSTEM') {
    where.$and.push({shopId: Utils.getIgnoreCase(session.shopId)})
  }
  where.$and.push({adminId: {$ne: session.adminId}})//查不出自己
  let status = searchWhere['status']
  if (status) {
    switch (status) {
      case 'T':
        where.adminStatus = true
        break
      case 'F':
        where.adminStatus = false
        break
    }
  }
  let type = searchWhere['type']
  if (type && type !== 'ALL') {
    where.adminType = type
    if (where.adminType === 'SYSTEM') {
      if (!CGlobal.isPermission(session.rights, CGlobal.Rights.CreateSYSUser.code)
          || session.shopId !== 'SYSTEM') {
        where.adminType = 'F'//随便给个值查不出数据罢了
      }
    }
  }
  if (where.$or.length === 0) delete where.$or
  //如果没有用户权限查不到数据
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.UserSetup.code)) {
    where.$and.push({adminId: '$$$'})//就是让它查不到数据
  }
  let offset = searchWhere['offset']
  let pageSize = searchWhere['pageSize']
  let sortOrder = searchWhere['sortOrder']
  let fields = {password: 0, loginTime: 0, rights: 0, usedPws: 0}
  dao.getPageQuery('Admin', where, fields, sortOrder, offset, pageSize, cb)
}

/**
 * 修改用户的状态
 * @private
 */
AdminSchema.statics._changeStatus = function (id, status, session, cb) {
  if (typeof status !== 'boolean') {
    return cb({message: CGlobal.serverLang('状态值类型不能为:{0}', typeof status)})
  }
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.ChangeUserStatus.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  this.findByIdAndUpdate(id, {$set: {adminStatus: status}}, function (err, oldUser) {
    if (err) return cb(err)
    AdminLog.createLog({
      userName: session.adminId,
      content: CGlobal.serverLang('修改 {0} 的状态为{1}', oldUser.adminId, status),
      shopId: oldUser.shopId,
      type: CGlobal.GlobalStatic.Log_Type.USER
    }, session, function (err) {
      if (err) console.error(err)
    })
    cb()
  })
}

AdminSchema.statics.changeStatusById = function (id, status, session, cb) {
  let that = this
  this.findBy_Id(id, session, function (err) {
    if (err) return cb(err)
    that._changeStatus(id, status, session, cb)
  })
}

AdminSchema.statics.changeStatusByName = function (adminId, shopId, status, session, cb) {
  let that = this
  this.findByName(adminId, shopId, session, function (err, user) {
    if (err) return cb(err)
    that._changeStatus(user._id + '', status, session, cb)
  })
}

AdminSchema.statics.createAdminUser = function (data, session, cb) {
  //删除敏感字段
  delete data.id
  delete data.password
  let that = this
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.UserSetup.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  this.checkAdminUserInfo(data, session, function (err) {
    if (err) return cb(err)
    that.create(data, function (err, adminUser) {
      if (err) return cb(err)
      AdminLog.createLog({
        userName: session.adminId,
        content: CGlobal.serverLang('创建 {0} 用户', adminUser.adminId),
        shopId: adminUser.shopId,
        type: CGlobal.GlobalStatic.Log_Type.USER
      }, session, function (err) {
        if (err) console.error(err)
      })
      //TODO 创建成功用户后应该发一封邮件让他改密码,并且改密码是有有效期的
      cb(null, {adminId: adminUser._id})
    })
  })
}

AdminSchema.statics.checkAdminUserInfo = function (data, session, cb) {
  let adminId = data.adminId
  let adminName = data.adminName
  let adminType = data.adminType
  let shopId = data.shopId
  let rights = data.rights
  let email = data.email
  let adminStatus = data.adminStatus
  let supplierCode = data.supplierCode
  let _id = data.id

  if (!shopId) {
    return cb({message: CGlobal.serverLang('请输入{0}', CGlobal.serverLang('店铺ID'))})
  }
  //这里多个判断,如果管理员@shopId进来的,不能创建其他shopId的用户,就算他有权限也不能
  let isSYS = session.shopId === 'SYSTEM'
  if (!isSYS && shopId !== session.shopId) {
    return cb({message: CGlobal.serverLang('无法创建 {0} 店铺的用户', shopId)})
  }
  if (!adminId) {
    return cb({message: CGlobal.serverLang('请输入{0}', CGlobal.serverLang('用户ID'))})
  }
  if (!adminName) {
    return cb({message: CGlobal.serverLang('请输入{0}', CGlobal.serverLang('用户名'))})
  }
  if (!_id && !adminType) {
    //如果没有用户类型,默认普通用户
    adminType = CGlobal.GlobalStatic.User_Type.NORMAL
  }
  if (!rights) {
    return cb({message: CGlobal.serverLang('请输入{0}', CGlobal.serverLang('权限'))})
  }
  if (!email) {
    return cb({message: CGlobal.serverLang('请输入{0}', CGlobal.serverLang('邮箱地址'))})
  }
  if (adminStatus == null || typeof adminStatus !== 'boolean') {
    adminStatus = false
  }
  if (!email.match(CGlobal.GlobalStatic.mailExp)) {
    return cb({message: CGlobal.serverLang('邮箱格式不正确!')})
  }
  if (shopId === 'system') {
    //避免大小写问题
    shopId = 'SYSTEM'
    data.shopId = shopId
  }
  if (adminType === CGlobal.GlobalStatic.User_Type.SYSTEM) {
    shopId = 'SYSTEM'
  } else if (adminType === CGlobal.GlobalStatic.User_Type.THIRD) {
    if (!CGlobal.isPermission(session.rights, CGlobal.Rights.CreateIFCUser.code)) {
      return cb({message: '抱歉,你没有权限创建接口用户!'})
    }
  }
  if (shopId === 'SYSTEM') {
    //如果店铺ID是system的,需要判断该用户是否有这个权限建这样的用户
    if (!CGlobal.isPermission(session.rights, CGlobal.Rights.CreateSYSUser.code)) {
      return cb({message: '抱歉,你没有权限创建SYSTEM用户!'})
    }
    if (adminType === CGlobal.GlobalStatic.User_Type.NORMAL) {
      adminType = CGlobal.GlobalStatic.User_Type.SYSTEM
    }
    //这里注意,如果店铺ID是system的话,那么用户类型不能是普通用户了,只能是系统用户或者接口用户
    //如果用户类型是系统用户,那么店铺ID一定是system
  }
  //判断权限是否合法,不能建超权限的用户
  if (!rights.match(CGlobal.GlobalStatic.rightsExp)) {
    return cb({message: CGlobal.serverLang('权限格式不正确!')})
  }
  let rightsArr = rights.split(',')
  let rightsData = session.rights === 'ALL' ? CGlobal.getAllRights() : session.rights.split(',')
  for (let i = 0; i < rightsArr.length; i++) {
    let value = rightsArr[i]
    if (CGlobal.inArray(value, rightsData) === -1) {
      return cb({message: CGlobal.serverLang('{0} 权限非法设置.', value)})
    }
  }
  let that = this
  async.auto({
    isExistShop: function (callback) {
      Shop.isExistShop(shopId, callback)
    },
    isExistAdminId: ['isExistShop', function (shopResult, callback) {
      that.isExistAdminId(_id, adminId, shopId, callback)
    }],
    isExistEmail: ['isExistAdminId', function (adminIdResult, callback) {
      that.isExistEmail(_id, email, callback)
    }],
    getShopInfo: ['isExistEmail', function (emailResult, callback) {
      //这里需要判断supplierCode,不能让他建出超出自己管理范围的店铺
      let ssc = session.supplierCode
      if (shopId === 'SYSTEM') {
        if (ssc === '') {
          //supplierCode如果是'',那么可以管理所有的店铺,不管你填什么supplierCode
          //如果填错了也没办法了
          //2018.10.19 现在supplierCode不可能为空了
          data.supplierCode = ''
          return callback()
        }
        if (!supplierCode) {
          //用户如果没填supplierCode,那么默认Default的算了
          //懒得想各种逻辑了
          data.supplierCode = 'Default'
          return callback()
        }
        let tempCode = supplierCode.split(',')
        let msg = null
        CGlobal.forEach(tempCode, function (k, v) {
          if (ssc.indexOf(v) === -1) {
            msg = {message: CGlobal.serverLang('无效的 {0} 集团代码', v)}
            return false
          }
        })
        return callback(msg)
      }

      Shop.getShopInfo(shopId, function (err, shopInfo) {
        if (err) return callback(err)
        if (ssc !== '' && ssc.indexOf(shopInfo.supplierCode) === -1) {
          return callback({
            message: CGlobal.serverLang('无效的 {0} 集团代码'
                , supplierCode || shopInfo.supplierCode)
          })
        }
        data.supplierCode = shopInfo.supplierCode
        callback()
      })
    }]
  }, function (err) {
    data.shopId = shopId
    data.adminType = adminType
    data.adminStatus = adminStatus
    if (!_id) {
      data.password = Utils.sha256('123456abc')
      //新增创建人节点
      data.createUser = session.adminId
    }
    cb(err)
  })
}

/**
 * 是否存在这个用户名
 */
AdminSchema.statics.isExistAdminId = function (_id, adminId, shopId, cb) {
  let where = {
    adminId: Utils.getIgnoreCase(adminId),
    shopId: Utils.getIgnoreCase(shopId)
  }
  if (shopId === 'SYSTEM') {
    //如果是系统用户,adminId必须唯一
    delete where.shopId
  }
  if (_id) {
    where._id = {$ne: _id}
  }
  this.count(where, function (err, count) {
    if (err) return cb(err)
    if (count > 0) return cb({message: CGlobal.serverLang('{0} 用户ID, {1} 店铺ID已存在', adminId, shopId)})
    cb()
  })
}

/**
 * 是否存在这个邮箱地址
 */
AdminSchema.statics.isExistEmail = function (_id, email, cb) {
  let where = {
    email: email
  }
  if (_id) {
    where._id = {$ne: _id}
  }
  this.count(where, function (err, count) {
    if (err) return cb(err)
    if (count > 0) return cb({message: CGlobal.serverLang('{0} 邮箱已存在', email)})
    cb()
  })
}

AdminSchema.statics.deleteAdminUser = function (id, session, cb) {
  let that = this
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.DeleteSYSUser.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  this.findBy_Id(id, session, function (err, user) {
    if (err) return cb(err)
    that.remove({_id: id}, function (err) {
      if (err) return cb(err)
      AdminLog.createLog({
        userName: session.adminId,
        content: CGlobal.serverLang('删除 {0} 用户', user.adminId),
        shopId: user.shopId,
        type: CGlobal.GlobalStatic.Log_Type.USER
      }, session, function (err) {
        if (err) console.error(err)
      })
      cb()
    })
  })
}

AdminSchema.statics.modifyAdminUser = function (data, session, cb) {
  let that = this
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.UserSetup.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  if (!Utils.isMongoId(data.id)) {
    return cb({message: '无效的id值'})
  }
  async.auto({
    find: function (callback) {
      that.findBy_Id(data.id, session, function (err, user) {
        if (err) return callback(err)
        //这里先查user,再检查字段,因为有些字段不能修改的,避免有篡改
        let shopId = user.shopId
        data.shopId = shopId//店铺ID不能修改
        //店铺ID是SYSTEM的话,用户类型可以是系统的或者接口的,但是不能是普通用户
        let b1 = shopId === 'SYSTEM' && data.adminType === CGlobal.GlobalStatic.User_Type.NORMAL
        //店铺ID不是SYSTEM的话,用户类型不能是系统用户
        let b2 = shopId !== 'SYSTEM' && data.adminType === CGlobal.GlobalStatic.User_Type.SYSTEM
        if (b1 || b2) {
          data.adminType = user.adminType
        }
        callback(null, user)
      })
    },
    check: ['find', function (findResult, callback) {
      that.checkAdminUserInfo(data, session, callback)
    }],
    modify: ['check', function (checkResult, callback) {
      let setData = {
        adminId: data.adminId,
        adminName: data.adminName,
        adminType: data.adminType,
        rights: data.rights,
        email: data.email,
        adminStatus: data.adminStatus,
        supplierCode: data.supplierCode
      }
      that.update({_id: data.id}, {$set: setData}, function (err) {
        contrastUser(setData, checkResult.find, session)
        callback(err)
      })
    }]
  }, function (err) {
    if (err) return cb(err)
    cb(null, {adminId: data.id})
  })
}

function contrastUser(newUser, oldUser, session) {
  let content = []
  //对照表
  let chart = {
    adminId: '用户ID',
    adminName: '用户名',
    adminType: '用户类型',
    rights: '权限',
    email: '邮箱地址',
    adminStatus: '用户状态',
    supplierCode: '集团代码'
  }

  CGlobal.forEach(chart, function (key, value) {
    if (newUser[key] !== oldUser[key]) {
      let b1 = typeof newUser[key] === 'boolean'
      let b2 = typeof oldUser[key] === 'boolean'
      content.push(CGlobal.replaceArgs('{0}:{1}->{2}.'
          , CGlobal.serverLang(value)
          , b1 ? oldUser[key] : oldUser[key] || 'null'
          , b2 ? newUser[key] : newUser[key] || 'null'))
    }
  })

  if (content.length !== 0) {
    content.unshift(CGlobal.serverLang('编辑 {0} 用户:', oldUser.adminId))//在数组开头插入一个元素
    AdminLog.createLog({
      userName: session.adminId,
      content: content.join('<br>'),
      shopId: oldUser.shopId,
      type: CGlobal.GlobalStatic.Log_Type.USER
    }, session, function (err) {
      if (err) console.error(err)
    })
  }
}

AdminSchema.statics.setupPws = function (data, session, cb) {
  let that = this
  let id = data.id
  let pws = data.pws
  if (!Utils.isMongoId(id)) {
    return cb({message: '无效的id值'})
  }
  if (!pws) {
    return cb({message: '密码不能为空'})
  }
  if (!Utils.isSha256(pws)) {
    return cb({message: '密码加密算法错误'})
  }
  if (!CGlobal.isPermission(session.rights, CGlobal.Rights.UserSetup.code)
      || !CGlobal.isPermission(session.rights, CGlobal.Rights.ChangeUserPws.code)) {
    return cb({message: '抱歉,你没有权限访问!'})
  }
  //TODO 缺少开参数校验复杂密码
  async.auto({
    find: function (callback) {
      that.findById(id, function (err, user) {
        if (err) return cb(err)
        that._errorSearchHandler(user, session, callback)
      })
    },
    setup: ['find', function (findResult, callback) {
      let user = findResult.find//user对象
      let usedPws = user.usedPws//用户使用过的密码
      if (CGlobal.inArray(pws, usedPws) !== -1) {
        return callback({message: '该密码已被使用过'})
      }
      usedPws.push(pws)
      if (usedPws.length > 3) {
        usedPws.splice(0, 1)
      }
      let setData = {
        password: pws,
        usedPws: usedPws
      }
      that.update({_id: id}, {$set: setData}, function (err) {
        if (err) return callback(err)
        setUpPwsLog(user, session)
        callback()
      })
    }]
  }, function (err) {
    if (err) return cb(err)
    cb()
  })
}

//写修改密码log
function setUpPwsLog(user, session) {
  AdminLog.createLog({
    userName: session.adminId,
    content: CGlobal.serverLang('设置 {0} 用户的密码', user.adminId),
    shopId: user.shopId,
    type: CGlobal.GlobalStatic.Log_Type.USER
  }, session, function (err) {
    if (err) console.error(err)
  })
  //TODO 这里还有发邮件告知该用户你的密码已被修改
}

// 这里是内部获取用户信息方法
AdminSchema.statics._getAdminInfo = function (adminId, shopId, field = {rights: 1}) {
  return new Promise(((resolve, reject) => {
    this.findOne({adminId: adminId, shopId: shopId}, field, function (err, user) {
      if (err) {
        return reject(err)
      }
      resolve(user)
    })
  }))
}

conn.model('Admin', AdminSchema)
module.exports = conn.model('Admin')
