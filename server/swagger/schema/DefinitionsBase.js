/**
 * Create by CC on 2020/11/25
 */
'use strict'

class DefinitionsBase {
  constructor() {
    this.type = 'object'
    this.title = this.constructor.name
    this.required = []
    this.properties = {}
  }

  initRequired() {
    for (const pro in this.properties) {
      if (!CGlobal.isEmpty(this.properties[pro]) && this.properties[pro].required) {
        this.required.push(pro)
      }
    }
  }

  setProperties(){
    const proNames = Object.getOwnPropertyNames(this)
    const exInclude = ['type', 'title', 'required', 'properties']
    proNames.forEach(v => {
      if (exInclude.indexOf(v) === -1) {
        this.properties[v] = this[v]
      }
    })
  }
}

module.exports = DefinitionsBase
