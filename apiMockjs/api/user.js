/**
 * Create by CC on 2020/6/7
 */
'use strict'


export default [
  {
    url: '/users/login',
    type: 'post',
    response: () => {
      return {
        code: 200,
        "data": {
          "token": "12344567"
        },
        "msg": "成功"
      }
    }
  }
]
