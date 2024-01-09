const userModel = require('../models/user');
const appointmentModel = require('../models/appointment');
const healthPackageModel = require(`../models/healthPackage.js`);
const fileModel = require(`../models/file.js`);

module.exports = {
    getPatients : async (req,res) => {
        const FromDate = req.body.FromDate
        const ToDate = req.body.ToDate
        const DocId = req.session?.userId
        //const DocId = '6574c7bbe1e7e13216fa2146';
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
        const DocId = req.session.userId
        //const DocId = '6574c7bbe1e7e13216fa2146';
        try{
            const doctor = await userModel.findOne({_id: DocId, type: "doctor"})
            const appointments = await appointmentModel.find({doctorUsername: doctor.username})
            res.status(200).json(appointments)
        }catch(error){
            res.status(400).json({err:error.message})
        }
    },
    addTimeSlot: async (req, res) => {
        const { date, start, end } = req.body;
        
        try {
            // Check if the user making the request is a doctor (optional check)
            if (req.session?.userType !== 'doctor') {
                return res.status(403).json({ message: 'Permission denied.' });
            }
        
                // Find the doctor in the database
            const doctor = await userModel.findOne({_id:req.session.userId});
        
            // Check if the doctor exists
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found.' });
            }
        
            // Check if the doctor has been accepted
            if (doctor.acceptanceStatus !== 'accepted') {
                return res.status(403).json({ message: 'Doctor is not accepted yet' });
            }
        
            // Create a new time slot object
            // const dates= new Date(date)
            const [hoursS, minutesS] = start.split(':');
            const [hoursE, minutesE] = end.split(':');
            const starts=new Date(date);
                starts.setHours(hoursS);
                starts.setMinutes(minutesS);
        
                const ends=new Date(date);
                ends.setHours(hoursE);
                ends.setMinutes(minutesE);
        
        
        
            const newTimeSlot = {
                date: new Date(date), // Convert date string to Date object
                startTime:starts,
                endTime:ends
            };
        
            // Push the new time slot to the doctor's time slots array
            doctor.timeSlots.push(newTimeSlot);
        
            // Save the updated doctor information back to the database
            await doctor.save();
        
            // Send a success response
            return res.status(200).json({ message: 'Time slot added successfully.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error.' });
        }
    },
    editDoctor: async (req, res) => {
        const {userId, email, payRate, affiliation} = req.body;
    
        try {
            if (userId != req.session?.userId) {
                return res.status(403).json({errors: [`Edited doctor does not match with authentication.`]})
            }
    
            let updateResponse = await userModel.updateOne({_id: userId}, {email: email || undefined, payRate: payRate || undefined, affiliation: affiliation || undefined})
            
            if (updateResponse.matchedCount < 1) {
                throw new Error(`No document found with id: ${userId}`);
            } else if (updateResponse.modifiedCount < 1) {
                throw new Error(`Document not modified.`);
            }
    
            return res.status(200).send("Updated doctor");
        } catch (error) {
            return res.status(400).json({errors: [error.message]});
        }
    },
    viewHealthRecords: async (req, res) => {
        try {
            const patientUsername = req.body.patientUsername
            //get doctor's username
            const doctor = await userModel.findById(req.session.userId)
            const doctorUsername = doctor.username
            //check if there are shared appointments
            const appointments = await appointmentsModel.find({doctorUsername: doctorUsername, patientUsername: patientUsername})
            if (!appointments.length){
                res.status(400).json({error: "You don't have any appointments with this patient."});
                return;
            }
            //send patient's health records
            const patient = await userModel.findOne({username: patientUsername})
            var patientFiles = []
            if (patient.files){
                patientFiles = patient.files
                patientFiles.forEach(file => {
                    if (file.fileType == "healthRecord")
                        file = fileModel.decodeBase64ToFile(file.fileData)
                });
            }
            res.status(200).json({files: patientFiles})
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    },
    viewDoctorDetails: async (req, res) => {
        //40,41
        //select a doctor from the search/filter results
        //view all details of selected doctor including specilaty, affiliation (hospital), educational background
    
        if (req.session.userType != 'patient') {
            return res.status(400).send("Only patients can access this.")
        }
        const doctor = await userModel.findOne({_id:req.params.id})
        let discountRate = 0;
        let user = await userModel.findById(req.session.userId);
        if (user?.healthPackage != undefined) {
            let userHealthPackage = await healthPackageModel.findById(user?.healthPackage);
            discountRate = userHealthPackage.discountSession;
        }
        res.render('viewOneDoctor', {doctor,discountRate});
    },
    searchDoctors: async (req, res) => {
        //38,39
        //search for a doctor by name and/or speciality and/or availability on a certain date and at a specific time
        
        if (req.session.userType != 'patient') {
            return res.status(400).send("Only patients can access this.")
        }
    
        let docname = req.body.docname
        let docSpeciality = req.body.speciality
        let theDate = req.body.date + ":00.000Z"
        if(docname=="")
            docname = "All"
        // if(theDate=="" || theTime==""){
        //     console.log("empyty date")
        // }
        // console.log(docname)
        // console.log(docSpeciality)
        // console.log(theDate)
        // console.log(theTime)
        let docs = []
        try{
            //first we get the possible queries without considering date and time (just filtering doctors name and/or speciality)
            if(docSpeciality=="All" && docname=="All") {
                // all doctors
                docs = await userModel.find({type:'doctor',acceptanceStatus:'accepted'})
            } 
            else if(docSpeciality=="All" && docname!="All") {
                // all doctors with this name
                docs = await userModel.find({name:docname,type:'doctor',acceptanceStatus:'accepted'})
            }
            else if(docSpeciality!="All" && docname=="All") {
                // all doctors with this speciality
                docs = await userModel.find({type:'doctor',speciality:docSpeciality,acceptanceStatus:'accepted'})
            }
            else if(docSpeciality!="All" && docname!="All") {
                // all doctors with this speciality with this name
                docs = await userModel.find({name:docname,type:'doctor',speciality:docSpeciality,acceptanceStatus:'accepted'})
            } 
    
            
            // if the patient asks for a specific date and time for a doctor to be available
            if(docs!=[] && theDate!=":00.000Z"){
                console.log(theDate)
                theDate = new Date(theDate)
                // const dateNtime = new Date(theDate);
                // console.log(dateNtime)
                const docsWithAppts = await appointmentsModel.find({start:{$lte:theDate}, end:{$gte:theDate}})
                for (let i = 0; i < docsWithAppts.length; i++){
                    const docsUsername = docsWithAppts[i].doctorUsername;
                    docs = docs.filter((user) => user.username != docsUsername);
                }
            }
            
            let discountRate = 0;
            let user = await userModel.findById(req.session.userId);
            if (user?.healthPackage != undefined) {
                let userHealthPackage = await healthPackageModel.findById(user?.healthPackage);
                discountRate = userHealthPackage.discountSession;
            }
            res.render('patientDoctor', {docs,discountRate});
    
            // if(docs==[])
            //     return "no doctors found matching this search"
        }catch(error){
            res.status(400).json({err:error.message})
        }
        
    },
    viewDoctors: async (req, res) => {
        //37
        //As a **patient I should be able to view a list of all doctors along with their specialty, 
        //session price (based on subscribed health package if any).**
        //Session price is calculated as ( doctor’s rate + 10% clinic's markup  - some discount  (Based on patient's health package if any))
         if (req.session.userType != 'patient') {
            return res.status(400).send("Only patients can access this.")
         }
    
        try {
            let discountRate = 0;       
            let docs = await userModel.find({type:'doctor',acceptanceStatus:'accepted'})
            let user = await userModel.findById(req.session.userId);
            if (user?.healthPackage != undefined) {
                let userHealthPackage = await healthPackageModel.findById(user?.healthPackage);
                discountRate = userHealthPackage.discountSession;
            }
            res.render('patientDoctor', {docs, discountRate});
        } catch(error) {
            res.status(400).json({err:error.message})
        }
    
    }
}