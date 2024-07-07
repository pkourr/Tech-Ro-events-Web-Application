const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const backendDirectory = path.join(__dirname, 'public', 'back-end');
const backendFiles = fs.readdirSync(backendDirectory);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.use(session({
    secret: 'diadiktuakosProg', // secret-key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Add this middleware right after the session middleware
app.use((req, res, next) => {
    res.locals.loggedIn = req.session.user ? true : false;
    next();
});

// Include all back-end JavaScript files
backendFiles.forEach((file) => {
    const filePath = path.join(backendDirectory, file);
    if (file.endsWith('.js')) {
        const route = require(filePath);
        route(app);
    }
});

//Define all HTML routes for the admin part
app.get('/admin/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'public', 'admin', `${page}.html`), err => {
        if (err) {
            res.status(404).send('No such page');
        }
    });
});

// Now define your catch-all route for serving HTML files
app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'public', `${page}.html`), err => {
        if (err) {
            res.status(404).send('No such page');
        }
    });
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
