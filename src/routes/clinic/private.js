var express = require('express');
var router = express.Router({mergeParams: true});

var userRouter = require('./private/user');
var adminRouter = require('./private/admin');
var doctorRouter = require("./private/doctor");
var patientRouter = require('./private/patient');
var familyRouter = require('./private/family');
var payment = require("./private/payment");
const authentiateToken = require("../../middleware/authenticateToken");
//TODO
router.all('*', authentiateToken,(req, res, next) => {
    if (!req.session?.loggedin) {
        return res.end();
    }

     // Ensure any route through here is authenticated
    next();
})

router.use('/admin', adminRouter);
router.use('/doctor', doctorRouter);
router.use('/patient', patientRouter);

router.use('/user', userRouter);

router.use('/family', familyRouter);

router.use('/payment', payment)


module.exports = router;
