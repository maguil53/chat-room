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
/**
 * Without cors() option "credentials: true", our XMLHttpRequest to 
 * http://localhost:5000/users/:username/:password will be BLOCKED.
 * 
 * Our value for the 'Access-Control-Allow-Credentials' response header 
 * will be '' , and it needs to be "true" when the request (from our client-side)
 * has its credentials mode to 'include' (I'm assuming they're talking about the fact
 * that in our POST request w/ axios we set the option "withCredentials" to "true") 
 */
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




