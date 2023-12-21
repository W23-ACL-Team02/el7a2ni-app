var express = require('express');
const { getPrescriptions } = require('../../../../controllers-clinic/prescriptionController');
var router = express.Router();

router.get ('/viewprescription', getPrescriptions)

module.exports = router;