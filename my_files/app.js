const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { family: 4 });

// Database Name
const dbName = 'campaignDB';

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('userList');

    // Insert a document into the userList collection
    const result = await collection.insertOne({ name: 'New User', email: 'newuser@example.com' });
    //console.log('Inserted document:', result.ops[0]);

    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());

