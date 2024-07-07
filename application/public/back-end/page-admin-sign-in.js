const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { family: 4 });
const dbName = 'campaignDB';

router.post('/admin-login', (req, res) => {
    const { adminLogin, adminPass } = req.body;

    client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection('adminLogin');

            // Try to find the admin with the provided username
            return collection.findOne({ username: adminLogin });
        })
        .then(admin => {
            // If the admin doesn't exist or the password is incorrect, send an error response
            if (!admin || admin.password !== adminPass) {
                res.status(401).json({ error: 'Invalid username or password' });
                // Stop further execution in this callback chain
                throw new Error('Invalid username or password');
            }

            // The admin exists and the password is correct. Start a new session.
            req.session.admin = { username: adminLogin };
            res.status(200).json({ message: 'Admin logged in successfully' });
        })
        .catch(err => {
            if (err.message !== 'Invalid username or password') {
                console.error('Error:', err);
                res.status(500).json({ error: 'An error occurred.' });
            }
        })
        .finally(() => {
            client.close();
        });
});

router.get('/check-admin-session', (req, res) => {
    if (req.session.admin) {
        res.send({ loggedIn: true, username: req.session.admin.username });
    } else {
        res.send({ loggedIn: false });
    }
});

router.post('/admin-logout', (req, res) => {
    req.session.destroy();
    res.status(200).send({ message: 'Admin logged out successfully' });
});

module.exports = function (app) {
    app.use('/', router);
};
