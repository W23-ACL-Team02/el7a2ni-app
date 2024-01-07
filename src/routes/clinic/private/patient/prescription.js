var express = require('express');
const { getPrescriptions,getPrescriptionById } = require('../../../../controllers-clinic/prescriptionController');
var router = express.Router();

router.get ('/viewprescription', getPrescriptions)
router.get('/selectedPrescription', getPrescriptionById);
module.exports = router;