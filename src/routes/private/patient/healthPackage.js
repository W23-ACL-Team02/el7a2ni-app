var express = require('express');
var router = express.Router();
const patientController = require('../../../controllers/patientController.js');

router.post('/subscribe', patientController.subscribeToHealthPackage);
router.get('/view', patientController.viewSubscriptionDetails);
router.post('/cancel', patientController.cancelSubscription);
router.post('/upgrade', patientController.upgradeSubscription);
router.post('/renew', patientController.renewSubscription);

module.exports = router;