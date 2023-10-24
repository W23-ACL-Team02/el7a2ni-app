var express = require('express');
const userModel = require('../models/user.js');
var router = express.Router();

/* return to home */
router.get('/', (req, res) => {
  res.redirect('/');
})



router.post('/register/patient', async (req, res) => { //Update to their version
  // Add user to database
  const {username, name, email, password, dateOfBirth, gender, mobile, emergency_name, emergency_mobile, emergency_relation} = req.body;
  const emergencyContact = {
    name: emergency_name,
    mobile: emergency_mobile,
    relation: emergency_relation
  };
  const type = "patient";

  //The following are only needed for pharmacists and doctors so will be empty/0 for patients
  const status = ""; 
  const hourlyRate = 0; 
  const affiliation = "";
  const eduBackground = "";




  try {
    const user = await userModel.create({username, type,name, email, password, dateOfBirth, gender, mobile, status, hourlyRate, 
     affiliation, eduBackground, emergencyContact});
    await user.save();

    res.status(200).send(`User ${user.username} created successfully!`);
  } catch (error) {
    res.status(400).json({err:error.message});
  }
})

router.post('/register/pharmacist', async (req, res) => { //update to their version
  // Add user to database
  const {username, name, email, password, dateOfBirth, gender, mobile, hourlyRate, affiliation, eduBackground, emergency_name, emergency_mobile, emergency_relation} = req.body;
  const emergencyContact = {
    name: emergency_name,
    mobile: emergency_mobile,
    relation: emergency_relation
  };
  const type = "pharmacist";

  //pharmacist starts as pending before getting approved/declined by admin
  const status= "pending"; 



  try {
    const user = await userModel.create({username, type,name, email, password, dateOfBirth, gender, mobile, status,
      hourlyRate, affiliation, eduBackground, emergencyContact});
    await user.save();

    res.status(200).send('Registering Pharmacist!')
  } catch (error) {
    res.status(400).json({err:error.message});
  }



 
})

router.post('/login', (req, res) => {
  // Check if user exists
})


router.post('/admin/viewpatient', async(req,res)  => { //CHECK ADMIN CREDENTIALS
  //view patient's basic info without prescription
  //only works if field is full and correct, doesn't match all substrings
  
  

  try{
     const filter= req.body  //name/keyword i'm searching with

     const users = await userModel.find(filter);
     const usersFiltered= users.filter( (user) => user.type === "patient")

     res.render('viewpatient', {patients: usersFiltered})
   
      
  } catch(error){
     res.status(400).json({err:error.message})
  }
  
 })

 router.post('/admin/viewpharmacist', async(req,res)  => { //CHECK ADMIN CREDENTIALS
  
  //view pharmacists info
  

  try{
     const filter= req.body //keyword i'm filtering with

     const users = await userModel.find(filter);

     const usersFiltered= users.filter( (user) => user.type === "pharmacist") //retrieve only pharmacist types

     res.render('viewpharmacist', {pharmacists: usersFiltered})
   
      
  } catch(error){
     res.status(400).json({err:error.message})
  }
  
 })

 router.get('/admin/viewpharmainfo', async(req,res)  => { //CHECK ADMIN CREDENTIALS
  //view pharmacist's info uploaded to join platform
  

 
  try{

     const filter= {status: "pending"}  //only pharmacists pending approval

     const users = await userModel.find(filter);

     const usersFiltered= users.filter( (user) => user.type === "pharmacist") //retrieve only pharmacist types

     res.render('viewpendingpharma', {pharmacists: usersFiltered})  
  
     
 } catch(error){
    res.status(400).json({err:error.message})
 }
  
 })


module.exports = router;
