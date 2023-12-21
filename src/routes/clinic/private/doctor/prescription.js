var express= require('express');
var router = express.Router();
const { addPrescriptionView, addPrescriptionByDoctor, getPrescriptionById } = require('../../../controllers/prescriptionController.js');


router.get('/addprescription', addPrescriptionView); // TODO: Remove/Modify endpoint?

router.post('/addprescription', addPrescriptionByDoctor);
router.get('/selectedPrescription', getPrescriptionById);

module.exports=router;