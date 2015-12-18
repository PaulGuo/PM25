/* jshint node: true */
'use strict';

import Promise from 'bluebird';
import MongoDB from 'mongodb';
import MongoClient from 'mongodb';
Promise.promisifyAll(MongoDB);

var config = require('../../configure');
var dbPathDefault = config.dbpath;
var dbPool = {};

async function connectdb(connName = '_default', dbPath = dbPathDefault) {
    if(dbPool.hasOwnProperty(connName)) {
        return dbPool[connName];
    }

    dbPool[connName] = await MongoDB.MongoClient.connectAsync(dbPath);
    dbPool[connName].close = function() {}; //保持连接不关闭
    return dbPool[connName];
}

module.exports = connectdb;
