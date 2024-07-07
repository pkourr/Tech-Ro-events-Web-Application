const express = require('express');
const session = require('express-session');
const router = express.Router();
const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { family: 4 });
const dbName = 'campaignDB';

// Define the route for user registration
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    // console.log('POST /register route handler called');
    const newUser = {
        username: username,
        password: password,
        email: '',
        firstName: '',
        lastName: '',
        address: '',
    };
    client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection('userList');

            // Check if the username already exists
            return collection.findOne({ username: username })
                .then(existingUser => {
                    // console.log("inside find");
                    if (existingUser) {
                        // If the user already exists, send an error response
                        res.status(409).json({ error: 'Username already exists' });
                        // Close the connection and stop further execution
                        // console.log("inside if");

                        throw new Error('Username already exists');
                    } else {
                        // console.log("inside else");

                        // If the user does not exist, insert the new user
                        return collection.insertOne(newUser);
                    }
                });
        })
        .then(result => {
            // console.log("Inserted a document into the userList collection.", result);

            // Session Start after registration
            req.session.user = { username: username };

            res.status(200).json({ message: 'User registered successfully' });
        })
        .catch(err => {
            if (err.message !== 'Username already exists') {
                console.error('Error:', err);
                res.status(500).json({ error: 'An error occurred.' });
            }
        })
        .finally(() => {
            client.close();
        });
});

//Define Route for user Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // console.log('POST /login route handler called');

    client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection('userList');

            // Try to find the user with the provided username
            return collection.findOne({ username: username });
        })
        .then(user => {
            // If the user doesn't exist or the password is incorrect, send an error response
            if (!user || user.password !== password) {
                res.status(401).json({ error: 'Invalid username or password' });
                // Stop further execution in this callback chain
                throw new Error('Invalid username or password');
            }

            // The user exists and the password is correct. Start a new session.
            req.session.user = { username: username };
            res.status(200).json({ message: 'User logged in successfully' });
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

router.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, username: req.session.user.username });
    } else {
        res.send({ loggedIn: false });
    }
});


router.post('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send({ message: 'User logged out successfully' });
});


module.exports = function (app) {
    app.use('/', router);
};
