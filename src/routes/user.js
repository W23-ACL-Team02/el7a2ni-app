var express = require('express');
const userModel = require('../models/user.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Virtual Clinic' });
});

// router.put('/addFamily/:username', async (req, res) => {
//     // Fetch user
//     const {nameOf, nationalID, age, gender, relation} = req.body;
//     const username = req.params.username;
//     let user = await userModel.findOne({username});
  
//     // Add family member
//     user.addFamilyMember(req.body);
  
//     // Save
//     await user.save();
  
//     return res.status(200).send("Ok")
//   })
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

module.exports = router;
