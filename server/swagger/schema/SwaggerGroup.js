/**
 * Create by CC on 2020/11/24
 */
'use strict'

const SwaggerGroupInfo = require('./SwaggerGroupInfo')

class SwaggerGroup {
  constructor() {
    this.swagger = '2.0'
    this.basePath = '/'
    this.info = new SwaggerGroupInfo()
    this.host = 'localhost:3000'
    this.tags = []
    this.paths = {}
    this.definitions = {}
  }

  setTags(tag) {
    this.tags.push(tag)
  }

  setDefinitions(def) {
    const defTemp = {}
    defTemp[def.constructor.name] = def
    this.definitions = {
      ...this.definitions,
      ...defTemp
    }
  }

  getSchemaList(controller) {
    const map = []
    controller.parameters.map(value => {
      const ref = value.schema.$ref
      if (ref) {
        const objectName = ref.substring(ref.lastIndexOf('/') + 1)
        map.push(objectName)
      }
    })
    CGlobal.forEach(controller.responses, (key, value) => {
      if (value.schema && value.schema.$ref) {
        const ref = value.schema.$ref
        const objectName = ref.substring(ref.lastIndexOf('/') + 1)
        map.push(objectName)
      }
    })
    return map
  }
}

module.exports = SwaggerGroup
