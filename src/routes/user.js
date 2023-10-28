var express = require('express');
const userModel = require('../models/user.js');
var router = express.Router();

router.get('/', function(req, res, next) {
  // Redirect back to home
  res.redirect('/');
});

router.post('/register/doctor', async (req, res) => {
    const {username, name, email, password, dateOfBirth, hourlyRate, affiliation, education_name, education_end} = req.body;
    const education = {
        name: education_name,
        endYear: education_end.split("-")[0]
    }
    const type = "doctor";
    const isAccepted = false;

    try {
        const user = await userModel.create({username, name, email, password, dateOfBirth, hourlyRate, affiliation, education, type, isAccepted});
        await user.save();
    
        res.status(200).send(`Doctor ${user.username} created successfully!`);
      } catch (error) {
        res.status(400).json({err:error.message});
      }
});

router.post('/register/patient', async (req, res) => {
  // Add user to database
  const {username, name, email, password, dateOfBirth, gender, mobile, emergency_name, emergency_mobile, emergency_relation} = req.body;
  const emergencyContact = {
    name: emergency_name,
    mobile: emergency_mobile,
    relation: emergency_relation
  };
  const type = "patient";



  try {
    const user = await userModel.create({username, name, email, password, dateOfBirth, gender, mobile, type, emergencyContact});
    await user.save();

    res.status(200).send(`Patient ${user.username} created successfully!`);
  } catch (error) {
    res.status(400).json({err:error.message});
  }
  // res.send('Registered patient');
});

module.exports = router;
