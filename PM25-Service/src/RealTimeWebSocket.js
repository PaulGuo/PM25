/* jshint node: true */
'use strict';

require('babel/polyfill');

import { ObjectID as ObjectId } from 'mongodb';
import connectdb from './helpers/MongoDBPool';

var config = require('../configure');
var sessiondbpath = config.sessiondbpath;
var wssPort = config.ports.wss;
var WebSocket = require('ws');
var wss = new WebSocket.Server({ port: wssPort });
var rpc = require('axon-rpc');
var axon = require('axon');
var req = axon.socket('req');
var rpcClient = new rpc.Client(req);

async function findOneBucketByQuery(query, bucketsCollection) {
    try {
        return await bucketsCollection.findOneAsync(query);
    } catch(e) {
        console.error(e);
    }
}

async function findSessionByQuery(query, sessionsCollection) {
    try {
        return await sessionsCollection.findOneAsync(query);
    } catch(e) {
        console.error(e);
    }
}

async function findOneStatusByQuery(query, statusCollection, fields = {}, options = {}) {
    try {
        return await statusCollection.findOneAsync(query, fields, options);
    } catch(e) {
        console.error(e);
    }
}

async function findExceptionsByQuery(query, exceptionCollection, fields = {}, options = {}) {
    try {
        return await exceptionCollection.find(query, fields, options).toArrayAsync();
    } catch(e) {
        console.error(e);
    }
}

async function findExceptionsCountByQuery(query, exceptionCollection, fields = {}, options = {}) {
    try {
        return await exceptionCollection.countAsync(query, fields, options);
    } catch(e) {
        console.error(e);
    }
}

async function askHandler(data) {
    console.time('RealTimeWebSocket:askHandler');

    var socket = this;
    var publicKey = data.public_key;
    var sessionId = data.session_id;
    var sessiondb = await connectdb('sessionDBConn', sessiondbpath);
    var sessionsCollection = sessiondb && sessiondb.collection('sessions');
    var sessionInfo = await findSessionByQuery({ '_id': sessionId }, sessionsCollection);
    var userInfo = JSON.parse(sessionInfo.session).user;
    var uuid = String(userInfo.id);
    var db = await connectdb();
    var channelName = sessionId + ':' + publicKey;

    if(!db) {
        return socket._emit(channelName, []);
    }

    var status = db && db.collection('status');
    var buckets = db && db.collection('buckets');
    var events = db && db.collection('events');
    var exceptions = db && db.collection('exceptions');
    var bucket_ret = await findOneBucketByQuery({'uuid': uuid, 'public_key': publicKey}, buckets);
    var hosts = [], results = [];
    var public_key, secret_key;

    if(!bucket_ret) {
        console.error(new Error('bucketDataNotFound.'));
        db && db.close();
        return;
    }

    public_key = bucket_ret.public_key;
    secret_key = bucket_ret.secret_key;
    hosts = await status.distinctAsync('data.server_name');
    hosts.forEach(async function(item, index, arr, doc = undefined, process_exception = undefined) {
        doc = await findOneStatusByQuery({'data.server_name': item, 'public_key': public_key}, status, {}, {sort: [['_id', 'desc']]});
        process_exception = await findExceptionsByQuery({'data.server_name': item, 'public_key': public_key}, exceptions, {}, {sort: [['_id', 'desc']], limit: 100});
        doc && doc.data && process_exception && (doc.data['process:exception'] = process_exception);
        results.push(doc);

        if(results.length === hosts.length) {
            results = results.filter(function(ele, index) {
                return ele !== null;
            });

            db && db.close();
            socket._emit(channelName, results);
            console.timeEnd('RealTimeWebSocket:askHandler');
        }
    });
}

/* 兼容纯WebSocket */

function wrapper(ws) {
    ws._emit = function(message, data) {
        message = message + ':::' + JSON.stringify(data);
        ws.send(message);
    };
    return ws;
};

function messageParse(message, command, data) {
    message = message.split(':::');
    [command, data] = message;

    try {
        data = JSON.parse(data);
    } catch(e) {}

    return [command, data];
};

function connection(socket) {
    socket = wrapper(socket);
    socket.on('message', function(message, command, data) {
        [command, data] = messageParse(message);

        if(command === 'ask') {
            askHandler.bind(socket)(data);
        }

        if(command === 'execute') {
            rpcClient.call('execute', data.machine_name, data.public_key, data, function(error) {
                error && console.error(error);
            });
        }
    });
};

wss.on('connection', connection);
req.connect(43555);

