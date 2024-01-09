var express = require('express');
const { archiveMedicine} = require('../../../../controllers-pharmacy/medicineController');

var router = express.Router();

router.put('/archive', archiveMedicine);

 module.exports = router;