/* jshint node: true */
'use strict';

import connectdb from '../helpers/MongoDBPool';

async function findTransactionsByQuery(query, transactionsCollection, fields) {
    try {
        return await transactionsCollection.find(query, fields, { limit: 500, sort: [['data.transaction.data.time', 'desc']] }).toArrayAsync();
    } catch(e) {
        console.error(e);
    }
}

async function getServerAllTransactions(public_key, server_name) {
    var db = await connectdb();
    var transactions = db && db.collection('transactions');
    var query = {
        'public_key': public_key,
        'data.server_name': server_name
    };

    var documents = await findTransactionsByQuery(query, transactions);

    db && db.close();
    return documents;
}

module.exports = {
    getServerAllTransactions: getServerAllTransactions
};
