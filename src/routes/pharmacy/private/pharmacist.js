var express = require('express');
var router = express.Router({mergeParams: true});

const medicineRouter = require(`./pharmacist/medicinearchive.js`);


const authorizeUser = require('../../../middleware/authorizeUser.js');

router.all('*', (req, res, next) => {
  // Ensure pharmacist
  if (!authorizeUser(req, res, ["pharmacist"])) return;

  next();
});

router.use(`/medicine`, medicineRouter);

module.exports = router;