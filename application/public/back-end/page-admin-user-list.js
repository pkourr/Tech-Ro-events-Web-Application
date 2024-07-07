const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { family: 4 });
const dbName = 'campaignDB';

//Get Users to output to admin user list
router.get('/get-users', async (req, res) => {
    try {
        const db = client.db(dbName);
        const userCollection = db.collection('userList');
        const rentalCollection = db.collection('rentalList');

        // Get all users from the collection
        const users = await userCollection.find({}).toArray();

        // Loop over each user to count the events booked
        for(let user of users){
            const count = await rentalCollection.countDocuments({userId: new ObjectId(user._id)});
            user.eventsBooked = count;
        }

        // Return the list of users
        res.status(200).json(users);
    } catch(err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

module.exports = function (app) {
    app.use('/', router);
};
