const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { family: 4 });
const dbName = 'campaignDB';

// Set up mail transporter service
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'techroconfirmorder@gmail.com', // your gmail account
        pass: 'stsdhhfcgxipzofm' // your gmail password
    }
});

// GET /getEventDetails?id=eventID
router.get('/getEventDetails', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const eventID = req.query.id;

        const eventDetails = await db.collection('eventList').findOne({ _id: new ObjectId(eventID) });
        res.json(eventDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving event details' });
    }
});

//Create Order Endpoint when user is paying
router.post('/createOrder', async (req, res) => {
    const order = req.body;
    try {
        await client.connect();
        const db = client.db(dbName);

        // Check if the user is logged in
        if (!req.session || !req.session.user) {
            return res.json({ success: false, error: 'Please Log in or Register' });
        }

        // Find the user's _id from the userList collection
        const user = await db.collection('userList').findOne({ username: req.session.user.username });
        if (!user) {
            return res.json({ success: false, error: 'User not found' });
        }

        // Add the userId to the order
        order.userId = user._id;

        // Convert the eventId to an ObjectId
        order.eventId = new ObjectId(order.eventId);

        // Log the order object
        // console.log(order);

        // Insert the order into the rentalList collection
        const result = await db.collection('rentalList').insertOne(order);
        // console.log(result);

        if (result.acknowledged) {
            // Construct the message for the email
            let message = `Hello ${user.username},\n\nThank you for your purchase! Your order has been confirmed!\n\n`;
            message += 'Order Details:\n';
            message += '===========================\n';
            message += `Order ID: ${result.insertedId}\n`;
            message += order.fullNames.map((name, i) => `Ticket ${i+1}:\n\tFull Name: ${name}\n\tSeat: ${order.seats[i]}\n`).join('');
            message += `Total Price: $${order.totalPrice}\n`;
            message += `Credit Card: **** **** **** ${order.creditCard.number.split(' ').pop()}\n`;
            message += '===========================\n';
            message += 'Thank you for choosing our services. Enjoy the event!\n\n';
            message += 'Best Regards,\nYour Tech-Ro Foundation';

            // Set up mail options
            const mailOptions = {
                from: 'techroconfirmorder@gmail.com', // sender address
                to: order.email, // list of receivers
                subject: 'Order Confirmation - Tech-Ro', // Subject line
                text: message, // plain text body
            };

            transporter.sendMail(mailOptions, function (err, info) {
                if(err)
                    console.log(err)
                else
                    console.log(info);
            });

            return res.json({ success: true });
        } else {
            // console.error(result);
            return res.json({ success: false, error: 'Failed to insert order' });
        }


    } catch (error) {
        console.error(error);
        return res.json({ success: false, error: 'Failed to insert order' });
    }
});

// Update booked seats for a particular event and ticket type
router.post('/updateEventSeats', async (req, res) => {
    // console.log(req.body);
    const { eventId, ticketType, seats } = req.body;

    try {
        await client.connect();
        const db = client.db(dbName);

        // Convert eventId to ObjectId
        const objectId = new ObjectId(eventId);

        // Fetch the event from the database
        const event = await db.collection('eventList').findOne({ _id: objectId });

        if (!event) {
            return res.json({ success: false, error: 'Event not found' });
        }

        // Update the bookedSeats array in the event's ticket type
        const updateResult = await db.collection('eventList').updateOne(
            { _id: objectId },
            { $push: { [`tickets.${ticketType}.bookedSeats`]: { $each: seats } } }
        );

        if (updateResult.acknowledged) {
            return res.json({ success: true });
        } else {
            console.error(updateResult);
            return res.json({ success: false, error: 'Failed to update event seats' });
        }
    } catch (error) {
        console.error(error);
        return res.json({ success: false, error: 'Failed to update event seats' });
    }
});


module.exports = function (app) {
    app.use('/', router);
};