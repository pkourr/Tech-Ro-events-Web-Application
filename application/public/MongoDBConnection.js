var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/campaignDB";

MongoClient.connect(url, function (err, db) {
    if(err) {
        console.log('Error Creating DataBase!');
        throw err;
    }
    else {
        console.log('Database Created Successfully!');
        db.close();
    }
});
