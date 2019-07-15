const express = require('express');
const router = express.Router();
const mongoUtil = require('../mongoUtil.js');
const _db = mongoUtil.getDb();


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


        /**
         * To-Do
         * Make React LoginComponent interact with this endpoint by
         * making HTTP requests with axios.
         */
        
    });
});


module.exports = router;