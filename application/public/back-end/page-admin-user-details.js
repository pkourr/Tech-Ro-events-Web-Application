const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb'); // <-- add ObjectId here

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { family: 4 });
const dbName = 'campaignDB';

//Get User route to display to admin form
router.get('/get-user/:id', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection('userList');

        const user = await collection.findOne({_id: new ObjectId(req.params.id)});

        res.status(200).json(user);
    } catch(err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

//update user route from admin form
router.put('/update-user/:id', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection('userList');

        // Update the user
        await collection.updateOne(
            {_id: new ObjectId(req.params.id)},
            {$set: req.body}
        );

        res.status(200).json({ message: 'User updated.' });
    } catch(err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

//Delete route that deletes user from admin page
router.delete('/delete-user/:id', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection('userList');

        // Delete the user
        await collection.deleteOne({_id: new ObjectId(req.params.id)});

        res.status(200).json({ message: 'User deleted.' });
    } catch(err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred.' });
    }
});


module.exports = function (app) {
    app.use('/', router);
};
