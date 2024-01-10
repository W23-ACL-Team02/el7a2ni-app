var express = require('express');
var router = express.Router({mergeParams: true});

const medicineRouter = require(`./pharmacist/medicinearchive.js`);
const medicineRouter2 = require(`./medicine.js`);


const authorizeUser = require('../../../middleware/authorizeUser.js');

router.all('*', (req, res, next) => {
  // Ensure pharmacist
  if (!authorizeUser(req, res, ["pharmacist"])) return;

  next();
});

router.use(`/medicine`, medicineRouter);
router.use(`/medicine`, medicineRouter2);

module.exports = router;