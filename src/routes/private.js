var express = require('express');
var router = express.Router({mergeParams: true});

var adminRouter = require('./private/admin');
var userRouter = require('./private/user');
var medicineRouter = require('./private/medicineController');
var paymentRouter = require('./private/payment')
var emailRouter = require('./private/email')
const authentiateToken = require('../middleware/authenticateToken');

router.all('*', authentiateToken,(req, res, next) => {
    if (!req.session?.loggedin) {
        return res.end();
    }

    // Ensure any route through here is authenticated
    next();
})

router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.use('/medicine', medicineRouter);
router.use('/payment', paymentRouter);
router.use('/email', emailRouter)

module.exports = router;
