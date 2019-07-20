const jwt = require('jsonwebtoken');
// If I don't have this, then process.env.SECRET will be undefined.
require('dotenv').config();

const secret = process.env.SECRET;

const withAuth = function(req, res, next) {
    const token =
        req.body.token ||
        req.query.token ||
        req.headers['x-access-token'] ||
        req.cookies.token;


    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                // if(err.name === 'TokenExpiredError') {
                //     console.log("Token expired!!!!");
                // }
                console.log(err);
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                req.username = decoded.username;
                next();
            }
        });
    }
}
module.exports = withAuth;