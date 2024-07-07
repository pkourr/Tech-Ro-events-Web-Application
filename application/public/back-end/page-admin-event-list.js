const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { useUnifiedTopology: true });
const dbName = 'campaignDB';

router.get('/eventList', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const eventCollection = db.collection('eventList');

        // Fetch all events
        const events = await eventCollection.find().toArray();

        // For each event, fetch total rentals and append to the event object
        for (let event of events) {
            let totalRentals = 0;
            // Iterate over each ticket type and sum up the booked seats
            for (let ticketType in event.tickets) {
                totalRentals += event.tickets[ticketType].bookedSeats.length;
            }
            event.totalRentals = totalRentals;
        }

        res.json(events);

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred.' });
    }
});


module.exports = function (app) {
    app.use('/', router);
};
