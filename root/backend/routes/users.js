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
router.get('/:username', function (req, res) {
    _db.collection('users').find({'username': req.params.username}).toArray(function (err, result) {
        if (err) throw err

        /**
         * To-Do
         * Make React LoginComponent interact with this endpoint by
         * making HTTP requests with axios.
         */
        // res.send(result);
        res.send(result);
    });
});


module.exports = router;