var express = require('express');
var router = express.Router();
const { nukeMedicineDB } = require('../../../../controllers-pharmacy/medicineController.js');

router.delete('/nuke', nukeMedicineDB)

module.exports = router;