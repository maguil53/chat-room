const express = require('express');
const router = express.Router();
const mongoUtil = require('../mongoUtil.js');
const _db = mongoUtil.getDb();



router.get('/', function (req, res) {
    _db.collection('users').find().toArray(function (err, result) {
        if (err) throw err

        /**
         * To-Do
         * Make React LoginComponent interact with this endpoint by
         * making HTTP requests with axios.
         */
        res.send(result);
    });
});


module.exports = router;