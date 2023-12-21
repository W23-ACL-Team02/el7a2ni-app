var express = require('express');
var router = express.Router({mergeParams: true});

const userRouter = require(`./admin/user.js`);
const pendingPharmacistsRouter = require('./admin/pendingPharmacists.js');
const medicineRouter = require('./admin/medicine.js');
const authorizeUser = require('../../../middleware/authorizeUser.js');

router.all('*', (req, res, next) => { //TODO: remove comment
  // Ensure admin
  if (!authorizeUser(req, res, ["admin"])) return;

  next();
});

router.use(`/user`, userRouter);
router.use(`/pendingPharmacists`, pendingPharmacistsRouter);
router.use(`/medicine`, medicineRouter);

module.exports = router;