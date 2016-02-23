/* jshint node: true */
'use strict';

require('babel/polyfill');

import connectdb from './helpers/MongoDBPool';

var nssocket = require('nssocket');
var Cipher = require('./Cipher.js');
var sockets = {};
var server;
var rpc = require('axon-rpc');
var axon = require('axon');
var rep = axon.socket('rep');
var rpcServer = new rpc.Server(rep);

async function findOneBucketByQuery(query, bucketsCollection) {
    try {
        return await bucketsCollection.findOneAsync(query);
    } catch(e) {
        console.error(e);
    }
}

server = nssocket.createServer(function(socket) {
    console.log('there is a new connection');

    socket.send('ask');
    socket.data(['ask:rep'], async function(data) {
        var db = await connectdb();

        if(!db) return;

        var buckets = db && db.collection('buckets');
        var query = { public_key: data.public_key };
        var doc = await findOneBucketByQuery(query, buckets);
        data.data = Cipher.decipherMessage(data.data, doc.secret_key);
        sockets[data.data.machine_name + ':' + data.public_key] = {
            socket: this,
            secret_key: doc.secret_key,
            machine_name: data.data.machine_name,
            public_key: data.public_key
        };

        this.data(['trigger:pm2:result'], function(data) {
            console.log('trigger:pm2:result');
        });

        this.data(['trigger:action:failure'], function(data) {
            console.log('trigger:action:failure');
        });

        this.data(['trigger:action:success'], function(data) {
            console.log('trigger:action:success');
        });
    });
});

rpcServer.expose('execute', function(machine_name, public_key, message, isCustomAction, fn) {
    var socket_index = machine_name + ':' + public_key;
    var socket = sockets[socket_index].socket;
    var secret_key = sockets[socket_index].secret_key;
    var data = Cipher.cipherMessage(JSON.stringify(message), secret_key);

    if(sockets.hasOwnProperty(socket_index) && isCustomAction) {
        socket.send('trigger:action', data);
        return fn(null);
    }

    if(sockets.hasOwnProperty(socket_index)) {
        socket.send('trigger:pm2:action', data);
        return fn(null);
    }

    fn('Socket Not Exist');
});

server.listen(43554);
rep.bind(43555);

