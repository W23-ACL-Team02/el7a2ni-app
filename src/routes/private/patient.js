var express = require('express');

var router = express.Router({mergeParams: true});
const healthRecordController = require(`./patient/healthRecord.js`);


router.all('*', (req, res, next) => {
  // Ensure patient
  if (req.session.userType != 'patient') {
    return res.status(403).send('Unauthorized Access.')
  }

  next();
});

router.use(`/healthRecord`, healthRecordController);

module.exports = router;