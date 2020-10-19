/**
 * Create by CC on 2020/5/20
 */
'use strict'

const mongoose = require('mongoose')
//这个数据库连接是需要电脑有网络才能通的,否则报连接异常
const opt = {
  user: 'sa',
  pass: '123456',
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  // server:{
  reconnectInterval: 10 * 1000,//1分钟重连一次数据库
  reconnectTries: 100//尝试重连100次
  // }
}
const conn = mongoose.createConnection('mongodb://127.0.0.1:27017/clothingshop', opt)
const Schema = mongoose.Schema
const Test = {
  floorNo: {type: Number},//层号
  rooms: [{
    number: {type: Number},//房间号
    type: {type: String},//房间类型
    desc: {type: String}//描述
  }],//每层楼的房间信息
  type: String, // 类型
  status: Boolean // 状态
}
const TestSchema = new Schema(Test)

TestSchema.statics.groupFind = function (cb) {
  this.aggregate([
    {
      $group: {
        // _id: '$type', // $ + fields名
        // 按照2个字段去groupBy
        _id: {
          type: '$type',
          status: '$status'
        },
        "count": { //计数返回的节点名
          "$sum": 1 // 使用计数
        }
      }
    },
    {
      $project: {
        _id: 0, // 去掉_id
        type: '$_id.type', // 给_id另起一个名字叫type
        count: 1,
        countInfo: {
          num: '$count',
          status: '$_id.status'
        }
      }
    },
    {
      $sort: {
        type: 1
      }
    },
    {
      $group: {
        _id: '$type',
        count: {
          $push: '$countInfo'
        }
      }
    },
    {
      $project: {
        _id: 0,
        type: '$_id',
        count: '$count',
        all: {
          $sum: '$count.num'
        }
      }
    }
  ], cb)
}

// 通过类型分组,查询每种类型最大的floorNo
TestSchema.statics.groupBy = function (cb) {
  this.aggregate([
    {
      $group: {
        _id: {type: "$type"},
        floorNo: {$max: "$floorNo"},
        // books: {$push: "$$ROOT"}
      }
    },
    // {
    //   $addFields: {
    //     totalCopies: {$sum: "$books.floorNo"}
    //   }
    // },
    // {
    //   $project: {
    //     _id: 0, // 去掉_id
    //     type: '$_id.type', // 给_id另起一个名字叫type
    //     floorNo: 1,
    //     books: 1,
    //     // totalCopies: 1
    //   }
    // }
  ], cb)
}

conn.model('Test', TestSchema)

const AppTest = conn.model('Test', TestSchema)

// AppTest.find((err, res) => {
//   console.log(res)
// })

// AppTest.groupFind((err, res) => {
//   console.log(err)
//   console.log(JSON.stringify(res))
// })

AppTest.groupBy((err, res) => {
  if (err) console.error(err)
  else {
    console.log(JSON.stringify(res))
  }
})

