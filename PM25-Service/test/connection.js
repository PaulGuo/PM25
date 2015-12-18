var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var config = require('../configure');
var dbPathDefault = config.testdbpath; // Connection URL

// Use connect method to connect to the Server

MongoClient.connect(dbPathDefault, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
});
