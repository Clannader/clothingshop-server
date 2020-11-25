/**
 * Create by CC on 2020/11/23
 * 给vue项目通过swagger专门生成api调用的一个小工具
 */
'use strict'

const fs = require('fs')
const axios = require('axios')
const ejs = require('ejs')
const moment = require('moment')
const apiPath = __dirname + '/api'

if (!fs.existsSync(apiPath)) {
  fs.mkdirSync(apiPath)
}

const apiHost = 'https://cambridge-api.shijicloud.com/CambridgeAPI'

const service = axios.create({
  baseURL: apiHost,
  timeout: 30000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  }
})

// 添加响应拦截器
service.interceptors.response.use(
    response => {
      return response.data
    },
    error => {
      return Promise.reject(error)
    }
)

const apiResource = function () {
  return service.get('/swagger-resources', {})
}

const createEjsApiFile = function (ejsData) {
  return new Promise(((resolve, reject) => {
    ejs.renderFile(
        __dirname + '/template/js.ejs',
        ejsData,
        (err, data) => {
          if (err) {
            return reject(err)
          }
          resolve(data)
        }
    )
  }))
}

const createApiFile = async function (resource) {
  const groupPath = `${apiPath}/${resource.name}`
  if (!fs.existsSync(groupPath)) {
    fs.mkdirSync(groupPath)
  }
  const swaggerDocument = await service.get(resource.url, {}).then(res => res).catch(() => null)
  if (!swaggerDocument) {
    return
  }
  const ejsData = {
    author: 'Oliver',
    createData: moment().format('YYYY-MM-DD')
  }
  const swaggerPaths = swaggerDocument.paths
  const swaggerTags = swaggerDocument.tags
  const apiFileTags = {}
  swaggerTags.map(tags => {
    const tagName = tags.name.replace(/ /g, '_')
    apiFileTags[tagName] = {
      urls: [],
      apiFilePath: `${groupPath}/${tagName}.js`,
      ...ejsData
    }
  })
  for (let url in swaggerPaths) {
    const methodValue = swaggerPaths[url]
    for (const method in methodValue) {
      const pathValue = methodValue[method]
      const tagName = pathValue.tags[0].replace(/ /g, '_')
      let isReplace = false
      let pathParams = ''
      url = url.replace(/\{[\w]+\}/g, function (match) {
        isReplace = true
        pathParams = match.substring(1, match.length - 1)
        return `$${match}`
      })
      const urlSchema = {
        description: pathValue.description,
        functionName: pathValue.operationId,
        url: isReplace ? '`' + url + '`' : url,
        isReplace: isReplace,
        pathParams: pathParams,
        method: method
      }
      apiFileTags[tagName].urls.push(urlSchema)
    }
  }
  for (const tags in apiFileTags) {
    const tagsValue = apiFileTags[tags]
    const fileData = await createEjsApiFile(tagsValue).then(data => data)
    fs.writeFileSync(tagsValue.apiFilePath, fileData)
  }
}

const start = async function () {
  const resource = await apiResource().then(res => res).catch(() => null)
  if (!resource) return
  resource.map(v => {
    createApiFile(v)
  })
}
start()





