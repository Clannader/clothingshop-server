/**
 * Created by CC on 2018/1/27.
 * 系统配置表,设计一二级关联关系
 */
'use strict';
console.log('require SystemConfig');
let Schema = require('mongoose').Schema;
let conn = require('../../dao/daoConnection').getConnection();

let AdminLog = require('../super/AdminLog');
let Utils = require('../../util/Utils');

let SystemConfig = {
    key: {
        type: String
        , trim: true
        , required: true
        , match: CGlobal.GlobalStatic.codeExp
    },//key
    groupName: {
        type: String
    },//组名,一级组名为null,二级组名不为null
    value: {
        type: String
        , required: true
    },//值
    desc: {
        type: String
        , trim: true
        , validate: [function (value) {
            return value.length <= 150;
        }, 'Description length is more than 150.']
    }//描述
};
let SystemConfigSchema = new Schema(SystemConfig);

SystemConfigSchema.statics.addOneGroup = function (data, session, cb) {
    if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
        return cb({message: '抱歉,你没有权限访问!'});
    }
    if (!CGlobal.isPlainObject(data)) {
        return cb({message: '参数不能为空'});
    }
    delete data.id;
    let that = this;
    this.checkGroupInfo('ONE', data, function (err) {
        if (err) return cb(err);
        that.create(data, function (err, config) {
            if (err) return cb(err);
            AdminLog.createLog({
                userName: session.adminId,
                content: CGlobal.serverLang('创建{0} 一类配置', config.key),
                shopId: session.shopId,
                type: CGlobal.GlobalStatic.Log_Type.CONFIG
            }, session, function (err) {
                if (err) console.error(err);
            });
            cb();
        });
    });
};

SystemConfigSchema.statics.checkGroupInfo = function (type, data, cb) {
    let key = data.key;
    let value = data.value;
    let groupName = data.groupName;
    if (!key) {
        return cb({message: '请输入Key'});
    }
    if (!value) {
        return cb({message: '请输入值'});
    }
    if ('ONE' === type) {
        delete data.groupName;
    } else if ('TWO' === type) {
        if (!groupName) {
            return cb({message: '组名不存在!'});
        }
    }
    let where = {key: Utils.getIgnoreCase(key)};

    if (data.id) {
        where._id = {$ne: data.id};
    }
    if ('ONE' === type) {
        where.groupName = {$exists: false};
        this.count(where, function (err, count) {
            if (err) return cb(err);
            if (count > 0) return cb({message: 'Key已存在'});
            cb();
        });
    } else if ('TWO' === type) {
        let isExistGroupName = {
            key: groupName,
            groupName: {$exists: false}
        };
        let that = this;
        where.groupName = groupName;
        //二级组的时候先判断组名是否存在
        this.count(isExistGroupName, function (err, count) {
            if (err) return cb(err);
            if (count !== 1) return cb({message: '组名不存在!'});
            //再判断二级组是否重复
            that.count(where, function (err, count) {
                if (err) return cb(err);
                if (count > 0) return cb({message: 'Key已存在'});
                cb();
            });
        });
    }

};

SystemConfigSchema.statics.addTwoGroup = function (data, session, cb) {
    if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
        return cb({message: '抱歉,你没有权限访问!'});
    }
    if (!CGlobal.isPlainObject(data)) {
        return cb({message: '参数不能为空'});
    }
    delete data.id;
    let that = this;
    this.checkGroupInfo('TWO', data, function (err) {
        if (err) return cb(err);
        that.create(data, function (err, config) {
            if (err) return cb(err);
            AdminLog.createLog({
                userName: session.adminId,
                content: CGlobal.serverLang('创建{0} 下 {1}二类配置', config.groupName, config.key),
                shopId: session.shopId,
                type: CGlobal.GlobalStatic.Log_Type.CONFIG
            }, session, function (err) {
                if (err) console.error(err);
            });
            cb();
        });
    });
};

SystemConfigSchema.statics.modifyOneGroup = function (data, session, cb) {
    if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
        return cb({message: '抱歉,你没有权限访问!'});
    }
    if (!CGlobal.isPlainObject(data)) {
        return cb({message: '参数不能为空'});
    }
    let that = this;
    this.checkGroupInfo('ONE', data, function (err) {
        if (err) return cb(err);
        let id = data.id;
        delete data.id;//id不能改
        that.findByIdAndUpdate(id, {$set: data}, function (err, config) {
            if (err) return cb(err);
            if (!config) return cb({message: 'Key已不存在'});
            contrastConfig('ONE', config, data, session);
            //如果修改了key,则要修改对应二类组的组名
            if (config.key !== data.key) {
                that.modifyTwoGroupByGroupName({
                    oldGroupName: config.key,
                    newGroupName: data.key
                }, session, function (err) {
                    if (err) console.error(CGlobal.serverLang(err.message));
                });
            }
            cb(null, config);
        });
    });
};

SystemConfigSchema.statics.modifyTwoGroupByGroupName = function (groupParam, session, cb) {
    if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
        return cb({message: '抱歉,你没有权限访问!'});
    }
    if (!groupParam.oldGroupName) {
        return cb({message: '旧组名为空'});
    }
    if (!groupParam.newGroupName) {
        return cb({message: '新组名为空'});
    }
    let where = {
        groupName: groupParam.oldGroupName
    };
    let that = this;
    this.count(where, function (err, count) {
        if (err) return cb(err);
        if (count === 0) return cb();
        //{ok:代表修改成功,nModified:影响修改的条数,n:修改了几条}
        that.update(where, {$set: {groupName: groupParam.newGroupName}}, {multi: true}, cb);
    });
};

function contrastConfig(type, oldConfig, newConfig, session) {
    let content = [];
    //对照表
    let chart = {
        key: 'Key',
        groupName: '组名',
        value: '值',
        desc: '描述'
    };

    CGlobal.forEach(chart, function (key, value) {
        if (oldConfig[key] !== newConfig[key]) {
            content.push(CGlobal.replaceArgs('{0}:{1}->{2}.'
                , CGlobal.serverLang(value), oldConfig[key] || 'null', newConfig[key] || 'null'));
        }
    });

    if (content.length !== 0) {
        if (type === 'ONE') {
            content.unshift(CGlobal.serverLang('编辑{0} 一类配置:', oldConfig.key));//在数组开头插入一个元素
        } else if (type === 'TWO') {
            content.unshift(CGlobal.serverLang('编辑{0} 下{1}二类配置:', oldConfig.groupName
                , oldConfig.key));
        }

        AdminLog.createLog({
            userName: session.adminId,
            content: content.join('<br>'),
            shopId: session.shopId,
            type: CGlobal.GlobalStatic.Log_Type.CONFIG
        }, session, function (err) {
            if (err) console.error(err);
        });
    }
}

SystemConfigSchema.statics.modifyTwoGroup = function (data, session, cb) {
    if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
        return cb({message: '抱歉,你没有权限访问!'});
    }
    if (!CGlobal.isPlainObject(data)) {
        return cb({message: '参数不能为空'});
    }
    let that = this;
    this.checkGroupInfo('TWO', data, function (err) {
        if (err) return cb(err);
        let id = data.id;
        delete data.id;//id不能改
        that.findByIdAndUpdate(id, {$set: data}, function (err, config) {
            if (err) return cb(err);
            if (!config) return cb({message: 'Key已不存在'});
            contrastConfig('TWO', config, data, session);
            cb(null, config);
        });
    });
};

SystemConfigSchema.statics.deleteGroupById = function (id, session, cb) {
    if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
        return cb({message: '抱歉,你没有权限访问!'});
    }
    if (!Utils.isMongoId(id)) {
        return cb({message: '无效的id值'});
    }
    let that = this;
    this.findByIdAndRemove(id, function (err, config) {
        if (err) return cb(err);
        if (!config) return cb({message: 'Key已不存在'});
        let one = '';
        let two = '';
        if (config.groupName) {
            two = CGlobal.serverLang('删除{0} 下{1} 二类配置', config.groupName, config.key);
        } else {
            one = CGlobal.serverLang('删除{0}一类配置', config.key);
            //删除一级下的所有二级
            that.findAllTwoGroupByOneGroup(config.key, session, function (err, result) {
                if (err) {
                    console.error(err);
                    return;
                }
                CGlobal.forEach(result, function (i, value) {
                    that.deleteGroupById(value._id + '', session, function () {
                    });
                });
            });
        }
        AdminLog.createLog({
            userName: session.adminId,
            content: config.groupName ? two : one,
            shopId: session.shopId,
            type: CGlobal.GlobalStatic.Log_Type.CONFIG
        }, session, function (err) {
            if (err) console.error(err);
        });
        cb(null, config);
    });
};

SystemConfigSchema.statics.findSingleOneGroup = function (key, session, cb) {
    if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
        return cb({message: '抱歉,你没有权限访问!'});
    }
    if (typeof key !== 'string') {
        key = '';
    }
    let where = {
        $and: [{
            groupName: {$exists: false}
        }, {
            key: key
        }]
    };
    this.findOne(where, cb);
};

//不分页查询全部一级组
SystemConfigSchema.statics.findAllOneGroup = function (where, session, cb) {
    let that = this;
    this.getFindWhere('ONE', where, session, function (err, searchWhere) {
        if (err) return cb({message: err.message});
        that.find(searchWhere, function (err, result) {
            if (err) return cb(err);
            cb(null, result);
        });
    });
};

//获取查询一二级组的查询条件
SystemConfigSchema.statics.getFindWhere = function (type, where, session, cb) {
    if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
        return cb({message: '抱歉,你没有权限访问!'});
    }
    let input = where.input || '';
    let searchWhere = {
        $or: []
    };

    if (type === 'ONE') {
        //类型是one的就是查询一级组的
        searchWhere.$and = [{
            groupName: {$exists: false}
        }]
    } else if (type === 'TWO') {
        //类型是two的就是查询二级组的
        searchWhere.$and = [{
            groupName: where.groupName || '$$$'
        }]
    } else {
        return cb({message: '查询出错!'});
    }

    CGlobal.forEach(input.split(' '), function (i, v) {
        if (!v) {
            return true;
        }//判断如果v是''或者undefined
        searchWhere.$or.push({
            key: Utils.getIgnoreCase(v, true)
        });
        searchWhere.$or.push({
            value: Utils.getIgnoreCase(v, true)
        });
        searchWhere.$or.push({
            desc: Utils.getIgnoreCase(v, true)
        });
        searchWhere.$or.push({
            groupName: Utils.getIgnoreCase(v, true)
        });
    });
    if (searchWhere.$or.length === 0) delete searchWhere.$or;
    cb(null, searchWhere);
};

SystemConfigSchema.statics.findSingleTwoGroup = function (key, groupName, session, cb) {
    if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
        return cb({message: '抱歉,你没有权限访问!'});
    }
    if (typeof key !== 'string') {
        key = '';
    }
    if (typeof groupName !== 'string') {
        groupName = '$$$';
    }
    let where = {
        groupName: groupName,
        key: key
    };
    this.findOne(where, cb);
};

SystemConfigSchema.statics.findAllTwoGroupByOneGroup = function (groupName, session, cb) {
    if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
        return cb({message: '抱歉,你没有权限访问!'});
    }
    if (typeof groupName !== 'string') {
        groupName = '';
    }
    let where = {
        $and: [{
            groupName: {$exists: true}
        }, {
            groupName: groupName
        }]
    };
    this.find(where, cb);
};

SystemConfigSchema.statics.findGroupById = function (id, session, cb) {
    if (!CGlobal.isPermission(session.rights, CGlobal.Rights.SystemSetup.code)) {
        return cb({message: '抱歉,你没有权限访问!'});
    }
    if (!Utils.isMongoId(id)) {
        return cb({message: '无效的id值'});
    }
    this.findById(id, function (err, result) {
        if (err) return cb(err);
        if (!result) return cb({message: '配置不存在!'});
        return cb(null, JSON.parse(JSON.stringify(result)));
    });
};

conn.model('SystemConfig', SystemConfigSchema);
module.exports = conn.model('SystemConfig');