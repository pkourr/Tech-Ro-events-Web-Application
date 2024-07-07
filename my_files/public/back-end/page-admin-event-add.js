const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { family: 4 });
const dbName = 'campaignDB';



router.post('/addEvent', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const eventCollection = db.collection('eventList');

        // Convert eventDate string to Date
        req.body.eventDate = new Date(req.body.eventDate);

        // Add the event
        const result = await eventCollection.insertOne(req.body);

        // Respond to the client
        res.json({ message: 'Event added successfully.' });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred.' });
    }
});



module.exports = function (app) {
    app.use('/', router);
};