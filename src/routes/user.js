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

//fetching patient info route
router.get('/patient/:id', async (req,res) => {

    try{

        const patient= await userModel.findById(req.params.id);
       //res.status(200).json(patient);
        res.render('viewpatient', {patient})
    } catch(error){
      res.status(400).send("Cannot fetch patient"); //change to error message?
    }
})


//fetching pharmacist info route
router.get('/pharmacist/:id', async (req,res) => {

    try{
      const pharmacist= await userModel.findById(req.params.id);
      res.render('viewpharmacist', {pharmacist})
    } catch(error){
      res.status(400).send("Cannot fetch pharmacist");
    }
})


//all patients
router.get('/admin/patients', async(req,res)  => { //CHECK ADMIN CREDENTIALS
  
  
  

  try{
     //const filter= req.body  //name/keyword i'm searching with

     const users = await userModel.find();
     const usersFiltered= users.filter( (user) => user.type === "patient") //only patient types

     res.render('patients', {patients: usersFiltered})
   
      
  } catch(error){
     res.status(400).json({err:error.message})
  }
  
 })






//all pharmacists
 router.get('/admin/pharmacists', async(req,res)  => { //CHECK ADMIN CREDENTIALS
  
  //view pharmacists info
  

  try{
    const users = await userModel.find();
    const usersFiltered= users.filter( (user) => user.type === "pharmacist") //retrieve only pharmacist types

     res.render('pharmacists', {pharmacists: usersFiltered})
   
      
  } catch(error){
     res.status(400).json({err:error.message})
  }
  
 })

 //admin views info of pending pharmacists
 router.get('/admin/viewpendingpharma', async(req,res)  => { //CHECK ADMIN CREDENTIALS
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
