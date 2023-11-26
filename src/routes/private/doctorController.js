const { default: mongoose } = require('mongoose');
const userModel = require('../../models/user.js');
const appointmentModel = require('../../models/appointment.js');
const express = require("express");
var router = express.Router({mergeParams: true});

const axios = require('axios');

// Define the API endpoint URL
const apiURL = 'http://localhost:4000/patients/api';

//UI
router.get('/', async (req, res) => {
    const DocId = req.session.userId;
    if(req.session.userType=='patient'){
        res.status(500).send('You cannot access this page as a patient');
    }
   try {
    // Make an API request to fetch data
    const patientsResponse = await axios.get(apiURL + "/getAll/" + DocId, { withCredentials: true });   
    const appointmentsResponse = await axios.get(apiURL + "/appointments/" + DocId, { withCredentials: true })

    const patients = patientsResponse.data;
    const appointments = appointmentsResponse.data; 

    // Render the Pug template with the data
    res.render('PatientList', { patients, appointments });
  }catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('An error occurred while fetching data.');
  }
});

router.get('/viewDetails/:id', async(req, res) => {
    try{
        const response = await axios.get(apiURL + "/patient/" + req.params.id);
        const patient = response.data;
        if(!patient){
            res.status(404).send('Patient not found');
            return;
        }
        res.render('PatientDetails',{ patient });
    }catch(error){
        console.error('Error fetching data:', error);
        res.status(500).send('An error occurred while fetching data.');
    }
})

//Api
const addPatient = async(req,res) => {
    try{
        const patients =  await userModel.find({username:req.body.username, type:"patient"})
        if(patients.length!=0){
            res.status(200).send("Patient already created");
            return;
        }
        const patient =  await userModel.create(req.body)
        await patient.save()
        res.status(200).send("Patient created successfully")
    }catch(error){
        res.status(400).json({err:error.message})
    }
}

const getPatients = async(req,res) => {
    const FromDate = req.body.FromDate
    const ToDate = req.body.ToDate
    const DocId = req.params.id
    try{
        const doctor = await userModel.findOne({_id: DocId, type: "doctor"})
        var appointments = null
        if (FromDate && ToDate) {
            appointments = await appointmentModel.find({doctorUsername: doctor.username, date: {$gt:new Date(FromDate), $lt:new Date(ToDate)}, status:"upcoming"})
          } else if (FromDate) {
            appointments = await appointmentModel.find({doctorUsername: doctor.username, date: {$gt:new Date(FromDate)}, status:"upcoming"})
          } else if (ToDate) {
            appointments = await appointmentModel.find({doctorUsername: doctor.username, date: {$lt:new Date(ToDate)}, status:"upcoming"})
          } else{
            appointments = await appointmentModel.find({doctorUsername: doctor.username, status:"upcoming"})
          }

        var patientUsers = []
        appointments.forEach((appointment, index) => {
            patientUsers[index] = appointment.patientUsername
        })
        const patients = await userModel.find({ username: { $in: patientUsers }})
        res.status(200).send(patients)
    }catch(error){
        res.status(400).json({err:error.message})
    } 
}

const deletePatient = async(req,res) => {
    try{
        const patient = await userModel.findById({_id:req.params.id})
        if(patient==null){
            res.status(200).send("Patient already deleted")
            return
        }
        await userModel.findByIdAndDelete({_id:req.params.id})
        res.status(200).send("Patient deleted successfully")
    }catch(error){
        res.status(400).json({err:error.message})
    }
}

const getPatientbyName = async(req,res) => {
    try{
        const patient = await userModel.findOne({Name:req.body.Name, type:'patient'}, '-Password');
        if(patient.length==0){
            res.status(200).send("No patient with this name")
        }
        res.status(200).send(patient)
    }catch(error){
        res.status(400).json({err:error.message})
    }
}

const getPatientbyId = async(req,res) => {
    try{
        const patient = await userModel.findById({_id:req.params.id}, '-Password');
        res.status(200).send(patient)
    }catch(error){
        res.status(400).json({err:error.message})
    }
}

const addAppointment = async(req,res) => {
    const {doctorUsername, patientUsername, date, status} = req.body
    try{
        const appointment = await appointmentModel.create({doctorUsername, patientUsername, date, status})
        await appointment.save()
        res.status(200).send("Appointment created successfully")
    }catch(error){
        res.status(400).json({err:error.message})
    }
}

const getAppointments = async(req, res) => {
    const DocId = req.params.id
    try{
        const doctor = await userModel.findOne({_id: DocId, type: "doctor"})
        const appointments = await appointmentModel.find({doctorUsername: doctor.username})
        res.status(200).send(appointments)
    }catch(error){
        res.status(400).json({err:error.message})
    }
}

const deleteAllAppointments = async(req,res) => {
    try{
        await appointmentModel.deleteMany()
        res.status(200).send("All appointments deleted successfully");
    }catch(error){
        res.status(400).json({err:error.message})
    }
}

const addDoctor = async(req,res) => {
    try{
        const doctors =  await userModel.find({username:req.body.username, type:"doctor"})
        if(doctors.length!=0){
            res.status(200).send("doctor already created");
            return;
        }
        const doctor =  await userModel.create(req.body)
        await doctor.save()
        res.status(200).send("doctor created successfully")
    }catch(error){
        res.status(400).json({err:error.message})
    }
}

router.post("/api/add", addPatient)
router.delete("/api/delete/:id", deletePatient)
router.get("/api/getAll/:id", getPatients)
router.get("/api/getByName", getPatientbyName)
router.get("/api/patient/:id", getPatientbyId)
router.post("/api/addAppointment", addAppointment)
router.delete("/api/allAppointments",deleteAllAppointments)
router.get("/api/appointments/:id", getAppointments)
router.post("/api/addDoctor", addDoctor)

module.exports = router;
