var express = require('express');
var router = express.Router({mergeParams: true});

var userRouter = require('./private/user');
var adminRouter = require('./private/admin');
var familyMemberRouter = require('./private/familymember');
var doctorRouter = require('./private/doctors');
var prescriptionRouter= require('./private/prescription');
<<<<<<< HEAD
var doctor = require("./private/doctor");
var payment = require("./private/payment")
=======
var doctorController = require("./private/doctorController");
var familyRouter = require(`./private/family`)
var patientRouter = require("./private/patient");
>>>>>>> b04cfa0ad03fcdb8f1176d87c0ab48981431980c
const authentiateToken = require("../middleware/authenticateToken");
const patientController = require('./private/patient');

// router.all('*', authentiateToken,(req, res, next) => {
//     if (!req.session?.loggedin) {
//         return res.end();
//     }

//     // Ensure any route through here is authenticated
//     next();
// })

router.use('/user', userRouter);
router.use('/admin', adminRouter);
router.use('/family', familyRouter);
router.use('/familymember', familyMemberRouter);
router.use('/doctors', [doctorRouter, doctorController]);
router.use('/prescription',prescriptionRouter);
<<<<<<< HEAD
router.use('/doctor', doctor);
router.use('/payment', payment)
=======
router.use('/patients', doctorController)
router.use('/patient', patientRouter)
>>>>>>> b04cfa0ad03fcdb8f1176d87c0ab48981431980c

module.exports = router;
