var express= require('express');
var router = express.Router();
const { addPrescriptionView, addPrescriptionByDoctor, getPrescriptionById,getPrescriptions } = require('../../../../controllers-clinic/prescriptionController.js');


router.get('/addprescription', addPrescriptionView); // TODO: Remove/Modify endpoint?

router.post('/addprescription', addPrescriptionByDoctor);
router.get('/selectedPrescription', getPrescriptionById);
router.get('/viewprescription',getPrescriptions);

module.exports=router;