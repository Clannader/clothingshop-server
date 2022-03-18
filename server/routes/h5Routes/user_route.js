/**
 * Create by CC on 2018/11/21
 */
'use strict'

console.log('require h5_user_route')
let express = require('express')
let app = express.Router()
let cmsUserService = require('../../h5/CmsUserService')

app.post('/cms/h5/api/user/search', cmsUserService.getUsersList)
app.post('/cms/h5/api/user/removeUser/:id', cmsUserService.deleteUser)
app.post('/cms/h5/api/user/createUser', cmsUserService.createUser)
app.post('/cms/h5/api/user/modifyUser', cmsUserService.modifyUser)
app.post('/cms/h5/api/user/getUserById', cmsUserService.getUserById)
app.post('/cms/h5/api/user/changeStatus', cmsUserService.changeStatus)//改变用户状态
app.post('/cms/h5/api/user/changePassword', cmsUserService.changePassword)
app.post('/cms/h5/api/user/setupPws', cmsUserService.setupPws)//设置密码
app.post('/cms/h5/api/user/roles', cmsUserService.getUserRoles)//获取用户权限

module.exports = app
