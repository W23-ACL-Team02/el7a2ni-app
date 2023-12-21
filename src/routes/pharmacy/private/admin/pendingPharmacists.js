var express = require('express');
var router = express.Router();
const { getPendingPharmacists, acceptPharmacist, rejectPharmacist } = require('../../../controllers/userController');

router.get('/', getPendingPharmacists);
router.put('/approve', acceptPharmacist);
router.put('/reject', rejectPharmacist);

module.exports = router;