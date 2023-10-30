var express = require('express');
const userModel = require('../models/user.js');
var router = express.Router();
const familymemberSchema = require("../models/familymembers.js"); 

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


router.post('/register/pharmacist', async (req, res) => {
  const {username, name, email, password, dateOfBirth, hourlyRate, affiliation, education_name, education_end} = req.body;
  const education = {
    name: education_name,
    endYear: education_end.split("-")[0]
  }
  const type = "pharmacist";
  const acceptanceStatus = 'pending';

  try {
    const user = await userModel.create({username, name, email, password, dateOfBirth, hourlyRate, affiliation, education, type, acceptanceStatus});
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

    } else if (user?.type == 'pharmacist' && user.acceptanceStatus != "accepted") {
      return res.status(400).send(`Pharmacist ${user.name} ${(user.acceptanceStatus == 'pending' ? "not yet approved.":"rejected.")}`)
      
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


//fetching patient info route
router.get('/patient/:id', async (req,res) => {
  // Ensure admin access
  if(req.session.userType != "admin") {
    return res.status(400).send("Unauthorized Access");
  }
  
  try {
    const patient = await userModel.findById(req.params.id);
    const familyMembers = patient.family;

    res.render('viewpatient', {patient: patient, family: familyMembers});
  } catch(error) {
    res.status(400).json({err: error.message});
  }
})


//fetching pharmacist info route
router.get('/pharmacist/:id', async (req,res) => {
  // Ensure admin access
  if(req.session.userType != "admin") {
    return res.status(400).send("Unauthorized Access");
  }
  
  try {
    const pharmacist = await userModel.findById(req.params.id);

    res.render('viewpharmacist', {pharmacist})
  } catch(error) {
    res.status(400).json({err: error.message});
  }  
})


//all patients
router.get('/admin/patients', async(req,res)  => { 
  // Ensure admin access
  if(req.session.userType != "admin") {
    return res.status(400).send("Unauthorized Access");
  }

  try {
    const users = await userModel.find();
    const usersFiltered= users.filter( (user) => user.type === "patient") //only patient types

    res.render('patients', {patients: usersFiltered})
  } catch(error){
    res.status(400).json({err:error.message})
  }
})


//all pharmacists
router.get('/admin/pharmacists', async(req,res)  => { 
  // Ensure admin access
  if(req.session.userType != "admin") {
    return res.status(400).send("Unauthorized Access");
  }

  try {
    //retrieve only pharmacist types who are accepted
    const users = await userModel.find();
    const usersFiltered = users.filter((user) => user.acceptanceStatus == 'accepted' && user.type == "pharmacist")

    res.render('pharmacists', {pharmacists: usersFiltered})
  } catch(error){
    res.status(400).json({err:error.message})
  }
})

 //admin views info of pending pharmacists
router.get('/admin/viewpendingpharma', async(req,res)  => { 
  // Ensure admin access
  if(req.session.userType != "admin") {
    return res.status(400).send("Unauthorized Access");
  }
 
  try {
    //retrieve only pending pharmacists
    const users = await userModel.find();
    const usersFiltered= users.filter((user) => user.acceptanceStatus == 'pending' && user.type == "pharmacist") 

    res.render('viewpendingpharma', {pharmacists: usersFiltered})  
  } catch(error) {
    res.status(400).json({err:error.message})
  }
})

module.exports = router;
