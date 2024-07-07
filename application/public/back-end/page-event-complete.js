const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { family: 4 });
const dbName = 'campaignDB';

router.post('/addExperience', async (req, res) => {
    // Connect to the MongoDB client
    await client.connect();

    // Select the database
    const db = client.db('campaignDB');

    // Find the user's _id from the userList collection
    const user = await db.collection('userList').findOne({ username: req.session.user.username });
    if (!user) {
        return res.json({ success: false, error: 'User not found' });
    }

    // Extract the user's _id
    const userId = user._id;

    // Collect the feedback data
    const data = req.body;

    // Add the user's _id to the data
    data.userId = userId;

    // Insert the data into the experienceRating collection
    db.collection('experienceRating').insertOne(data)
        .then(result => {
            res.json({ success: true, message: 'Experience successfully added' });
        })
        .catch(error => {
            res.json({ success: false, error: 'An error occurred while adding the experience' });
        })
        .finally(() => {
            client.close();
        });
});


module.exports = function (app) {
    app.use('/', router);
};