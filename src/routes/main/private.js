var express = require('express');
var router = express.Router({mergeParams: true});
const authentiateToken = require('../../middleware/authenticateToken');

const userRouter = require('./private/user')

router.all('*', authentiateToken,(req, res, next) => {
    if (!req.session?.loggedin) {
        return res.end();
    }

    // Ensure any route through here is authenticated
    next();
})

router.use(`/user`, userRouter)

module.exports = router;