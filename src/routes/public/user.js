var express = require('express');
var router = express.Router({mergeParams: true});
const { loginUsernamePassword, registerDoctor, registerPatient } = require('../../controllers/userController.js');

router.post('/login', loginUsernamePassword);
router.post('/register/doctor', registerDoctor);
router.post('/register/patient', registerPatient);

module.exports = router;