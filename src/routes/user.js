var express = require('express');
const userModel = require('../models/user.js');
var router = express.Router();

router.get('/', function(req, res, next) {
  // Redirect back to home
  res.redirect('/');
});

router.post('/register/doctor', (req, res) => {
  // username, name, email, password, date of birth, hourly rate, 
  // affiliation (hospital), educational background.
  res.send('Registered doctor');
});

router.post('/register/patient', async (req, res) => {
  // Add user to database
  const {username, name, email, password, dateOfBirth, gender, mobile, emergency_name, emergency_mobile} = req.body;
  const emergencyContact = {
    name: emergency_name,
    mobile: emergency_mobile
  };
  const type = "patient";



  try {
    const user = await userModel.create({username, name, email, password, dateOfBirth, gender, mobile, type, emergencyContact});
    await user.save();

    res.status(200).send(`User ${user.username} created successfully!`);
  } catch (error) {
    res.status(400).json({err:error.message});
  }
  // res.send('Registered patient');
});

module.exports = router;
