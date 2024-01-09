var express = require('express');
const { getPrescriptions,getPrescriptionById,updatePrescription } = require('../../../../controllers-clinic/prescriptionController');
var router = express.Router();

router.get ('/viewprescription', getPrescriptions)
router.get('/selectedPrescription', getPrescriptionById);
router.post('/updatePrescription',updatePrescription)
module.exports = router;