var express = require('express');
var router = express.Router({mergeParams: true});

const userRouter = require(`./admin/user.js`);
const pendingPharmacistsRouter = require('./admin/pendingPharmacists.js')

router.all('*', (req, res, next) => {
  // Ensure admin
  if (req.session.userType != 'admin') {
    return res.status(403).send('Unauthorized Access.')
  }

  next();
});

router.use(`/user`, userRouter);
router.use(`/pendingPharmacists`, pendingPharmacistsRouter);

module.exports = router;