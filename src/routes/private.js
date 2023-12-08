var express = require('express');
var router = express.Router({mergeParams: true});

var userRouter = require('./private/user');
var adminRouter = require('./private/admin');
var familyMemberRouter = require('./private/familymember');
var doctorRouter = require('./private/doctors');
var prescriptionRouter= require('./private/prescription');
var doctorController = require("./private/doctorController");
var familyRouter = require(`./private/family`)
const authentiateToken = require("../middleware/authenticateToken");

router.all('*', authentiateToken,(req, res, next) => {
    if (!req.session?.loggedin) {
        return res.end();
    }

    // Ensure any route through here is authenticated
    next();
})

router.use('/user', userRouter);
router.use('/admin', adminRouter);
router.use('/family', familyRouter);
router.use('/familymember', familyMemberRouter);
router.use('/doctors', doctorRouter);
router.use('/prescription',prescriptionRouter);
router.use('/patients', doctorController)

module.exports = router;
