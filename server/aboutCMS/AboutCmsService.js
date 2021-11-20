/**
 * Created by CC on 2017/5/6.
 */
'use strict'
console.log('require AboutCmsService')
const Utils = require('../util/Utils')
const setUpCache = require('../util/cache/SetUpCache')
// const HttpClient = require('../http/HttpClient')
const fs = require('fs')
const db = require('../dao/daoConnection')
const Admin = db.getEntity('Admin')
const ejs = require('ejs')

const AboutCmsService = {
  aboutCms(req, res) {
    /**
     * 测试缓存类是否有效
     */
    let setup = setUpCache.getCacheAboutCMS()
    return res.send(CGlobal.extend({code: 100}, setup))
  },
  gotoIndex(req, res) {
    return res.render('index')
  },
  testLang(req, res) {
    /**
     * 测试语言类型是否能全局初始化,发现不可以,放弃
     */
    console.log(req.lang)
    if (req.lang === 'EN') {
      setTimeout(() => {
        return res.send({lang: req.lang, code: 100})
      }, 1000)
    } else {
      process.nextTick(() => {
        return res.send({lang: req.lang, code: 100})
      })
    }
  },
  getAppVersion(req, res) {
    // 这里也不知道为什么加了这个接口,感觉没什么用
    return res.send({code: 100, version: Utils.readConfig('version')})
  },
  gotoNaReport(req, res) {
    // const url = 'https://cambridge-dev.shijicloud.com/CambridgeAPI'
    // req.headers['credential'] = '1594134902480604'
    // const http = new HttpClient(url, req.headers)
    // http.setPath('/api/na/statistic/report/print_with_condition')
    // http.post(req.body, (err, result) => {
    // 为了测试Cambridge的PDF文件预览
    const data = {
      "code": 1000,
      "pdf": "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fw4KZW5kc3RyZWFtCmVuZG9iagoxIDAgb2JqPDwvQ29udGVudHMgNCAwIFIvVHlwZS9QYWdlL1Jlc291cmNlczw8L1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldL0ZvbnQ8PC9GMSAyIDAgUi9GMiAzIDAgUj4+Pj4vUGFyZW50IDUgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXT4+CmVuZG9iago2IDAgb2JqWzEgMCBSL1hZWiAwIDg1NCAwXQplbmRvYmoKMiAwIG9iajw8L1N1YnR5cGUvVHlwZTEvVHlwZS9Gb250L0Jhc2VGb250L0hlbHZldGljYS9FbmNvZGluZy9XaW5BbnNpRW5jb2Rpbmc+PgplbmRvYmoKNyAwIG9iajw8L0Rlc2NlbnQgLTEyMC9DYXBIZWlnaHQgODgwL1N0ZW1WIDkzL1R5cGUvRm9udERlc2NyaXB0b3IvRmxhZ3MgNi9TdHlsZTw8L1Bhbm9zZSgBBQICBAAAAAAAAAApPj4vRm9udEJCb3ggWy0yNSAtMjU0IDEwMDAgODgwXS9Gb250TmFtZS9TVFNvbmctTGlnaHQvSXRhbGljQW5nbGUgMC9Bc2NlbnQgODgwPj4KZW5kb2JqCjggMCBvYmo8PC9EVyAxMDAwL1N1YnR5cGUvQ0lERm9udFR5cGUwL0NJRFN5c3RlbUluZm88PC9TdXBwbGVtZW50IDQvUmVnaXN0cnkoQWRvYmUpL09yZGVyaW5nKEdCMSk+Pi9UeXBlL0ZvbnQvQmFzZUZvbnQvU1RTb25nLUxpZ2h0L0ZvbnREZXNjcmlwdG9yIDcgMCBSL1cgWzFbMjA3XTdbNzEwXTExWzQyM10xM1syMzggMzc1IDIzOF0xNyAyNiA0NjIgMjdbMjM4XTMwIDMxIDYwNSAzNFs2ODQgNTYwIDY5NSA3MzkgNTYzIDUxMSA3MjkgNzkzIDMxOCAzMTIgNjY2IDUyNiA4OTYgNzU4IDc3MiA1NDRdNTFbNjI4IDQ2NSA2MDcgNzUzIDcxMSA5NzJdNThbNjIwXTY0WzUwMF02Nls0MTcgNTAzXTY5WzUyOSA0MTVdNzJbNDQ0XTc0WzI0MV03N1syMjggNzkzXTgwWzUyNF04M1szMzhdODVbMjc3XTkwWzQ1Ml1dPj4KZW5kb2JqCjMgMCBvYmo8PC9TdWJ0eXBlL1R5cGUwL1R5cGUvRm9udC9CYXNlRm9udC9TVFNvbmctTGlnaHQtVW5pR0ItVUNTMi1IL0VuY29kaW5nL1VuaUdCLVVDUzItSC9EZXNjZW5kYW50Rm9udHNbOCAwIFJdPj4KZW5kb2JqCjUgMCBvYmo8PC9LaWRzWzEgMCBSXS9UeXBlL1BhZ2VzL0NvdW50IDE+PgplbmRvYmoKOSAwIG9iajw8L05hbWVzWyhKUl9QQUdFX0FOQ0hPUl8wXzEpIDYgMCBSXT4+CmVuZG9iagoxMCAwIG9iajw8L0Rlc3RzIDkgMCBSPj4KZW5kb2JqCjExIDAgb2JqPDwvTmFtZXMgMTAgMCBSL1R5cGUvQ2F0YWxvZy9QYWdlcyA1IDAgUj4+CmVuZG9iagoxMiAwIG9iajw8L01vZERhdGUoRDoyMDIwMDcwODIyMDQwMSswOCcwMCcpL0NyZWF0b3IoSmFzcGVyUmVwb3J0cyBcKEVfUkFURURBXCkpL0NyZWF0aW9uRGF0ZShEOjIwMjAwNzA4MjIwNDAxKzA4JzAwJykvUHJvZHVjZXIoaVRleHQxLjMuMSBieSBsb3dhZ2llLmNvbSBcKGJhc2VkIG9uIGl0ZXh0LXBhdWxvLTE1NFwpKT4+CmVuZG9iagp4cmVmCjAgMTMKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAzNjIwIDAwMDAwIG4gCjAwMDAwMDM4MTkgMDAwMDAgbiAKMDAwMDAwNDUwNyAwMDAwMCBuIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDQ2MzAgMDAwMDAgbiAKMDAwMDAwMzc4NSAwMDAwMCBuIAowMDAwMDAzOTA2IDAwMDAwIG4gCjAwMDAwMDQwOTYgMDAwMDAgbiAKMDAwMDAwNDY4MCAwMDAwMCBuIAowMDAwMDA0NzMzIDAwMDAwIG4gCjAwMDAwMDQ3NjUgMDAwMDAgbiAKMDAwMDAwNDgyMyAwMDAwMCBuIAp0cmFpbGVyCjw8L0luZm8gMTIgMCBSL0lEIFs8NTczNmJkMzkxMDZjMjJmMmY4NGRiY2Y3YzNlOGIxNGE+PDU3MzZiZDM5MTA2YzIyZjJmODRkYmNmN2MzZThiMTRhPl0vUm9vdCAxMSAwIFIvU2l6ZSAxMz4+CnN0YXJ0eHJlZgo1MDE1CiUlRU9GCg=="
    }
    res.send(data)
    // })
  },
  gotoWord(req, res) {
    // 测试word文件预览问题
    fs.readFile(__dirname + '/../../public/video/1.docx', function (err, text) {
      if (err) return res.send({code: 999, msg: err.message})
      res.send({code: 100, text: text})
    })
  },
  testDeleteSupervisor(req, res) {
    const content = fs.readFileSync(process.env.BASE_PATH + 'template/template.ejs')
    console.log(ejs.render(content.toString(), {
      options: {
        show: true,
        show2: true
      }
    }))
    Admin.deleteOne({
      adminId: 'SUPERVISOR'
    }, (err, result) => {
      res.send({code: 1})
    })
  }
}

module.exports = AboutCmsService
