const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
// Set up mail transporter service
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'techroconfirmorder@gmail.com', //gmail account
        pass: 'stsdhhfcgxipzofm' //gmail application key
    }
});
const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { family: 4 });
const dbName = 'campaignDB';

// Define the route for getting user orders
router.get('/userOrders', (req, res) => {
    // Session User
    const sessionUser = req.session.user;
    // console.log(sessionUser);

    // Session Check
    if (!sessionUser || !sessionUser.username) {
        res.status(400).json({ error: 'No user is currently logged in.' });
        return;
    }

    let db;  //use in multiple then() blocks

    client.connect()
        .then(() => {
            db = client.db(dbName);
            const userCollection = db.collection('userList');
            // Use the username we got from the session to query the userList
            return userCollection.findOne({ username: sessionUser.username });
        })
        .then(user => {
            const rentalCollection = db.collection('rentalList');
            // Now use the _id we got from the previous query to query the rentalList
            return rentalCollection.find({ userId: new ObjectId(user._id) }).toArray();
        })
        .then(rentals => {
            const eventPromises = rentals.map(rental => {
                const eventCollection = db.collection('eventList');
                return eventCollection.findOne({ _id: new ObjectId(rental.eventId) });
            });

            return Promise.all(eventPromises).then(events => {
                rentals.forEach((rental, index) => {
                    rental.event = events[index];
                });
                return rentals;
            });
        })
        .then(rentals => {
            // console.log(rentals);
            rentals.forEach(rental => {
                // Convert ObjectIds to strings
                rental._id = rental._id.toString();
                rental.userId = rental.userId.toString();
                rental.eventId = rental.eventId.toString();
                rental.event._id = rental.event._id.toString();
            });
            res.json(rentals);
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).json({ error: 'An error occurred.' });
        })
        .finally(() => {
            client.close();
        });
});

//Resend Email with Rental Info Endpoint
router.post('/rentalInfo', (req, res) => {
    // Validate request data
    if (!req.body || !req.body.rental) {
        return res.status(400).json({ error: 'Rental data is missing in the request.' });
    }

    let rental = req.body.rental;
    // Check if the rental is not expired
    if (new Date(rental.event.eventDate) > new Date()) {
        // If not expired, send the email with nodemailer
        let seatsList = rental.seats.map((seat, index) => {
            return `Full Name: ${rental.fullNames[index]}, Seat: ${seat}`;
        }).join('\n');

        let mailOptions = {
            from: 'techroconfirmorder@gmail.com',
            to: rental.email,
            subject: `Your Seat Rental Details for ${rental.event.eventName}`,
            text: `Dear Guest,

Thank you for your seat reservation for the event "${rental.event.eventName}".

Here are the details of your booking:

Event Name: ${rental.event.eventName}
Description: ${rental.event.eventDescription}
Event Date: ${new Date(rental.event.eventDate).toLocaleString()}

Seat(s) Details:
${seatsList}

If you need to make any changes to your booking, please do not hesitate to get in touch with us.

Best regards,
Tech-Ro Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error:', error);
                return res.status(500).json({ error: 'Failed to send the email.' });
            }
            console.log('Email sent: ' + info.response);
            res.json({ message: 'Email sent successfully.' });
        });
    } else {
        res.json({ message: 'Rental is expired. No email sent.' });
    }
});




module.exports = function (app) {
    app.use('/', router);
};
