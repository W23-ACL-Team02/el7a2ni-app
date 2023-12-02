var express = require('express');
var router = express.Router();

var userRouter = require('./private/user');
var adminRouter = require('./private/admin');
var familyMemberRouter = require('./private/familymember');
var doctorRouter = require('./private/doctors');
var prescriptionRouter= require('./private/prescription');
var doctor = require("./private/doctor");
var payment = require("./private/payment")
const authentiateToken = require("../middleware/authenticateToken");

// router.all('*', authentiateToken,(req, res, next) => {
//     if (!req.session?.loggedin) {
//         return res.end();
//     }

//     // Ensure any route through here is authenticated
//     next();
// })

router.use('/user', userRouter);
router.use('/admin', adminRouter);
router.use('/familymember', familyMemberRouter);
router.use('/doctors', doctorRouter);
router.use('/prescription',prescriptionRouter);
router.use('/patients', doctor);
router.use('/payment', payment)

module.exports = router;
