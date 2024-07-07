const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { family: 4 });
const dbName = 'campaignDB';


router.get('/adminAboutUs', (req, res) => {
    client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection('aboutUsDynamic');
            return collection.findOne({});
        })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).json({ error: 'An error occurred.' });
        })
        .finally(() => {
            client.close();
        });
});

router.post('/adminAboutUs', (req, res) => {
    client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection('aboutUsDynamic');
            return collection.updateOne(
                {},
                { $set: req.body }
            );
        })
        .then(() => {
            res.json({ message: "Successfully updated!" });
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
