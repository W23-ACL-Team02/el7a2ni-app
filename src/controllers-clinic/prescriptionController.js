const prescriptionModel = require("../models/prescription.js");
const userModel = require('../models/user.js');

module.exports = {
    addPrescriptionView: async(req,res) => {
        if (req.session.userType != 'doctor') {
          return res.status(400).send("Only Doctors can access this.")
        }
    
        try {
            const doc = await userModel.findOne({_id:req.session.userId})
            const  docName =doc.name
            res.render('addprescription',{docName});
        } catch(error) {
            res.status(400).json({err:error.message})
        } 
    },
    addPrescriptionByDoctor: async(req,res)=> {
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
        } catch(error) {
           res.status(400).json({err:error.message})
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
        if (req.session.userType != 'patient') {
          return res.status(400).send("Only patients can access this.")
        }

        const userId = req.session.userId;
        // const name = req.params.name

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