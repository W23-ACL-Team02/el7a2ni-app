const prescriptionModel = require("../models/prescription.js");
const userModel = require('../models/user.js');
const medicineModel=require('../models/medicine.js');
const appointmentModel=require('../models/appointment.js');

module.exports = {
    addPrescriptionView: async(req,res) => {
        if (req.session.userType != 'doctor') {
          return res.status(400).send("Only Doctors can access this.")
        }
    
        try {

            const doc = await userModel.findOne({_id:req.session.userId})
            console.log(doc);
            const  doctorUsername =doc.username;
            const doctorSpecialization=doc.speciality;
            const medications = await medicineModel.find({});
            const appointments= await appointmentModel.find({doctorUsername:doctorUsername});
            const distinctPatientNamesSet = new Set(appointments.map(appointment => appointment.patientUsername));
            const patientNames = Array.from(distinctPatientNamesSet);

            res.status(200).json({doctorUsername,doctorSpecialization,patientNames,medications});
        } catch(error) {
            console.log("gjoed")
            res.status(400).json({err:error.message})
        } 
    },
    addPrescriptionByDoctor: async(req,res)=> {
        const{patientName, doctorname, specialization,medications}=req.body
        
        try{
            
            const prescription =  await prescriptionModel.create({patient:{name:patientName},doctor:{name:doctorname ,specialization:specialization},medications: medications.map((medication) => ({
                name: medication.addedmedicineName,
                dosage: medication.addedmedicineDosage,
                instructions: medication.addedmedicineInstruction,
              })),});
            
            let user = await userModel.findOne({username: patientName});
            let doctor = await userModel.findOne({username: doctorname});

            if (user == null) {
            throw new Error("User not found. enter a valid patient name")
            }

            // Add prescription to the user
            user.addprescription(prescription);
            doctor.addprescription(prescription);
        
        
            await prescription.save()
            await user.save()
            await doctor.save();
            res.status(200).send(`prescription created successfully`);
        } catch(error) {
           res.status(400).json({err:error.message})
        }
    },
    updatePrescription: async (req, res) => {
        try {
           // Extract prescription ID from request parameters
          const { _id,patient,doctor ,medications} = req.body;
        //   console.log(req.body);
      
          // Find the existing prescription by ID
          const existingPrescription = await prescriptionModel.findById(_id);
          console.log(existingPrescription);
          console.log(patient.name);
      
          if (!existingPrescription) {
            return res.status(404).json({ error: 'Prescription not found' });
          }
      
          existingPrescription.medications = medications;
      
          // Save the updated prescription
          await existingPrescription.save();
      
          // Find related user and doctor
          const patientUser = await userModel.findOne({ username: patient.name });
          console.log(patientUser.username);
          const doctorUser = await userModel.findOne({ username: doctor.name });
          console.log(doctorUser.username);
      
        //   if (!patientUser || !doctorUser) {
        //     throw new Error('User or Doctor not found. Enter valid names.');
        //   }
      
          // Update user's and doctor's prescriptions
          patientUser.updatePrescription(_id,existingPrescription);
          doctorUser.updatePrescription(_id,existingPrescription);
      
          // Save the updated user and doctor
        //   await patientUser.save();
        //   await doctorUser.save();
      
          // Send the updated prescription as a response
          res.status(200).json(existingPrescription);
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      },
    getPrescriptionById: async(req,res)=>{
        const prescriptionId= req.query.prescriptionId
        
        try {
            let prescription = await prescriptionModel.findOne({_id:prescriptionId})
        
            if (prescription) {
                res.status(200).json({prescription})
            } else { 
                throw new Error ("prescription not found")
            }
        } catch(error) {
            res.status(400).json({err:error.message})
        }
    },
    getPrescriptions: async (req, res) => { 
        if (req.session.userType != 'patient' && req.session.userType != 'doctor' ) {  // I want to test this If confition
          return res.status(400).send("Only patients can access this.")
        }

       const userId = req.session.userId;
        const name = req.params.name

        try{
            let user = await userModel.findOne({_id:userId});
            console.log(user.prescriptions);
        
            if (user == null) {
                throw new Error("User not found. Maybe Session timed out.")
            }
            const prescriptions = user.viewprescription();
    
            let uniqueDoctorNames = [];
            for (let pres of prescriptions) {
                uniqueDoctorNames.push(pres.doctor.name);
            }
            uniqueDoctorNames = uniqueDoctorNames.filter(onlyUnique);
        
            res.status(200).json({prescriptions, uniqueDoctorNames})
        } catch(error) {
            res.status(400).json({errors: [error.message]})
        }
    }
}

function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}