var express = require('express');
var router = express.Router({mergeParams: true});
const { searchDoctors, filterDoctors, viewDoctors, bookAppointment} = require('../../controllers/patientViewController.js');
const authorizeUser = require('../../middleware/authorizeUser');

router.all("*", (req, res, next) => {
    // Ensure patient
    if (!authorizeUser(req, res, ["patient"])) return;

    next();
})

router.get('/viewDoctors', viewDoctors);
router.post('/searchDoctors', searchDoctors);
router.get('/viewDoctorDetails/:id', filterDoctors);
router.post('/bookAppointment', bookAppointment);

module.exports= router;
