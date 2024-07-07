const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { family: 4 });
const dbName = 'campaignDB';


// Event Fetch
router.get('/getEvents', (req, res) => {
    client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection('eventList');
            const now = new Date();
            return collection
                .find({
                    eventDate: { $gt: now },
                }) // Filter out events with dates greater than current date
                .toArray();
        })
        .then(events => {
            //console.log(events);
            res.json(events);
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).json({ error: 'An error occurred.' });
        })
        .finally(() => {
            client.close();
        });
});


// Expired Event Fetch
router.get('/getExpiredEvents', (req, res) => {
    client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection('eventList');
            const now = new Date();
            return collection
                .find({
                    eventDate: { $lt: now },
                }) // Filter out events with dates less than current date
                .toArray();
        })
        .then(expiredEvents => {
            //console.log(expiredEvents);
            res.json(expiredEvents);
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).json({ error: 'An error occurred.' });
        })
        .finally(() => {
            client.close();
        });
});

//Search Function
router.get('/searchEvents', (req, res) => {
    client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection('eventList');
            const searchQuery = req.query.s;
            const now = new Date();
            // We create a regex from the search query
            // The 'i' flag makes the search case insensitive
            const searchRegex = new RegExp(searchQuery, 'i');

            return collection
                .find({
                    eventDate: { $gt: now },
                    eventName: searchRegex,
                })
                .toArray();
        })
        .then(events => {
            //console.log(events);
            res.json(events);
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).json({ error: 'An error occurred.' });
        })
        .finally(() => {
            client.close();
        });
});

//Search Expired Events Function
router.get('/searchExpiredEvents', (req, res) => {
    client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection('eventList');
            const searchQuery = req.query.s;
            const now = new Date();
            // We create a regex from the search query
            // The 'i' flag makes the search case insensitive
            const searchRegex = new RegExp(searchQuery, 'i');

            return collection
                .find({
                    eventDate: { $lt: now },
                    eventName: searchRegex,
                })
                .toArray();
        })
        .then(events => {
            //console.log(events);
            res.json(events);
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).json({ error: 'An error occurred.' });
        })
        .finally(() => {
            client.close();
        });
});



module.exports = function (app) {
    app.use('/', router);
};
