const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

const withAuth = function(req, res, next) {
    // Res.cookies is null
    console.log(req.cookies);
    const token =
        req.body.token ||
        req.query.token ||
        req.headers['x-access-token'] ||
        req.cookies.token;

    //undefined
    console.log(token);

    if (!token) {
        // We keep going in here because token = undefined.
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                req.username = decoded.username;
                next();
            }
        });
    }
}
module.exports = withAuth;