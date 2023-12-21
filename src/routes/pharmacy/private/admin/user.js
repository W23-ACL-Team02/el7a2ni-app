var express = require('express');
var router = express.Router();
const { removeUser, addAdmin, getPatientById, getPharmacistById, getPatients, getPharmacists, getPendingPharmacists } = require('../../../../controllers-pharmacy/userController');



router.post('/removeUser', removeUser);
router.post('/addAdmin', addAdmin);
router.get('/patient/:id', getPatientById);
router.get('/pharmacist/:id', getPharmacistById);
router.get('/patients', getPatients);
router.get('/pharmacists', getPharmacists);
router.get('/pendingpharmacists', getPendingPharmacists);

module.exports = router;