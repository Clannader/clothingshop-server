/**
 * Create by CC on 2018/11/21
 */
'use strict'

console.log('require h5_user_route')
let express = require('express')
let app = express.Router()
let cmsUserService = require('../../h5/CmsUserService')

app.post('/search', cmsUserService.getUsersList)
app.post('/removeUser/:id', cmsUserService.deleteUser)
app.post('/createUser', cmsUserService.createUser)
app.post('/modifyUser', cmsUserService.modifyUser)
app.post('/getUserById', cmsUserService.getUserById)
app.post('/changeStatus', cmsUserService.changeStatus)//改变用户状态
app.post('/changePassword', cmsUserService.changePassword)
app.post('/setupPws', cmsUserService.setupPws)//设置密码
app.post('/roles', cmsUserService.getUserRoles)//获取用户权限

module.exports = app
