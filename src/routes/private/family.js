var express= require('express');
const { getFamilyIDs } = require('../../controllers/familyController');
const { cancelSubscriptionForFamilyMember, subscribeForFamilyMember } = require('../../controllers/patientController.js');
var router = express.Router({mergeParams: true}); 

router.get(`/`, getFamilyIDs)
router.post(`/cancel`, cancelSubscriptionForFamilyMember)
router.post(`/subscribe`, subscribeForFamilyMember)

module.exports = router;