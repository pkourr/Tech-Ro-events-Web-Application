const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { family: 4 });
const dbName = 'campaignDB';

router.get('/eventList/:eventId', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const eventCollection = db.collection('eventList');

        // Fetch the specific event
        const event = await eventCollection.findOne({ _id: new ObjectId(req.params.eventId) });

        // Send the event data to the client
        res.json(event);

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred.' });
    }
});


router.put('/eventList/:eventId', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const eventCollection = db.collection('eventList');

        // Update the specific event
        await eventCollection.updateOne({ _id: new ObjectId(req.params.eventId) }, { $set: req.body });

        res.json({ message: 'Event updated successfully.' });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred.' });
    }
});


router.delete('/eventList/:eventId', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const eventCollection = db.collection('eventList');

        // Delete the specific event
        await eventCollection.deleteOne({ _id: new ObjectId(req.params.eventId) });

        res.json({ message: 'Event deleted successfully.' });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred.' });
    }
});


module.exports = function (app) {
    app.use('/', router);
};
