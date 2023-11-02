var express = require('express');
var router = express.Router();
const {addHealthPackage, updateHealthPackage, deleteHealthPackage, viewHealthPackage} = require("../controllers/healthPackage")
const { getPendingDoctors } = require('../controllers/userController');

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

router.get('/pendingDoctors', (req, res) => {
  // Get doctor list
  try {
    const doctors = getPendingDoctors(req, res);
    
    return res.status(200).render('pendingDoctors', {doctors, count: doctors.length});
  } catch (error) {
    return res.status(400).json({err: error.message})
  }
})

router.post('/approveDoctor', (req, res) => {

})

router.post('/rejectDoctor', (req, res) => {

})

module.exports = router;