'use strict';
let xml2js = require('xml2js');
let xmlpath = __dirname + '/xml/content.xml';
let fs = require('fs');

let xmlContent = fs.readFileSync(xmlpath, 'UTF-8');
let xmlJson = null;
xml2js.parseString(xmlContent, {explicitArray : false}, function (err, xmlResult) {
    if(err)console.error(err);
    if(xmlResult)xmlJson = xmlResult;
});
console.log(JSON.stringify(xmlJson));