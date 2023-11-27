var express = require('express');
var router = express.Router({mergeParams: true});
const healthPackageRouter = require(`./patient/healthPackage.js`);

router.all('*', (req, res, next) => {
  // Ensure admin
  if (req.session.userType != 'patient') 
    return res.status(403).send('Unauthorized Access.');
  next();
});

router.use(`/healthPackage`, healthPackageRouter);

module.exports = router;