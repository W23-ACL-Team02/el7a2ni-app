var express = require('express');
const { getPendingDoctors } = require('../controllers/userController');
var router = express.Router();

router.all('*', (req, res, next) => {
  // Ensure admin
  if (req.session.userType != 'admin') {
    return res.status(400).send('Unauthorized Access.')
  }

  next();
});

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