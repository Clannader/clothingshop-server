const inquirer = require('inquirer')
const shell = require('shell')

const promiseQuestion = function (promptList) {
  return new Promise(resolve => {
    inquirer.prompt(promptList).then(resp => {
      resolve(resp)
    }).catch(err => {
      console.error(err)
      resolve()
    })
  })
}

const choicesType = function () {
  const promptList = [
    {
      type: 'list',
      message: '选择你要的操作',
      name: 'type',
      choices: ['Import', 'Export']
    }
  ]
  return promiseQuestion(promptList)
}

const askMongoConfig = function (type) {
  const outPath = {
    type: 'input',
    message: '输出的目标路径',
    name: 'path'
  }
  const inPath = {
    type: 'input',
    message: '导入的目标路径',
    name: 'path'
  }
  const promptList = [
    {
      type: 'input',
      message: '指定MongoDB的bin目录(例如:D:\\MongoDB\\bin)',
      name: 'binPath'
    },
    {
      type: 'input',
      message: '数据库用户',
      name: 'username'
    },
    {
      type: 'password',
      message: '数据库密码',
      name: 'pwd'
    },
    {
      type: 'input',
      message: '数据库名',
      name: 'dbName'
    }
  ]
  if (type === 'Import') {
    // 执行导入操作
    promptList.push(inPath)
  } else if (type === 'Export') {
    // 执行导出操作
    promptList.push(outPath)
  }
  return promiseQuestion(promptList)
}

const start = async function () {
  const {type} = await choicesType() // {type: 'XXX'}
  // 询问mongoDB的bin目录和目标路径
  const { binPath, username, pwd, dbName, path } = await askMongoConfig(type)
  const dir = binPath.substring(0, 2)
  shell.cd(dir)
  shell.cd(binPath)
  const command = type === 'Import' ? 'mongoimport' : 'mongoexport'
  const mongoCommand = `${command} -u ${username} -p ${pwd} -d ${dbName} -o ${path}`
  shell.exec(mongoCommand)
}

start()
