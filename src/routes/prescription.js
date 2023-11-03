var express= require('express');
const prescriptionModel=require("../models/prescription.js");
const userModel = require('../models/user.js');
const prescription = require('../models/prescription.js');
var router = express.Router(); 

   router.get('/selectedPrescription/:id', async (req, res) => {
    if (req.session.userType != 'patient') {
        return res.status(400).send("Only patients can access this.")
    }

    const prescription = await prescriptionModel.findOne({_id:req.params.id})
    res.render('selectedprescription', {prescription});
   });

   router.get('/addprescription',async(req,res) =>
   {

    if (req.session.userType != 'doctor') {
      return res.status(400).send("Only Doctors can access this.")
    }

      try{
      const doc = await userModel.findOne({_id:req.session.userId})
      const  docName =doc.name
      res.render('addprescription',{docName});
      }catch(error)
      {
        res.status(400).json({err:error.message})
      } 

   })

   router.post('/addprescription',async(req,res)=> {

    const{name, doctorname, specialization,medicineName1,dosage1,instructions1,medicineName2,dosage2,instructions2 }=req.body
    try{
    const doc = await userModel.findOne({_id:req.session.userId})   //session dependent
    const docName = doc.name  
    const prescription =  await prescriptionModel.create({patient:{name:name},doctor:{name:docName ,specialization:specialization},medications:[{name:medicineName1,dosage:dosage1,instructions:instructions1},{name:medicineName2,dosage:dosage2,instructions:instructions2}]});
    let user = await userModel.findOne({name: name});
    if (user == null) {
      throw new Error("User not found. enter a valid patient name")
    }
    // Add prescription to the user
    user.addprescription(prescription);


    await prescription.save()
    await user.save()
    res.status(200).send(`prescription created successfully`)
 
    }
    catch(error)
    {
       res.status(400).json({err:error.message})
    }
 
 
 })
   router.get ('/viewprescription', async (req, res) => { 
    if (req.session.userType != 'patient') {
      return res.status(400).send("Only patients can access this.")
    }
    const userId = req.session.userId;
    try{
      let user = await userModel.findOne({_id: userId});

      if (user == null) {
        throw new Error("User not found. Maybe Session timed out.")
      }
      const prescriptions = user.viewprescription();
      let uniqueDoctorNames = [];
      for (let pres of prescriptions) {
        uniqueDoctorNames.push(pres.doctor.name);
      }
      uniqueDoctorNames = uniqueDoctorNames.filter(onlyUnique);

      res.render('prescriptions',{prescriptions, uniqueDoctorNames})
    res.status(200)

    }
    catch(error)
    {
        res.status(400).json({err:error.message})

    }

 
   })

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

module.exports=router;