const express = require("express");
var router = express.Router({mergeParams: true});
const {getPatients, getPatientbyId, getPatientbyName, getAppointments} = require('../../controllers/doctorController.js')

router.all('*', (req, res, next) => {
    // Ensure patient
    if (req.session.userType != 'doctor') {
      return res.status(403).send('Unauthorized Access.')
    }
  
    next();
});

router.get("/getAllPatients", getPatients)
router.get("/getByName", getPatientbyName)
router.get("/patient/:id", getPatientbyId)
router.get("/appointments", getAppointments)

module.exports = router;


// const addPatient = async(req,res) => {
//     try{
//         const patients =  await userModel.find({username:req.body.username, type:"patient"})
//         if(patients.length!=0){
//             res.status(200).send("Patient already created");
//             return;
//         }
//         const patient =  await userModel.create(req.body)
//         await patient.save()
//         res.status(200).send("Patient created successfully")
//     }catch(error){
//         res.status(400).json({err:error.message})
//     }
// }


// const deletePatient = async(req,res) => {
//     try{
//         const patient = await userModel.findById({_id:req.params.id})
//         if(patient==null){
//             res.status(200).send("Patient already deleted")
//             return
//         }
//         await userModel.findByIdAndDelete({_id:req.params.id})
//         res.status(200).send("Patient deleted successfully")
//     }catch(error){
//         res.status(400).json({err:error.message})
//     }
// }

// const addAppointment = async(req,res) => {
//     const {doctorUsername, patientUsername, date, status} = req.body
//     try{
//         const appointment = await appointmentModel.create({doctorUsername, patientUsername, date, status})
//         await appointment.save()
//         res.status(200).send("Appointment created successfully")
//     }catch(error){
//         res.status(400).json({err:error.message})
//     }
// }

// const deleteAllAppointments = async(req,res) => {
//     try{
//         await appointmentModel.deleteMany()
//         res.status(200).send("All appointments deleted successfully");
//     }catch(error){
//         res.status(400).json({err:error.message})
//     }
// }

// const addDoctor = async(req,res) => {
//     try{
//         const doctors =  await userModel.find({username:req.body.username, type:"doctor"})
//         if(doctors.length!=0){
//             res.status(200).send("doctor already created");
//             return;
//         }
//         const doctor =  await userModel.create(req.body)
//         await doctor.save()
//         res.status(200).send("doctor created successfully")
//     }catch(error){
//         res.status(400).json({err:error.message})
//     }
// }


