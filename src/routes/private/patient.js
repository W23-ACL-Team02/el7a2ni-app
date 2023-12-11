var express = require('express');
var router = express.Router({mergeParams: true});

const orderRouter = require(`./patient/order.js`);


router.all('*', (req, res, next) => { //TODO: remove comment
  // Ensure patient
  if (req.session.userType != 'patient') {
    return res.status(403).send('Unauthorized Access.')
  }

  next();
});

router.use(`/order`, orderRouter);

module.exports = router;