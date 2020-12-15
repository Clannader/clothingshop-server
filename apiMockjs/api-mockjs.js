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
    this.mockData = {}
    this.allMockData = []
  }

  /**
   * 目前暂时写对于ds-h5的swagger的json格式的解析
   * @return {Promise<void>}
   */
  async start() {
    const modules = this.findModules()
    const modulesFileData = await createEjsApiFile({modules}, 'index').then(data => data)
    fs.writeFileSync(indexPath, modulesFileData)

    // 循环创建并覆盖文件
    for (const fileName in this.mockData) {
      const fileData = await createEjsApiFile(this.mockData[fileName], 'module').then(data => data)
      fs.writeFileSync(`${apiPath}/${fileName}.js`, fileData)
    }
  }

  /**
   * 找出所有模块出来
   */
  findModules() {
    const paths = this.swaggerJSON.paths // paths节点
    const modules = []
    for (const path in paths) {
      if (path.match(/\/(\w+)\/(\w+)\/?((\w+))?/g)) {
        let group = RegExp.$2
        let method = RegExp.$3
        if (!method) {
          group = RegExp.$1
          method = RegExp.$2
        }
        if (!this.mockData.hasOwnProperty(group)) {
          modules.push(group)
          this.mockData[group] = {
            fetchArr: []
          }
        }
        for (const fetch in paths[path]) {
          let fetchObj = {
            url: path,
            type: fetch,
            response: this.getDefinitions(paths[path][fetch]['responses']['200']['schema']['$ref']) // ref对应响应的结构
          }
          fetchObj.response = JSON.stringify(fetchObj.response)
          this.mockData[group].fetchArr.push(fetchObj)
          this.allMockData.push(fetchObj)
        }
      }
    }

    return modules
  }

  getDefinitions($ref) {
    const nameRef = $ref.replace('#/definitions/', '')
    const valueRef = this.swaggerJSON['definitions'][nameRef]
    const properties = valueRef['properties']
    const resp = {}
    const arr = ['菜单对象', 'SelectDataNode']
    if (arr.includes(nameRef)) {
      return {}
    }
    for (const key in properties) {
      resp[key] = this.getProperties(properties[key])
    }
    return resp
  }

  getProperties($pro) {
    const type = $pro['type'] || 'object'
    let value = 'string'
    switch (type) {
      case 'string':
        if ($pro.hasOwnProperty('example')) {
          value = $pro['example']
        }
        break
      case 'integer':
      case 'number':
        if ($pro.hasOwnProperty('example')) {
          value = $pro['example']
        } else {
          value = 1
        }
        break
      case 'array':
        value = []
        if ($pro['items'].hasOwnProperty('$ref')) {
          value.push(this.getDefinitions($pro['items']['$ref']))
        } else {
          const arrType = $pro['items']['type']

          switch (arrType) {
            case 'number':
            case 'integer':
              value.push(0)
              break
            default:
              value.push('string')
          }
        }
        break
      case 'object':
        if ($pro.hasOwnProperty('$ref')) {
          value = this.getDefinitions($pro['$ref'])
        } else {
          value = {}
        }
        break
    }
    return value
  }
}

const mockApp = new ApiMockjs()
mockApp.start()

// var reg=/(\w+)-(\w+)-(\w+)-(\w+)/
// reg.exec('My-name-is-Lucy!')
// console.log(RegExp.$_)  //"My-name-is-Lucy!"
// console.log(RegExp.$1)  //"My"
// console.log(RegExp.$2)  //"name"
// console.log(RegExp.$3)  //"is"
// console.log(RegExp.$4)  //"Lucy!"

// if("2009-12-17".match(/(\d{4})-(\d+)-(\d+)/)) {
//   alert(RegExp.$1 + '年' + RegExp.$2 + '月' + RegExp.$3 + '日');
// }});
// $1是第一个()里面的内容，$2是第二个()里面的内容，$3是第三个()里面的内容。以此类推
