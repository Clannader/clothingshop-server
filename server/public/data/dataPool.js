/**
 * Created by CC on 2017/5/16.
 */
'use strict';
console.log('require dataPool');

module.exports = {
    defaultSystemData: require('./default/defaultSystemData'),
    defaultRightsGroup: require('./default/defaultRightsGroup'),
    mustIndex : require('./index/mustIndex'),
    defaultIndex : require('./index/defaultIndex')
};