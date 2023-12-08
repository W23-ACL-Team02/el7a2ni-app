var express = require('express');
var router = express.Router({mergeParams: true});

var userRouter = require('./private/user');
var adminRouter = require('./private/admin');
var familyMemberRouter = require('./private/familymember');
var doctorRouter = require('./private/doctors');
var patientRouter = require('./private/patient');
var prescriptionRouter= require('./private/prescription');
var doctor = require("./private/doctor");
var payment = require("./private/payment")
const authentiateToken = require("../middleware/authenticateToken");
const patientController = require('./private/patient');

router.all('*', authentiateToken,(req, res, next) => {
    if (!req.session?.loggedin) {
        return res.end();
    }

    // Ensure any route through here is authenticated
    next();
})

router.use('/user', userRouter);
router.use('/admin', adminRouter);
router.use('/familymember', familyMemberRouter);
router.use('/doctors', doctorRouter);
router.use('/prescription',prescriptionRouter);
router.use('/doctor', doctor);
router.use('/payment', payment)
router.use('/patient', patientRouter)

module.exports = router;
