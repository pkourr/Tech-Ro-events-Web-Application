const express = require('express');
const session = require('express-session');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { family: 4 });
const dbName = 'campaignDB';


router.get('/mailbox', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const mailboxCollection = db.collection('mailbox');

        // Fetch all mails
        const mails = await mailboxCollection.find({}).toArray();

        // Send the mails data to the client
        res.json(mails);

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

router.delete('/mailbox/:mailId', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const mailboxCollection = db.collection('mailbox');

        // Delete the specific mail
        const result = await mailboxCollection.deleteOne({ _id: new ObjectId(req.params.mailId) });


        // Check if any documents were deleted
        if (result.deletedCount === 1) {
            res.json({ success: 'Mail deleted successfully.' });
        } else {
            res.status(404).json({ error: 'Mail not found.' });
        }

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred.' });
    }
});


module.exports = function (app) {
    app.use('/', router);
};