const userModel = require('../models/user.js');
const appointmentsModel = require('../models/appointment.js');
const healthPackageModel = require(`../models/healthPackage.js`)

module.exports = { 
    viewDoctors : async (req, res) => {
        //37
        //As a **patient I should be able to view a list of all doctors along with their specialty, 
        //session price (based on subscribed health package if any).**
        //Session price is calculated as ( doctor’s rate + 10% clinic's markup  - some discount  (Based on patient's health package if any))
        try {
            let discountRate = 0;       
            let docs = await userModel.find({type:'doctor',acceptanceStatus:'accepted'})
            let user = await userModel.findOne({_id: req.session.userId});
            if (user?.healthPackage != undefined) {
                let userHealthPackage = await healthPackageModel.findById(user?.healthPackage);
                discountRate = userHealthPackage.discountSession;
            }
            // res.render('patientDoctor', {docs, discountRate});
            res.status(200).json({docs, discountRate});
        }catch(error) {
            res.status(400).json({err:error.message});
        }
    
    }
    ,
    searchDoctors :  async (req, res) => {
        //38,39
        //search for a doctor by name and/or speciality and/or availability on a certain date and at a specific time

        console.log(req.body)
        let docname = req.body.docname;
        let docSpeciality = req.body.speciality;
        let theDate = req.body.date + ":00.000Z"
        if(docname=="")
            docname = "All"
        if(docSpeciality=="")
            docSpeciality = "All"
        if(theDate==":00.000Z")
            theDate = "All"
        else
            theDate = new Date(theDate)

        console.log('doctorName: ',docname, ' Speciality: ', docSpeciality, ' date: ', theDate)
        let docs = []
        try{
            //first we get the possible queries without considering date and time (just filtering doctors name and/or speciality)
            if(docSpeciality=="All" && docname=="All") {
                // all doctors
                docs = await userModel.find({type:'doctor', acceptanceStatus:'accepted'})
            } 
            else if(docSpeciality=="All" && docname!="All") {
                // all doctors with this name
                docs = await userModel.find({name:docname,type:'doctor', acceptanceStatus:'accepted'})
            }
            else if(docSpeciality!="All" && docname=="All") {
                // all doctors with this speciality
                docs = await userModel.find({type:'doctor',speciality:docSpeciality, acceptanceStatus:'accepted'})
            }
            else if(docSpeciality!="All" && docname!="All") {
                // all doctors with this speciality with this name
                docs = await userModel.find({name:docname,type:'doctor',speciality:docSpeciality, acceptanceStatus:'accepted'})
            } 
    
            if(theDate!='All'){

                for(let i=0 ; i<docs.length ; i++){
                    let docTimeslots = docs[i].timeSlots
                    let flag = false;
                    for(let j=0 ; j<docTimeslots.length ; j++){
                        if(docTimeslots[j].startTime<=theDate && theDate<=docTimeslots[j].endTime){
                          flag = true;
                          break;  
                        }
                    }
                    
                    if(flag===false){
                        docs.splice(i,1)
                    }
                }

            }
            
            let discountRate = 0;
            let user = await userModel.findById(req.session.userId);
            if (user?.healthPackage != undefined) {
                let userHealthPackage = await healthPackageModel.findById(user?.healthPackage);
                discountRate = userHealthPackage.discountSession;
            }
            res.status(200).json({docs,discountRate});
        }catch(error){
            res.status(400).json({err:error.message});
        }
        
    }
    ,
    filterDoctors: async (req, res) => {
        // 40,41,42
        // 40. select a doctor from the search/filter results
        // 41. view all details of selected doctor including specilaty, affiliation (hospital), educational background
        // 42. view all available appointments of a selected doctor
        try{
            const doctor = await userModel.findOne({_id:req.params.id})
            let discountRate = 0;
            let user = await userModel.findById(req.session.userId);
            if (user?.healthPackage != undefined) {
                let userHealthPackage = await healthPackageModel.findById(user?.healthPackage);
                discountRate = userHealthPackage.discountSession;
            }
            res.status(200).json({doctor,discountRate});
        }catch(error){
            res.status(400).json({err:error.message});
        }
    }
    ,
    bookAppointment : async (req, res) => {
        // 43
        // select an appointment date and time for myself or for a family member
        try{
            let docUsername = req.body.doctorUsername
            let timeSlotStartTime = new Date(req.body.timeSlotStartTime)
            let patUsername = (await userModel.findById(req.session.userId)).username
            console.log(docUsername)
            console.log(patUsername)
            console.log(timeSlotStartTime)
            // console.log('timeSlotStartTime: ',timeSlotStartTime)
            let allTimeslots = (await userModel.findOne({username:docUsername})).timeSlots
            let selectedTimeslot = allTimeslots.find(ts => ts.startTime.getTime() === timeSlotStartTime.getTime())
            //assuming doctor picked patient and next appointment date
           const nextAppointment =  new appointmentsModel({
                doctorUsername : docUsername,
                patientUsername: patUsername,
                date: selectedTimeslot.date,
                status: 'upcoming', 
                start: selectedTimeslot.startTime, 
                end: selectedTimeslot.endTime,
            });
            await nextAppointment.save();
            allTimeslots = allTimeslots.filter(ts => ts.startTime.getTime() !== timeSlotStartTime.getTime())
            await userModel.updateOne({username:docUsername} , {timeSlots:allTimeslots}) 

            
            // console.log('allTimeslots: ', allTimeslots)
            // console.log('selectedTimeslot: ', selectedTimeslot)

            res.status(200);
        }catch(error){
            res.status(400).json({err:error.message});
        }
    }
    ,
    loadFollowUpPage : async (req, res) => {
        // 64
        // request a follow-up to a previous appointment for myself or a family member

        try{
            // get all possible doctors to have followUp for this patient(and their linked family)
            let patUsername = (await userModel.findById(req.session.userId)).username
            let patname = (await userModel.findById(req.session.userId)).name
            let appts = []
            let patAppts = await appointmentsModel.find({patientUsername:patUsername,status:'completed'})
            
            for(let i=0 ; i<patAppts.length ; i++){
                let docname = (await userModel.findOne({username:patAppts[i].doctorUsername})).name
                let docspec = (await userModel.findOne({username:patAppts[i].doctorUsername})).speciality
                let date = patAppts[i].date
                let prevapptID = patAppts[i]._id
                appts.push({patname,relationship:'Logged In Patient',docname,docspec,date,prevapptID})
            }

            let patFamily = (await userModel.findById(req.session.userId)).family.linked

            for(let i=0 ; i<patFamily.length ; i++){
                // get the appts of each linked family member and add them to our appts array
                relationship = patFamily[i].relationship
                patFamilyUsername = (await userModel.findById(patFamily[i].id)).username
                patFamilyAppts = await appointmentsModel.find({patientUsername:patFamilyUsername,status:'completed'})
                for(let j=0 ; j<patFamilyAppts ; j++){
                    let docname = (await userModel.findOne({username:patFamilyAppts[i].doctorUsername})).name
                    let docspec = (await userModel.findOne({username:patFamilyAppts[i].doctorUsername})).speciality
                    let date = patFamilyAppts[i].date
                    let prevapptID = patFamilyAppts[i]._id
                    appts.push({patname,relationship,docname,docspec,date,prevapptID})
                }
            }
            // that way all completed appts of the patient and their linked family members are displayed
            res.status(200).json(appts);
        }catch(error){
            res.status(400).json({err:error.message});
        }

    }
    ,
    PatientRequestFollowUp : async (req, res) => {
        // 64
        // request a follow-up to a previous appointment for myself or a family member
        let startdate = new Date(req.body.apptDate)
        let enddate = new Date(startdate.getTime()+req.body.duration*60000);
        let previousAppt = await appointmentsModel.findById(req.body.apptID); //get previous appointment to follow up easily
        try{
            const nextAppointment =  new appointmentsModel({
                doctorUsername : previousAppt.doctorUsername,
                patientUsername: previousAppt.patientUsername,
                date: startdate,
                status: 'pending', 
                start: startdate, 
                end: enddate,
                requestFrom: 'patient',
            });
            await nextAppointment.save();
            res.status(200);
        }catch(error){
            res.status(400).json({err:error.message});
        }
    }
}

//patientDoctor, viewOneDoctor pug pages used in milestone 1