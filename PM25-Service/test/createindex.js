var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var config = require('../configure');
var dbPathDefault = config.dbpath; // Connection URL

// Use connect method to connect to the Server

MongoClient.connect(dbPathDefault, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    // Create Indexes for Events Status

    db.collection('status').createIndex({
        "data.server_name" : 1,
        "public_key" : 1
    }, null, function(err, results) {
        assert.equal(null, err);
        console.log(results);
    });

    db.collection('status').createIndex({
        "data.server_name" : 1,
        "public_key" : 1,
        "_id" : 1
    }, null, function(err, results) {
        assert.equal(null, err);
        console.log(results);
    });

    // Create Indexes for Events Collection

    db.collection('events').createIndex({
        "data.server_name" : 1,
        "public_key" : 1
    }, null, function(err, results) {
        assert.equal(null, err);
        console.log(results);
    });

    db.collection('events').createIndex({
        "data.server_name" : 1,
        "public_key" : 1,
        "_id" : 1
    }, null, function(err, results) {
        assert.equal(null, err);
        console.log(results);
    });

    // Create Indexes for Events Exceptions

    db.collection('exceptions').createIndex({
        "data.server_name" : 1,
        "public_key" : 1
    }, null, function(err, results) {
        assert.equal(null, err);
        console.log(results);
    });

    db.collection('exceptions').createIndex({
        "data.server_name" : 1,
        "public_key" : 1,
        "_id" : 1
    }, null, function(err, results) {
        assert.equal(null, err);
        console.log(results);
    });

    // Create Indexes for Events Transactions

    db.collection('transactions').createIndex({
        "data.server_name" : 1,
        "public_key" : 1,
        "data.transaction.data.time" : 1
    }, null, function(err, results) {
        assert.equal(null, err);
        console.log(results);
    });
});
