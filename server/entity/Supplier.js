/**
 * Created by CC on 2017/11/6.
 * 供应商
 * @deprecated 这个表废弃了 2021-10-25
 */
'use strict';
console.log('require Supplier');
let Schema = require('mongoose').Schema;
let conn = require('../dao/daoConnection').getConnection();
let Supplier = {
    supplierCode: {
        type: String
        , trim: true
        , required: true
        , unique: true
        , validate: [function (value) {
            return value.length <= 50;
        }, 'Supplier code length is more than 50.']
        , match: CGlobal.GlobalStatic.codeExp
    },//供应商代码,唯一
    supplierName: {
        type: String
        , trim: true
        , required: true
        , validate: [function (value) {
            return value.length <= 100;
        }, 'Supplier name length is more than 100.']
        , match: CGlobal.GlobalStatic.nameExp
    },//供应商名字
    desc: {
        type: String
        , validate: [function (value) {
            return value.length <= 150;
        }, 'Description length is more than 150.']
    }//描述
};

let SupplierSchema = new Schema(Supplier);
conn.model('Supplier', SupplierSchema);
module.exports = conn.model('Supplier');
