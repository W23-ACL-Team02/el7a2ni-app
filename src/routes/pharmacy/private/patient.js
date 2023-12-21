var express = require('express');
var router = express.Router({mergeParams: true});

const cartRouter = require(`./patient/cart.js`);
const orderRouter = require(`./patient/order.js`);

const authorizeUser = require('../../../middleware/authorizeUser.js');

router.all('*', (req, res, next) => {
  // Ensure patient
  if (!authorizeUser(req, res, ["patient"])) return;

  next();
});

router.use(`/cart`, cartRouter);
router.use(`/order`, orderRouter);

module.exports = router;