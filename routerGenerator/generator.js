/**
 * 这个是一个把express框架注册的路由统计出来的方法
 * 需要加一行代码作为前提
 * modules->express框架->layer.js->45行添加this.orgPath = path
 */
const routerJson = require('./router.json')

const data = []
data.push(['路由地址', '匹配正则'])// 表头

routerJson.forEach(r => {
  if (r.children) {
    r.children.forEach(c => {
      data.push([r.orgPath === '/' ? c.orgPath : r.orgPath + c.orgPath, c.regexp])
    })
  }
})

const xlsx = require('xlsx')
const ws = xlsx.utils.aoa_to_sheet(data)
ws['!cols'] = [
  {
    wpx: 350 // 路由地址
  },
  {
    wpx: 350 // 匹配正则
  }
]
const wb = xlsx.utils.book_new()
xlsx.utils.book_append_sheet(wb, ws, 'SheetJS')
const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx'})
const fs = require('fs')
fs.writeFileSync('路由汇总表.xlsx', buffer)
