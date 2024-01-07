var express = require('express');
var router = express.Router({mergeParams: true});

var adminRouter = require('./private/admin');
var userRouter = require('./private/user');
var medicineRouter = require('./private/medicine');
var paymentRouter = require('./private/payment')
var emailRouter = require('./private/email')
var patientRouter = require('./private/patient');
const authentiateToken = require('../../middleware/authenticateToken');

// router.all('*', authentiateToken,(req, res, next) => { //TODO: REMOVE COMMENT
//     if (!req.session?.loggedin) {
//         return res.end();
//     }

//     // Ensure any route through here is authenticated
//     next();
// })

router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.use('/medicine', medicineRouter);
router.use('/payment', paymentRouter);
router.use('/email', emailRouter)
router.use('/patient', patientRouter);

module.exports = router;
