var express = require('express');
var router = express.Router({mergeParams: true});

var adminRouter = require('./private/admin');
var userRouter = require('./private/user');
var medicineRouter = require('./private/medicineController');
<<<<<<< HEAD
var paymentRouter = require('./private/payment')
var emailRouter = require('./private/email')
=======
var patientRouter = require('./private/patient');
>>>>>>> a2b2fcb3c991e470ba305c1626a803c1110f554a
const authentiateToken = require('../middleware/authenticateToken');

router.all('*', authentiateToken,(req, res, next) => { //TODO: REMOVE COMMENT
    if (!req.session?.loggedin) {
        return res.end();
    }

    // Ensure any route through here is authenticated
    next();
})

router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.use('/medicine', medicineRouter);
<<<<<<< HEAD
router.use('/payment', paymentRouter);
router.use('/email', emailRouter)
=======
router.use('/patient', patientRouter);
>>>>>>> a2b2fcb3c991e470ba305c1626a803c1110f554a

module.exports = router;
