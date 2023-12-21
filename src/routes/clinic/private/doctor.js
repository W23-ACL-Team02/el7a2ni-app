const express = require("express");
var router = express.Router({mergeParams: true});
const { viewContract, acceptContract, rejectContract, selectFollowUpMenu,scheduleFollowUp, addHealthRecords } = require('../../../controllers-clinic/doctorCont');
const { getPatients, getPatientbyId, getPatientbyName, getAppointments } = require('../../../controllers-clinic/doctorController.js')
const { addTimeSlot, editDoctor, viewHealthRecords, viewDoctorDetails, searchDoctors, viewDoctors } = require('../../../controllers-clinic/doctorController.js');
const authorizeUser = require('../../../middleware/authorizeUser');

router.all("*", (req, res, next) => {
  // Ensure doctor
  if (!authorizeUser(req, res, ["doctor"])) return;

  next();
})

// ? Add under /doctor/contract router?
router.get("/viewContract", viewContract);
router.put("/acceptContract", acceptContract);
router.put("/rejectContract", rejectContract);

// ? Add under /doctor/appointment router?
router.get("/selectFollowUpMenu", selectFollowUpMenu)
router.post("/scheduleFollowUp", scheduleFollowUp)
router.post("/addHealthRecords", addHealthRecords)
router.get("/appointments", getAppointments)

// ? Add all the rest under /doctor/user router?
router.get("/getAllPatients", getPatients)
router.get("/getByName", getPatientbyName)
router.get("/patient/:id", getPatientbyId)

router.get('/viewDoctors', viewDoctors); // TODO: Remove/Update endpoint? 
router.post('/searchDoctors', searchDoctors); // TODO: Remove/Update endpoint?
router.get('/viewDoctorDetails/:id', viewDoctorDetails); // TODO: Remove/Update endpoint?
router.put('/api/editDoctor', editDoctor);
router.post('/addTimeSlots', addTimeSlot);
router.post('/api/viewHealthRecords', viewHealthRecords);

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


