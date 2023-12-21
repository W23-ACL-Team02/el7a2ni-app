var express = require('express');
var router = express.Router();
const patientController = require('../../../../controllers-clinic/patientController');

router.post('/subscribe', patientController.subscribeToHealthPackage);
router.get('/view', patientController.viewSubscriptionDetails);
router.post('/cancel', patientController.cancelSubscription);
router.post('/upgrade', patientController.upgradeSubscription);
router.post('/renew', patientController.renewSubscription);
router.get('/all', patientController.getHealthPackages);

module.exports = router;