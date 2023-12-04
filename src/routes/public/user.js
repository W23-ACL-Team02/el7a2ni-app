var express = require('express');
var router = express.Router({mergeParams: true});
const { registerPharmacist, registerPatient, loginUsernamePassword } = require('../../controllers/userController.js');

router.post('/login', loginUsernamePassword);
router.post('/register/patient', registerPatient);
router.post('/register/pharmacist', registerPharmacist);

module.exports = router;