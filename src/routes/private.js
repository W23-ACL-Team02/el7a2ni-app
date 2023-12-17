var express = require('express');
var router = express.Router({mergeParams: true});

var userRouter = require('./private/user');
var adminRouter = require('./private/admin');
var familyMemberRouter = require('./private/familymember');
var familyRouter = require('./private/family');
var doctorRouter = require('./private/doctors');
var patientRouter = require('./private/patient');
var patientRouter2 = require('./private/patientRouter');
var prescriptionRouter= require('./private/prescription');
var doctor = require("./private/doctor");
var payment = require("./private/payment")
var doctorPatient = require("./private/doctorPatient");
const authentiateToken = require("../middleware/authenticateToken");

router.all('*', authentiateToken,(req, res, next) => {
    if (!req.session?.loggedin) {
        return res.end();
    }

    // Ensure any route through here is authenticated
    next();
})

router.use('/admin', adminRouter);
router.use('/user', userRouter);

router.use('/family', familyRouter);
router.use('/familymember', familyMemberRouter);

router.use('/prescription', prescriptionRouter);

router.use('/doctor', doctor);
router.use('/doctors', doctorRouter);
router.use('/doctorPatient', doctorPatient)

router.use('/payment', payment)

router.use('/patient', patientRouter)
router.use('/patientRouter', patientRouter2);

module.exports = router;
