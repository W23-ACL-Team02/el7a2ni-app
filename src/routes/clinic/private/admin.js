var express = require('express');
var router = express.Router({mergeParams: true});
const healthPackageRouter = require(`./admin/healthPackage.js`);
const pendingDoctorsRouter = require(`./admin/pendingDoctors.js`);
const userRouter = require(`./admin/user.js`);
const authorizeUser = require('../../../middleware/authorizeUser.js');

router.all('*', (req, res, next) => {
  // Ensure admin
  if (!authorizeUser(req, res, ["admin"])) return;

  next();
});

router.use(`/healthPackage`, healthPackageRouter);
router.use(`/pendingDoctors`, pendingDoctorsRouter);
router.use(`/user`, userRouter);

module.exports = router;