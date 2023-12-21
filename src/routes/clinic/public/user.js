var express = require('express');
var router = express.Router({mergeParams: true});
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { loginUsernamePassword, registerDoctor, registerPatient, verifyEmail, sendOTP, VerifyOTP, resetPassword } = require('../../../controllers-clinic/userController.js');

router.post('/login', loginUsernamePassword);
router.post('/register/doctor',upload.fields([
    { name: 'idDocument', maxCount: 1 },
    { name: 'medicalDegree', maxCount: 1 },
    { name: 'medicalLicense', maxCount: 1 }
  ]), registerDoctor);
router.post('/register/patient', registerPatient);
router.post('/verifyEmail',verifyEmail);
router.post('/sendOTP',sendOTP);
router.post('/VerifyOTP',VerifyOTP);
router.post('/resetPassword',resetPassword);

module.exports = router;