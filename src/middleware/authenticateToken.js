const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    // Assign bearer token to that provided in cookie, or if undefined, try from auth header
    let token;
    let bearer;
    if (req.cookies?.jwt !== undefined) {
        token = req.cookies.jwt;
    } else {
        bearer = req.headers?.authorization;
        token = bearer.split(' ')[1];
    }
    
    if (bearer == undefined && token == undefined) {
        return res.status(403).json({errors: ["No credentials provided"]});
    }

    jwt.verify(token, secret, (err, decode) => {
        // Error occured while verifying token
        if (err) {
            console.log(err.message)
            res.status(400).send(err);

            return;
        }

        // Assign decoded items to session
        req.session = decode;
    })

    next();
}

module.exports = authenticateToken;