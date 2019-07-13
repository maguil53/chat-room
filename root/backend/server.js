const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const mongoUtil = require('./mongoUtil.js');



// Used so we can store Environment Variables inside our .env file
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Using mongoUtil module to connect to MongoDB.
mongoUtil.connectToServer(function(err, client) {
    if(err) console.log(err);

    // Start Express Server once connected to database.
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });

    /*
        Need to import this router within connectToServer()
        If not then _db will be undefined when you import it
        anywhere else.
    */
    const usersRouter = require('./routes/users');
    app.use('/users', usersRouter);
});



// module.exports = app;




