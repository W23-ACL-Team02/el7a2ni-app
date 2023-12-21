var express = require('express');
var router = express.Router();
const { getPendingDoctors, rejectDoctor, acceptDoctor } = require('../../../../controllers-clinic/userController.js');

router.get('/', getPendingDoctors);
router.put('/approve', acceptDoctor);
router.put('/reject', rejectDoctor);

module.exports = router;