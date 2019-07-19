const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const mongoUtil = require('./mongoUtil.js');
const cookieParser = require('cookie-parser');
const withAuth = require('./token-middleware');

// Used so we can store Environment Variables inside our .env file
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


// Options object gives http://localhost:3000 access to create token without errors
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
// app.use(cors());
// This includes everything that Body-Parser includes
app.use(express.json());
app.use(cookieParser());


// Using mongoUtil module to connect to MongoDB.
mongoUtil.connectToServer(function(err, client) {
    if(err) console.log(err);

    // Start Express Server once connected to database.
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });

    app.get('/home', withAuth, function(req, res) {
        // We're never reaching this part because withAuth
        // throws an error
        console.log("req object...");
        console.log(req);
        res.send('The password is potato');
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




