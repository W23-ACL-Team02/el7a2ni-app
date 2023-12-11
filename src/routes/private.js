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
>>>>>>> b22fb14d88b99dddb9500bf589149392d9f0aa64
const authentiateToken = require('../middleware/authenticateToken');

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
<<<<<<< HEAD
router.use('/payment', paymentRouter);
router.use('/email', emailRouter)
=======
router.use('/patient', patientRouter);
>>>>>>> b22fb14d88b99dddb9500bf589149392d9f0aa64

module.exports = router;
