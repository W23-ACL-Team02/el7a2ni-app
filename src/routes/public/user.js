var express = require('express');
var router = express.Router({mergeParams: true});
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { loginUsernamePassword, registerDoctor, registerPatient } = require('../../controllers/userController.js');

router.post('/login', loginUsernamePassword);
router.post('/register/doctor',upload.fields([
    { name: 'idDocument', maxCount: 1 },
    { name: 'medicalDegree', maxCount: 1 },
    { name: 'medicalLicense', maxCount: 1 }
  ]), registerDoctor);
router.post('/register/patient', registerPatient);

module.exports = router;