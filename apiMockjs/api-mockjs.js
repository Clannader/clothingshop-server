/**
 * Create by CC on 2020/12/12
 */
'use strict'

const fs = require('fs')
const ejs = require('ejs')
const apiPath = __dirname + '/api' // 生成代码存放的目录
const indexPath = apiPath + '/index.js'

if (!fs.existsSync(apiPath)) {
  fs.mkdirSync(apiPath)
}

const createEjsApiFile = function (ejsData, templateName) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(
      __dirname + `/template/${templateName}.ejs`,
      ejsData,
      (err, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data)
      }
    )
  })
}

// 暂时使用静态的json数据
const swaggerJSON = require('./ds-h5-swagger.json')

class ApiMockjs {
  constructor() {
    this.swaggerJSON = swaggerJSON
  }

  /**
   * 目前暂时写对于ds-h5的swagger的json格式的解析
   * @return {Promise<void>}
   */
  async start() {
    const modules = this.findModules()
    const modulesFileData = await createEjsApiFile({ modules }, 'index').then(data => data)
    fs.writeFileSync(indexPath, modulesFileData)
  }

  /**
   * 找出所有模块出来
   */
  findModules() {
    const paths = this.swaggerJSON.paths // paths节点
    for (const path in paths) {
      console.log(path)
    }

    return ['asd', 'dsd', 'fdsf']
  }
}

const mockApp = new ApiMockjs()
mockApp.start()
