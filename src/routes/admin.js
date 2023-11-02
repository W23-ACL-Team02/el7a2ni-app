var express = require('express');
var router = express.Router();
const {addHealthPackage, updateHealthPackage, deleteHealthPackage, viewHealthPackage} = require("../controllers/healthPackage")

router.all('*', (req, res, next) => {
  // Ensure admin
  if (req.session.userType != 'admin') {
    return res.status(400).send('Unauthorized Access.')
  }

  next();
});

router.route('/healthPackage')
  .post(addHealthPackage)
  .put(updateHealthPackage)
  .delete(deleteHealthPackage)
  .get(viewHealthPackage)

// Temporary routes before react
router.post('/deleteHealthPackage', deleteHealthPackage);
router.post('/updateHealthPackage', updateHealthPackage);
router.get('/addHealthPackage', (req, res) => {
  res.status(200).render('adminHealthPackageAdd');
})

module.exports = router;