const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { family: 4 });
const dbName = 'campaignDB';

// Define the route for getting user profile
router.get('/getProfile', (req, res) => {
    // Session User
    const sessionUser = req.session.user;
    //Session Check
    if (!sessionUser || !sessionUser.username) {
        res.status(400).json({ error: 'No user is currently logged in.' });
        return;
    }

    client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection('userList');
            return collection.findOne({ username: sessionUser.username });
        })
        .then(user => {
            // Omit the password from the response
            delete user.password;
            res.json(user);
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).json({ error: 'An error occurred.' });
        })
        .finally(() => {
            client.close();
        });
});

// Define the route for updating user profile
router.post('/updateProfile', (req, res) => {
    // Session User
    const sessionUser = req.session.user;

    // Body data
    const { firstName, lastName, email, address, username, password } = req.body;

    // User data to update
    const updatedUser = {
        firstName,
        lastName,
        email,
        address,
        username,
        password
    };

    client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection('userList');
            return collection.updateOne(
                { username: sessionUser.username },
                { $set: updatedUser }
            );
        })
        .then(() => {
            res.status(200).json({ message: 'User profile updated successfully' });
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
