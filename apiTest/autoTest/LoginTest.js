/**
 * Create by CC on 2021/10/19
 */
'use strict'
const axios = require('axios')
const https = require('https')
const headers = {
  'content-type': 'application/json',
  'x-requested-with': 'XMLHttpRequest'
}
const domainUrl = 'http://localhost:4000/cms/h5'
const axiosConfig = {
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  timeout: 60 * 1000,
  headers: headers,
  url: '',
  method: 'post',
  data: {}
}
// 代理设置
// axiosConfig.proxy = {
//   host: '10.3.5.33',
//   port: '8888',
//   auth: {
//     username: 'admin',
//     password: 'admin'
//   }
// }
// axios(axiosConfig).then(resp => {
//   console.log(resp.data)
// }).catch(err => {
//   console.log(err)
// })

class LoginTest {
  async createSupervisor() {
    // 当数据库没有任何用户时,使用SUPERVISOR可以登录
    // 首先先删除supervisor
    await this.deleteSupervisor()
    const resp = await this.loginSystem({
      adminId: 'supervisor',
      adminPws: '043a718774c572bd8a25adbeb1bfcd5c0256ae11cecf9f9c3f925d0e52beaf89'
    })
    if (resp.code === 100) {
      console.log('测试supervisor首次登录成功')
    } else {
      console.log('createSupervisor失败')
    }
  }
  async deleteSupervisor() {
    axiosConfig.url = `${domainUrl}/test/deleteSupervisor`
    axiosConfig.data = {}
    const result = await axios(axiosConfig).then(resp => {
      return resp.data
    }).catch(err => {
      console.log(err)
      return {}
    })
    return Promise.resolve(result)
  }
  async loginSystem(params) {
    axiosConfig.url = `${domainUrl}/api/user/login`
    axiosConfig.data = params
    const result = await axios(axiosConfig).then(resp => {
      return resp.data
    }).catch(err => {
      console.log(err)
      return {}
    })
    return Promise.resolve(result)
  }
  async doTest() {
    await this.createSupervisor()
  }
}

const test = new LoginTest()
test.doTest()
