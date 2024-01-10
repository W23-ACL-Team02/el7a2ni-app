var express = require('express');
var router = express.Router({mergeParams: true});
const healthRecordRouter = require(`./patient/healthRecord.js`);
const healthPackageRouter = require(`./patient/healthPackage.js`);
const prescriptionRouter = require(`./patient/prescription.js`);
const { searchDoctors, filterDoctors, viewDoctors, bookAppointment,bookAppointmentForFamily, loadFollowUpPage, PatientRequestFollowUp} = require('../../../controllers-clinic/patientViewController.js');
const{rescheduleAppointment,rescheduleAppointmentForFamily,cancelAppointment,cancelAppointmentForFamily,notCompletedPatientAppointments,notCompletedFamilyAppointments}= require('../../../controllers-clinic/appointmentController.js');

const authorizeUser = require('../../../middleware/authorizeUser.js');
// TODO
// router.all("*", (req, res, next) => {
//     // Ensure patient
//     if (!authorizeUser(req, res, ["patient"])) return;

//     next();
// })

router.get('/viewDoctors', viewDoctors);
router.post('/searchDoctors', searchDoctors);
router.get('/viewDoctorDetails/:id', filterDoctors);
router.post('/bookAppointment', bookAppointment);
router.get('/loadFollowUpPage', loadFollowUpPage);
router.post('/PatientRequestFollowUp', PatientRequestFollowUp);

router.use(`/healthRecord`, healthRecordRouter);
router.use(`/healthPackage`, healthPackageRouter);
router.use(`/prescription`, prescriptionRouter);

router.post('/rescheduleAppointment',rescheduleAppointment);
router.post('/rescheduleAppointmentForFamily',rescheduleAppointmentForFamily);
router.post('/cancelAppointment',cancelAppointment);
router.post('/cancelAppointmentForFamily',cancelAppointmentForFamily);
router.post('/bookAppointmentForFamily',bookAppointmentForFamily);
router.get('/notCompletedPatientAppointments', notCompletedPatientAppointments);
router.get('/notCompletedFamilyAppointments', notCompletedFamilyAppointments);
module.exports= router;
