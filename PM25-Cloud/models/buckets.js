/* jshint node: true */
'use strict';

import { ObjectID as ObjectId } from 'mongodb';
import crypto from 'crypto';
import connectdb from '../helpers/MongoDBPool';

var prime_length = 60;
var diffHell = crypto.createDiffieHellman(prime_length);

async function findBucketsByQuery(query, bucketsCollection) {
    try {
        return await bucketsCollection.find(query).toArrayAsync();
    } catch(e) {
        console.error(e);
    }
}

async function insertBucketsByQuery(query, bucketsCollection) {
    try {
        return await bucketsCollection.insertAsync(query);
    } catch(e) {
        console.error(e);
    }
}

async function removeBucketsByQuery(query, bucketsCollection) {
    try {
        return await bucketsCollection.removeAsync(query);
    } catch(e) {
        console.error(e);
    }
}

async function getUserAllBucketsByUUID(uuid) {
    var db = await connectdb();
    var buckets = db && db.collection('buckets');
    var query = {
        uuid: String(uuid)
    };

    var options = {
        '_id': true,
        'uuid': true,
        'public_key': true,
        'bucket_name': true,
        'secret_key': true
    };

    var documents = await findBucketsByQuery(query, buckets);

    db && db.close();
    return documents;
}

async function createNewBucket(bucket, uuid) {
    diffHell = crypto.createDiffieHellman(prime_length);
    diffHell.generateKeys('base64');

    var db = await connectdb();
    var buckets = db && db.collection('buckets');
    var secret_key = diffHell.getPrivateKey('hex');
    var public_key = diffHell.getPublicKey('hex');
    var bucketData = {
        'uuid' : String(uuid),
        'secret_key' : bucket.secret_key || secret_key,
        'public_key' : bucket.public_key || public_key,
        'bucket_name' : bucket.bucket_name,
        'bucket_description' : bucket.bucket_description
    };

    var exist, result;
    var existBucketQuery = {
        'uuid' : String(uuid),
        'bucket_name' : bucket.bucket_name
    };

    exist = await findBucketsByQuery(existBucketQuery, buckets);

    if(exist && exist.length) { // 判断要创建的桶名是否在当前用户下已经存在
        db && db.close();
        return -1;
    }

    result = await insertBucketsByQuery(bucketData, buckets);
    db && db.close();
    return result;
}

async function removeExistBucket(bucket, uuid) {
    var db = await connectdb();
    var buckets = db && db.collection('buckets');
    var result, existBucketQuery = {
        'uuid' : String(uuid),
        'public_key' : bucket.public_key,
        'bucket_name' : bucket.bucket_name
    };

    result = await removeBucketsByQuery(existBucketQuery, buckets);
    db && db.close();
    return result;
}

module.exports = {
    getUserAllBucketsByUUID: getUserAllBucketsByUUID,
    removeExistBucket: removeExistBucket,
    createNewBucket: createNewBucket
};
