var express = require('express');
var router = express.Router({mergeParams: true});
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { registerPharmacist, registerPatient, loginUsernamePassword,verifyEmail,sendOTP,VerifyOTP,resetPassword } = require('../../controllers/userController.js');

router.post('/login', loginUsernamePassword);
router.post('/register/patient', registerPatient);
router.post('/register/pharmacist', upload.fields([
    { name: 'idDocument', maxCount: 1 },
    { name: 'pharmacyDegree', maxCount: 1 },
    { name: 'workingLicense', maxCount: 1 }
  ]),registerPharmacist);
  router.post('/verifyEmail',verifyEmail);
  router.post('/sendOTP',sendOTP);
  router.post('/VerifyOTP',VerifyOTP);
  router.post('/resetPassword',resetPassword);
module.exports = router;