/**
 * Create by CC on 2022/3/20
 */
'use strict'

const Rights = require('./Rights')

const _3000Tree = {
  code: Rights.OtherSetup.code,
  desc: Rights.OtherSetup.desc,
  children: [
    {
      code: Rights.SupplierSetup.code,
      desc: Rights.SupplierSetup.desc
    },
    {
      code: Rights.ShopSetup.code,
      desc: Rights.ShopSetup.desc
    },
    {
      code: Rights.UserSetup.code,
      desc: Rights.UserSetup.desc
    },
    {
      code: Rights.RightsSetup.code,
      desc: Rights.RightsSetup.desc,
      children: [
        {
          code: Rights.RightsGroupSetup.code,
          desc: Rights.RightsGroupSetup.desc,
          children: [
            {
              code: Rights.RightsGroupCreate.code,
              desc: Rights.RightsGroupCreate.desc
            },
            {
              code: Rights.RightsGroupModify.code,
              desc: Rights.RightsGroupModify.desc
            },
            {
              code: Rights.RightsGroupDelete.code,
              desc: Rights.RightsGroupDelete.desc
            }
          ]
        },
        {
          code: Rights.RightsCodeSetup.code,
          desc: Rights.RightsCodeSetup.desc,
          children: [
            {
              code: Rights.RightsCodeModify.code,
              desc: Rights.RightsCodeModify.desc
            }
          ]
        }
      ]
    },
    {
      code: Rights.SystemSetup.code,
      desc: Rights.SystemSetup.desc
    },
    {
      code: Rights.MailSetup.code,
      desc: Rights.MailSetup.desc
    },
    {
      code: Rights.RepairData.code,
      desc: Rights.RepairData.desc
    }
  ]
}

module.exports = [
    _3000Tree
]
