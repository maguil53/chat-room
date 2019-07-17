const express = require('express');
const router = express.Router();
const mongoUtil = require('../mongoUtil.js');
const _db = mongoUtil.getDb();

const bcrypt = require('bcrypt');
// Cost Factor (AKA Time taken to calculate)
// https://stackoverflow.com/questions/46693430/what-are-salt-rounds-and-how-are-salts-stored-in-bcrypt
const saltRounds = 10;


// Create user
router.post('/register/:username/:password', function(req,res) {

    // For now we'll assume each user created is unique
    // Later, we need to check to make sure the username doesn't exists.


    // Hash password
    const plainPassword = req.params.password;
    bcrypt.hash(plainPassword, saltRounds,
        // Callback function called once hash is done.
        function(err, hashedPassword) {
            if (err) {
                next(err);
            }
            else {
                // Store user into database.
                const newUser = {username: req.params.username, password: hashedPassword};
                _db.collection("users").insertOne(newUser, function(err, result) {
                    if(err) throw err;
                    
                    res.status(200).send("User Created");
                });
            }
      });
});
/**
 * Have this return only the username for now. Because we don't want to return
 * the password too if the username exists (for obvious reasons).
 * 
 * For now this is fine bc we haven't implemented hashing.
 */
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
            res.statusCode = 404;
            return;
        }
        
        /**
         * Take the password in the database, unhash it, and compare it to the 
         * password passed in from the form.
         */
        if(result[0].password === req.params.password) {
            res.send(true);
        } else {
            res.send(false);
        }      
    });
});


module.exports = router;