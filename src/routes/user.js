var express = require('express');
const userModel = require('../models/user.js');
var router = express.Router();

/* return to home */
router.get('/', (req, res) => {
  res.redirect('/');
})

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

    res.status(200).send(`User ${user.username} created successfully!`);
  } catch (error) {
    res.status(400).json({err:error.message});
  }
})

router.post('/register/pharmacist', (req, res) => {
  // Add user to database
  res.status(200).send('Registering Pharmacist!')
})

router.post('/login', (req, res) => {
  // Check if user exists
})

module.exports = router;
