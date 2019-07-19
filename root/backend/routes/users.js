const express = require('express');
const router = express.Router();
const mongoUtil = require('../mongoUtil.js');
const _db = mongoUtil.getDb();


const bcrypt = require('bcrypt');
// Cost Factor (AKA Time taken to calculate)
// https://stackoverflow.com/questions/46693430/what-are-salt-rounds-and-how-are-salts-stored-in-bcrypt
const saltRounds = 10;

const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

/**
 * Create user
 * 
 * For now we'll assume each user created is unique.
 * Later, we need to check to make sure the username doesn't exists.
 */
router.post('/register/:username/:password', function(req,res) {
    // Hash password
    const plainPassword = req.params.password;
    bcrypt.hash(plainPassword, saltRounds,
        // Callback function called once hash is done.
        function(err, hashedPassword) {
            if (err) {
                next(err);
            }
            else {
                console.log("Hashed Password before storing");
                console.log(hashedPassword);
                // Store user into database.
                const newUser = {username: req.params.username, password: hashedPassword};
                _db.collection("users").insertOne(newUser, function(err, result) {
                    if(err) throw err;
                    
                    res.status(200).send("User Created");
                });
            }
      });
});

// User attempting to log in.
router.post('/:username/:password', function (req, res) {
    _db.collection('users').find({'username': req.params.username}).toArray(function (err, result) {
        if (err) throw err

        /**
         * User entered wrong username...
         * 
         * If you call res.send() in here you'll get "Error: Can't set headers after they are sent."
         * Apparently this means that we're in the http Body.
         * https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
         */
        if(result.length === 0) {
            // User not found!
            res.statusCode = 404;
            return;
        }
        
        /**
         * username found, now check password.
         * 
         * Compare password that was sent by the user (1st arg)
         * with the hashed password in the database (2nd arg)
         */
        console.log("Comparing...");
        console.log(req.params.password);
        bcrypt.compare(req.params.password, result[0].password, function(err, same) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    error: 'Internal error please try again'
                });
            } else if (!same){
                res.status(401)
                .json({
                  error: 'Incorrect email or password'
                });
            } else {
                // Issue Token
                console.log("Correct username and password!");
                const username = result[0].username

                // Payload needs to be an object
                const payload = { username };
                const token = jwt.sign(payload, process.env.SECRET, {
                    expiresIn: "1h"
                });

                // *Token is being created successfully...
                // console.log("Creating token:");
                // console.log(token);


                /**
                 * From Express Doc:
                 *      All res.cookie() does is set the HTTP Set-Cookie header 
                 *      with the options provided.
                 * 
                 * When you tag a cookie with the HttpOnly flag, it tells the browser
                 * that this particular cookie should only be accessed by the server.
                 * This doesn't completely prevent XSS attacks, but it helps.
                 */
                res.cookie('token', token, {httpOnly: true}).sendStatus(200);

                // Contains response from server
                // including the 'Access-Control-Allow-Credentials' header which is set to true
                // console.log(res);
            
            }
        });
    });
});


module.exports = router;