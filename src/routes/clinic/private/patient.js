var express = require('express');
var router = express.Router({mergeParams: true});
const healthRecordRouter = require(`./patient/healthRecord.js`);
const healthPackageRouter = require(`./patient/healthPackage.js`);
const prescriptionRouter = require(`./patient/prescription.js`);
const { searchDoctors, filterDoctors, viewDoctors, bookAppointment} = require('../../../controllers-clinic/patientViewController.js');
const authorizeUser = require('../../../middleware/authorizeUser.js');

router.all("*", (req, res, next) => {
    // Ensure patient
    if (!authorizeUser(req, res, ["patient"])) return;

    next();
})

router.get('/viewDoctors', viewDoctors);
router.post('/searchDoctors', searchDoctors);
router.get('/viewDoctorDetails/:id', filterDoctors);
router.post('/bookAppointment', bookAppointment);

router.use(`/healthRecord`, healthRecordRouter);
router.use(`/healthPackage`, healthPackageRouter);
router.use(`/prescription`, prescriptionRouter);

module.exports= router;
