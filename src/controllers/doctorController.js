const express = require('express'); 
const userModel = require('../models/user');
const appointmentModel = require('../models/appointment');

module.exports = {
    getPatients : async (req,res) => {
        const FromDate = req.body.FromDate
        const ToDate = req.body.ToDate
        //const DocId = req.session?.userId
        const DocId = "6547cd2f63304dedceb8644b"
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
            res.status(200).json(patients)
        }catch(error){
            res.status(400).json({err:error.message})
        } 
    },
    getPatientbyId : async(req,res) => {
        try{
            const patient = await userModel.findById({_id:req.params.id}, '-Password');
            res.status(200).send(patient)
        }catch(error){
            res.status(400).json({err:error.message})
        }
    },
    getPatientbyName : async (req,res) => {
        try{
            const patient = await userModel.findOne({Name:req.body.Name, type:'patient'}, '-Password');
            if(patient.length==0){
                res.status(200).send("No patient with this name")
            }
            res.status(200).send(patient)
        }catch(error){
            res.status(400).json({err:error.message})
        }
    },
    getAppointments : async(req, res) => {
        //const DocId = req.session.userId
        const DocId = "6547cd2f63304dedceb8644b"
        try{
            const doctor = await userModel.findOne({_id: DocId, type: "doctor"})
            const appointments = await appointmentModel.find({doctorUsername: doctor.username})
            res.status(200).json(appointments)
        }catch(error){
            res.status(400).json({err:error.message})
        }
    }
}