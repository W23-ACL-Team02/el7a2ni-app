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
            res.status(400).json({err:error.message})
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
            res.status(400).json({err:error.message})
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
            res.status(400).json({err:error.message})
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
            res.status(400).json({err:error.message})
        }
    }
    ,

//patientDoctor, viewOneDoctor pug pages used in milestone 1

//patientDoctor, viewOneDoctor pug pages used in milestone 1
    bookAppointmentForFamily: async (req, res) => {
        try {
            const docUsername = req.body.doctorUsername
            const timeSlotStartTime = new Date(req.body.timeSlotStartTime)
            const patUsername = req.body.patUsername
            const doctor = await userModel.findOne({ username: docUsername })
            //TODO
              const userId = req.session.userId
           // const userId = '65771f862e100341613e4a71'
            const user = await userModel.findById(userId)
            var memberBelongsToUser = false;
            var memberL = await userModel.findOne({ username: req.body.patUsername });
            var memberC = await userModel.findOne({ name: req.body.patUsername });

            // if (memberType == 'linked') {
            if (memberL) {
                user.family.linked.map((member) => {
                    if (member.id.equals(memberL._id)) {
                        memberBelongsToUser = true;
                    }
                })
            }

            if (!memberBelongsToUser && memberC) {

                user.family.created.map((member) => {
                    if (member.id.equals(memberC._id)) {
                        memberBelongsToUser = true;
                    }
                })

            }



            if (!memberBelongsToUser) {
                res.status(400).json({ errors: ["This family member doesn't belong to you"] })
                return
            }
            // }


            console.log(docUsername)
            console.log(patUsername)
            console.log(timeSlotStartTime)

            // console.log('timeSlotStartTime: ',timeSlotStartTime)
            let allTimeslots = doctor.timeSlots
            if (allTimeslots.length == 0) {
                res.status(400).json({ message: "No available slots" })
            }
            console.log(allTimeslots)
            let selectedTimeslot = allTimeslots.find(ts => ts.startTime.getTime() === timeSlotStartTime.getTime());

            if (!selectedTimeslot) {
                res.status(400).json({ message: "Selected time slot is not available" });
                return; // End the function here if the selected time slot is not found
            }
            const nextAppointment = new appointmentsModel({
                doctorUsername: docUsername,
                patientUsername: patUsername,
                date: selectedTimeslot.date,
                status: 'upcoming',
                start: selectedTimeslot.startTime,
                end: selectedTimeslot.endTime,
                //TODO
                //bookedby:req.session.userId
                bookedby: userId
            });
            await nextAppointment.save();
            allTimeslots = allTimeslots.filter(ts => ts.startTime.getTime() !== timeSlotStartTime.getTime())
            await userModel.updateOne({ username: docUsername }, { timeSlots: allTimeslots })


            // console.log('allTimeslots: ', allTimeslots)
            // console.log('selectedTimeslot: ', selectedTimeslot)

            res.status(200).send("Appointment booked successfully");
        } catch (error) {
            res.status(400).json({ err: error.message })
        }




    }

}

//patientDoctor, viewOneDoctor pug pages used in milestone 1