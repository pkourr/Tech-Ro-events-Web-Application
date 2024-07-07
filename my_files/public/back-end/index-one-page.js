const express = require('express');
const session = require('express-session');
const router = express.Router();
const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { family: 4 });
const dbName = 'campaignDB';


router.post('/mailbox', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const mailboxCollection = db.collection('mailbox');

        // Insert the new mail into the mailbox collection
        const newMail = await mailboxCollection.insertOne({
            email: req.body.email,
            mailTitle: req.body.mailTitle,
            mailContent: req.body.mailContent,
            mailDate: req.body.mailDate,
        });

        // Send a success response to the client
        res.json({ success: true, message: 'Mail sent successfully.' });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'An error occurred.' });
    }
});



module.exports = function (app) {
    app.use('/', router);
};
