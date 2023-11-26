const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const bearer = req.headers?.authorization;

    if (bearer == undefined) {
        return res.status(403).json({errors: ["No credentials provided"]});
    }

    const token = bearer.split(' ')[1];

    jwt.verify(token, secret, (err, decode) => {
        // Error occured while verifying token
        if (err) {
            res.status(400).send(err);

            return;
        }

        // Assign decoded items to session
        req.session = decode;
    })

    next();
}

module.exports = authenticateToken;