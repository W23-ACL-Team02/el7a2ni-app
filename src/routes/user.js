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
    
    // TODO: Ensure username not taken

    // TODO: Ensure email not taken
    
    await user.save();

    res.status(200).send(`User ${user.username} created successfully!`);
  } catch (error) {
    res.status(400).json({err:error.message});
  }
})

router.post('/register/pharmacist', async (req, res) => {
  const {username, name, email, password, dateOfBirth, hourlyRate, affiliation, education_name, education_end} = req.body;
  const education = {
    name: education_name,
    endYear: education_end.split("-")[0]
  }
  const type = "pharmacist";
  const isAccepted = false;

  try {
    const user = await userModel.create({username, name, email, password, dateOfBirth, hourlyRate, affiliation, education, type, isAccepted});
    
    // TODO: Ensure username not taken

    // TODO: Ensure email not taken
    
    await user.save();


    res.status(200).send(`Pharmacist ${user.username} created successfully!`);
  } catch (error) {
    res.status(400).json({err:error.message});
  }
});

router.post('/login', async (req, res) => {
  const {username, password} = req.body;
  
  try {
    // Check for user in database
    const user = await userModel.findOne({username: username});
    
    if (!user || password != user.password || user.type == 'doctor') {
      // If not found reload page with error message
      return res.redirect('/login')

    } else if (user?.type == 'pharmacist' && !user.isAccepted) {
      return res.status(400).send(`Pharmacist ${user.name} not yet approved.`)
      
    } else {
      // Else load session variables
      req.session.loggedin = true;
      req.session.userId = user?._id;
      req.session.userType = user?.type;

      return res.redirect('/home');
    }
  } catch (error) {
    res.status(400).json({err:error.message});
  }
})

module.exports = router;
