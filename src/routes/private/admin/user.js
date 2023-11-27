var express = require('express');
var router = express.Router();
const { removeUser, addAdmin, getPatientById, getPharmacistById, getPatients, getPharmacists } = require('../../../controllers/userController');

router.delete('/removeUser', removeUser);
router.post('/addAdmin', addAdmin);
router.get('/patient/:id', getPatientById);
router.get('/pharmacist/:id', getPharmacistById);
router.get('/patients', getPatients);
router.get('/pharmacists', getPharmacists);

module.exports = router;