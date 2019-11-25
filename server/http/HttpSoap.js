'use strict';

let http = require('./RequestHTTP');
let xml2js = require('xml2js');
let builder = new xml2js.Builder();

function SoapElement() {

}

SoapElement.parseElement = function (namespace, element) {
    let temp = {};
    if (!CGlobal.isPlainObject(element)) return {};
    CGlobal.forEach(element, function (eleKey, eleValue) {
        let space = eleKey;
        if (namespace) {
            space = namespace + ':' + eleKey;
        }
        temp[space] = {};
        if (typeof eleValue === 'string') {
            temp[space]._ = eleValue;
        } else if (CGlobal.isPlainObject(eleValue)) {
            let ele = SoapElement.addElement(eleValue);
            CGlobal.forEach(ele, function (key, value) {
                temp[space][key] = value;
            });
        } else if (Array.isArray(eleValue)) {
            temp[space] = [];
            CGlobal.forEach(eleValue, function (i, value) {
                temp[space].push(SoapElement.addElement(value));
            });
        }
    });
    return temp;
};

SoapElement.addElement = function (element) {
    let temp = {};
    if (typeof element === 'string') return {_: element};
    if (element.attr) {
        temp.$ = element.attr;
        delete element.attr;
    }
    if (element.value) {
        temp._ = element.value;
        delete element.value;
    }
    CGlobal.forEach(element, function (eleKey, eleValue) {
        if(eleKey === '_' || eleKey === '$'){
            temp[eleKey] = eleValue;
            return true;
        }
        if(Array.isArray(eleValue)){
            temp[eleKey] = [];
            eleValue.forEach(function (ele) {
                temp[eleKey].push(SoapElement.addElement(ele));
            });
        }else {
            temp[eleKey] = {};
            temp[eleKey] = SoapElement.addElement(eleValue);
        }

    });
    return temp;
};

function HttpSoap(url, headers, options) {
    this._url = url;
    this._headers = {
        'Content-Type': 'application/soap+xml; charset=utf-8'
    };
    if (CGlobal.isPlainObject(headers)) {
        CGlobal.extend(this._headers, headers);
    }
    this._options = {
        node: 'soap'
    };
    if (CGlobal.isPlainObject(options)) {
        CGlobal.extend(this._options, options);
    }
    this._node = this._options.node;
    this._soapEnvelope = {$: {}};
    this._soapHeaders = {};
    this._soapBody = {};
    let envelope = {
        soap: 'http://schemas.xmlsoap.org/soap/envelope/',
        xsi: 'http://www.w3.org/2001/XMLSchema-instance',
        wsu: 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
        tns: 'http://server.soap.com/'
    };
    this.setEnvelopeAttr(envelope);
}

HttpSoap.prototype.setEnvelopeAttr = function (attributes) {
    if (!CGlobal.isPlainObject(attributes)) return this;
    let that = this;
    CGlobal.forEach(attributes, function (key, value) {
        that._soapEnvelope.$['xmlns:' + key] = value;
    });
    return this;
};

HttpSoap.prototype.setSoapHeaders = function (namespace, element) {
    CGlobal.extend(this._soapHeaders, SoapElement.parseElement(namespace, element));
    return this;
};

HttpSoap.prototype.clearHeaders = function () {
    this._soapHeaders = {};
    return this;
};

HttpSoap.prototype._setSoapBody = function (namespace, element) {
    CGlobal.extend(this._soapBody, SoapElement.parseElement(namespace, element));
    return this;
};

HttpSoap.prototype.parseElement = function (namespace, element) {
    return SoapElement.parseElement(namespace, element);
};

HttpSoap.prototype.post = function (body, cb, namespace) {
    this._soapBody = {};
    this._setSoapBody(namespace, body);
    let that = this;
    http.post(this._url, this._headers, this._getXML(), function (err, res) {
        if(err)return cb(err);
        that._parseResult(res, cb);
    });
};

HttpSoap.prototype._parseResult = function (res, cb){
    let data = res.data;
    let xmlJson = null;
    xml2js.parseString(data, {explicitArray : false}, function (err, xmlResult) {
        if(err)return cb(err);
        xmlJson = xmlResult;
    });
    //当解析的结果是null时,说明返回的不是xml
    if(!xmlJson)return cb(null, data);
    cb(null, xmlJson[this._node + ':Envelope'][this._node + ':Body']);
};

HttpSoap.prototype._getXML = function () {
    let xml = {};
    xml[this._node + ':Envelope'] = this._soapEnvelope;
    xml[this._node + ':Envelope'][this._node + ':Header'] = this._soapHeaders;
    xml[this._node + ':Envelope'][this._node + ':Body'] = this._soapBody;
    return builder.buildObject(JSON.parse(JSON.stringify(xml)));
};

module.exports = HttpSoap;