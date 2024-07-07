const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { family: 4 });
const dbName = 'campaignDB';


router.get('/getAboutUs', (req, res) => {
    client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection('aboutUsDynamic');
            return collection.findOne({});
        })
        .then(result => {
            res.status(200).json(result);
            console.log(result);
        })
        .catch(err => {
            console.error('An error occurred:', err);
            res.status(500).send(err);
        })
        .finally(() => {
            client.close();
        });
});


module.exports = function (app) {
    app.use('/', router);
};
