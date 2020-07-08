/**
 * Create by CC on 2020/5/10
 */
'use strict'

const multer = require('multer')
const Utils = require('../util/Utils')
const fs = require('fs')
const uploadDirPath = CGlobal.isEmpty(Utils.readConfig('uploadDir'))
    ? 'tempUpload' : Utils.readConfig('uploadDir')
if (!fs.existsSync(process.env.BASE_PATH + uploadDirPath)) {
    fs.mkdirSync(process.env.BASE_PATH + uploadDirPath)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 设置保存的路径
        cb(null, uploadDirPath)
    },
    filename: function (req, file, cb) {
        // 修改上传时,保存的文件名
        cb(null, file.originalname)
    }
})
// 文件过滤器
const fileFilter = function (req, file , cb) {
    console.log('文件过滤器')
    // var typeArray = file.mimetype.split('/');
    // var fileType = typeArray[1];
    // if (fileType == 'jpg' || fileType == 'png') {
    //     cb(null, true);
    // } else {
    //     cb(null, false)
    // }
    cb(null, true)
}

const limits = {
    fileSize: 1024 * 1024
}

// const preservePath = false //If paths in the multipart 'filename' field shall be preserved. (Default: false)

const fileUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // limits: limits,
    preservePath: false
})

/**
 * fileUpload.single 单个文件 前端传入的参数名single(paramsName)
 * fileUpload.array('photos', 12) 多个文件,限制数量
 * fileUpload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
 * // 多种类型多个文件
 *
 * file 的属性
 *  {
      fieldname: 'file', 表单名
      originalname: '刘文琪-个人简历.doc', 文件名
      encoding: '7bit', 文件编码
      mimetype: 'application/msword', 文件的 MIME 类型
      destination: 'tempUpload', 保存路径
      filename: '刘文琪-个人简历.doc', 保存在 destination 中的文件名
      path: 'tempUpload\\刘文琪-个人简历.doc', 已上传文件的完整路径
      size: 43520 文件大小（字节单位）
    }
 */

class FileUploadService {
    static fileUpload(req, res) {
        fileUpload.array('file', 2)(req, res, err => {
            if (err) {
                return res.send({code: 0, msg: err.message})
            }
            return res.send({code: 1, msg: '上传成功'})
        })
    }

    static get8SEPdf(req, res) {
        const num = req.body.num
        const pdfStr = fs.readFileSync(process.env.BASE_PATH+ `/tempUpload/${num}.pdf`)
        return res.send({code: 1, pdf: Utils.stringToBase64(pdfStr)})
    }
}

module.exports = FileUploadService
