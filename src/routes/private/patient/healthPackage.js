var express = require('express');
var router = express.Router();
const { subscribeToHealthPackage } = require('../../../controllers/patientController.js');

router.post('/subscribe', subscribeToHealthPackage);

module.exports = router;