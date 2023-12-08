var express = require('express');
var router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {viewMyHealthRecords, uploadHealthRecordForTesting} = require("../../../controllers/patientController.js")

router.route('/')
  .get(viewMyHealthRecords)
  .post(upload.single('healthRecordDocument'), uploadHealthRecordForTesting)

module.exports = router;