var express = require('express');
const { getPrescriptions, addPrescriptionToCart } = require('../../../../controllers-clinic/prescriptionController');
var router = express.Router();

router.get ('/viewprescription', getPrescriptions);
router.get('/selectedPrescription', getPrescriptionById);
router.post('/addPrescriptionToCart/:id', addPrescriptionToCart);

module.exports = router;