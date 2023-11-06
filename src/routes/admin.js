var express = require('express');
var router = express.Router();
const userModel = require('../models/user.js');
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

router.get('/pendingDoctors', async (req, res) => {
  // Get doctor list
  try {
    const doctors = await getPendingDoctors(req, res);
    
    if (req.query?.id == undefined) {
      return res.status(200).render('adminPendingDoctorsViewAll', {doctors, count: doctors.length});
    } else {
      return res.status(200).render('adminPendingDoctorsViewOne', {doctors, count:doctors.length});
    }
  } catch (error) {
    return res.status(400).json({err: error.message})
  }
})

router.post('/approveDoctor', async (req, res) => {
  const _id = req.body._id;

  try {
    // Update user
    await userModel.findByIdAndUpdate(_id, {acceptanceStatus: 'accepted'});

    return res.status(200).send(`Successfully approved doctor ${_id}`);
  } catch (error) {
    return res.status(400).json({err: error.message});
  }
})

router.post('/rejectDoctor', async (req, res) => {
  const _id = req.body._id;

  try {
    // Update user
    await userModel.findByIdAndUpdate(_id, {acceptanceStatus: 'rejected'});

    return res.status(200).send(`Successfully rejected doctor ${_id}`);
  } catch (error) {
    return res.status(400).json({err: error.message});
  }
})

module.exports = router;