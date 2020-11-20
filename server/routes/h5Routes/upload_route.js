/**
 * Create by CC on 2020/5/10
 */
'use strict';
const express = require('express');
const app = express.Router();
const fileUploadService = require('../../admin/FileUploadService');

app.post('/cms/h5/api/file/test/upload', fileUploadService.fileUpload);
app.post('/cms/h5/api/file/test/pdf', fileUploadService.get8SEPdf);

module.exports = app;
