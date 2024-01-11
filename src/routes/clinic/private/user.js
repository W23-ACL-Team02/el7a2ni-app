var express = require('express');
var router = express.Router();
const multer = require('multer');

const { getSelf, logout, changePassword, uploadDocument, removeDocument, getDocuments } = require('../../../controllers-clinic/userController.js');
const { filterAppointments, allAppointments,upcomingCompAppointments, addAppointmentTest,filterAppointmentsByStatus } = require('../../../controllers-clinic/appointmentController.js');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/upcomingCompletedAppointments', upcomingCompAppointments);

//router.get('/upcomingCompletedAppointments', upcomingCompletedAppointments);
router.get('/filterAppointments', filterAppointments);
router.get('/filterAppointmentsByStatus', filterAppointmentsByStatus);
//for testing
router.get('/allAppointments', allAppointments); // TODO: remove these?
//AddApointment for testing 
router.post('/addAppointment', addAppointmentTest);

router.post('/changePassword', changePassword);
router.get('/getSelfUser', getSelf);
router.get('/logout', logout);

router.post('/uploadDocuments', upload.fields([{ name: 'medicalHistory'}]), uploadDocument); // TODO: Is patient only route
router.post('/removeDocuments', removeDocument);
router.get('/documents', getDocuments);

module.exports = router;