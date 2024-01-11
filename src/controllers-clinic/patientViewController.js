const userModel = require('../models/user.js');
const appointmentsModel = require('../models/appointment.js');
const healthPackageModel = require('../models/healthPackage.js')

module.exports = {
    viewDoctors: async (req, res) => {
        //37
        //As a **patient I should be able to view a list of all doctors along with their specialty, 
        //session price (based on subscribed health package if any).**
        //Session price is calculated as ( doctor’s rate + 10% clinic's markup  - some discount  (Based on patient's health package if any))
        try {
            // let user = await userModel.findById('6547b96606043724533eedbf');
            let discountRate = 0;       
            let docs = await userModel.find({type:'doctor',acceptanceStatus:'accepted'});
            let user = await userModel.findById(req.session.userId);
            if (user?.healthPackage != undefined && user?.healthPackage?.status != "Unsubscribed") {
                let userHealthPackage = await healthPackageModel.findById(user?.healthPackage.packageId);
                discountRate = userHealthPackage.discountSession;
            }
            // res.render('patientDoctor', {docs, discountRate});
            res.status(200).json({docs, discountRate});
        }catch(error) {
            res.status(400).json({err:error.message});
        }

    }
    ,
    searchDoctors: async (req, res) => {
        //38,39
        //search for a doctor by name and/or speciality and/or availability on a certain date and at a specific time

        console.log(req.body)
        let docname = req.body.docname;
        let docSpeciality = req.body.speciality;
        let theDate = req.body.date + ":00.000Z"
        if (docname == "")
            docname = "All"
        if (docSpeciality == "")
            docSpeciality = "All"
        if (theDate == ":00.000Z")
            theDate = "All"
        else
            theDate = new Date(theDate)

        console.log('doctorName: ', docname, ' Speciality: ', docSpeciality, ' date: ', theDate)
        let docs = []
        try {
            //first we get the possible queries without considering date and time (just filtering doctors name and/or speciality)
            if (docSpeciality == "All" && docname == "All") {
                // all doctors
                docs = await userModel.find({ type: 'doctor', acceptanceStatus: 'accepted' })
            }
            else if (docSpeciality == "All" && docname != "All") {
                // all doctors with this name
                docs = await userModel.find({ name: docname, type: 'doctor', acceptanceStatus: 'accepted' })
            }
            else if (docSpeciality != "All" && docname == "All") {
                // all doctors with this speciality
                docs = await userModel.find({ type: 'doctor', speciality: docSpeciality, acceptanceStatus: 'accepted' })
            }
            else if (docSpeciality != "All" && docname != "All") {
                // all doctors with this speciality with this name
                docs = await userModel.find({ name: docname, type: 'doctor', speciality: docSpeciality, acceptanceStatus: 'accepted' })
            }

            if (theDate != 'All') {

                for (let i = 0; i < docs.length; i++) {
                    let docTimeslots = docs[i].timeSlots
                    let flag = false;
                    for (let j = 0; j < docTimeslots.length; j++) {
                        if (docTimeslots[j].startTime <= theDate && theDate <= docTimeslots[j].endTime) {
                            flag = true;
                            break;
                        }
                    }

                    if (flag === false) {
                        docs.splice(i, 1)
                    }
                }

            }

            let discountRate = 0;
            let user = await userModel.findById(req.session.userId);
            if (user?.healthPackage != undefined && user?.healthPackage?.status != "Unsubscribed") {
                let userHealthPackage = await healthPackageModel.findById(user?.healthPackage.packageId);
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
            // let curPatient = await userModel.findById('6547b96606043724533eedbf');
            let doctor = await userModel.findById(req.params.id);
            let discountRate = 0;
            let curPatient = await userModel.findById(req.session.userId);
        
            if (curPatient?.healthPackage != undefined && curPatient?.healthPackage?.status != "Unsubscribed") {
                let userHealthPackage = await healthPackageModel.findById(curPatient?.healthPackage.packageId);
                discountRate = userHealthPackage.discountSession;
                console.log(discountRate);
            }
            let patDefaultDiscount = discountRate;
            let patNfamily = [{name:curPatient.name , username:curPatient.username , discount:discountRate}]
            for(let i=0 ; i<curPatient.family.linked.length ;i++){
                let famMem = await userModel.findById(curPatient.family.linked[i].id);
                if (famMem?.healthPackage != undefined && famMem?.healthPackage?.status != "Unsubscribed") {
                    let userHealthPackage = await healthPackageModel.findById(famMem?.healthPackage.packageId);
                    discountRate = userHealthPackage.discountSession ?? 0;
                    console.log(discountRate);
                }else{
                    discountRate = 0;
                }
                patNfamily.push({name:famMem.name , username:famMem.username , discount:discountRate});
            }
            console.log(patNfamily);
            res.status(200).json({patNfamily,doctor,discountRate:patDefaultDiscount});
        }catch(error){
            res.status(400).json({err:error.message});
        }
    }
    ,
    bookAppointment: async (req, res) => {
        // 43
        // select an appointment date and time for myself or for a family member

        try {

            let docUsername = req.body.doctorUsername
            let timeSlotStartTime = new Date(req.body.timeSlotStartTime)
            // const userId = '65771f862e100341613e4a71' // Test
            const doctor = await userModel.findOne({ username: docUsername })
            
            const userId = req.session.userId
            let patUsername = req.body.patientUsername
            
            let allTimeslots = doctor.timeSlots
            if (allTimeslots.length == 0) {
                res.status(400).json({ message: "No available slots" })
            }

            let selectedTimeslot = allTimeslots.find(ts => ts.startTime.getTime() === timeSlotStartTime.getTime())
            if (!selectedTimeslot) {
                res.status(400).json({ message: "Selected time slot is not available" });
                return; // End the function here if the selected time slot is not found
            }

            //assuming doctor picked patient and next appointment date
            const nextAppointment =  new appointmentsModel({
                doctorUsername : docUsername,
                patientUsername: patUsername,
                date: selectedTimeslot.date,
                status: 'upcoming',
                start: selectedTimeslot.startTime,
                end: selectedTimeslot.endTime,
                bookedby: userId
            });
    
            await nextAppointment.save();
            allTimeslots = allTimeslots.filter(ts => ts.startTime.getTime() !== timeSlotStartTime.getTime());
            await userModel.updateOne({username:docUsername} , {timeSlots:allTimeslots});


            // console.log('allTimeslots: ', allTimeslots)
            // console.log('selectedTimeslot: ', selectedTimeslot)

            res.status(200).send("Appointment booked successfully");
        } catch (error) {
            res.status(400).json({ err: error.message })
        }
    }
    ,
    loadFollowUpPage : async (req, res) => {
        // 64
        // request a follow-up to a previous appointment for myself or a family member

        // const doctor = await userModel.findOne({username:'doctor1'});
        // const newTimeSlot = {
        //     date: new Date(2024, 1, 16, 15, 0, 0), 
        //     startTime: new Date(2024, 1, 16, 15, 0, 0),
        //     endTime: new Date(2024, 1, 16, 15, 45, 0),
        // };
        // doctor.timeSlots.push(newTimeSlot);
        // await doctor.save();
        try{
            // get all possible doctors to have followUp for this patient(and their linked family)

            // let sessionUserID = '6547b96606043724533eedbf';
            let sessionUserID = req.session.userId;
            let patUsername = (await userModel.findById(sessionUserID)).username
            let patname = (await userModel.findById(sessionUserID)).name
            // console.log(patUsername,patname)
            let appts = []
            let patAppts = await appointmentsModel.find({patientUsername:patUsername,status:'completed'})
            // console.log(patAppts)
            // console.log(patAppts[0].doctorUsername)
            // console.log(await userModel.findOne({username:'doctor1'}))
            for(let i=0 ; i<patAppts.length ; i++){
                let docname = (await userModel.findOne({username:patAppts[i].doctorUsername})).name
                let docspec = (await userModel.findOne({username:patAppts[i].doctorUsername})).speciality
                let date = patAppts[i].date
                let prevapptID = patAppts[i]._id
                appts.push({patname,relationship:'Logged In Patient',docname,docspec,date,prevapptID})
                // appts.push({patname:'me',relationship:'Logged In Patient',docname:'doc',docspec:'stupid',date:'datebdfvfhj',prevapptID:'wgeh'})
            }
            // console.log(await userModel.findOne({username:'patient1'}))
            let patFamily = (await userModel.findById(sessionUserID)).family.linked

            for(let i=0 ; i<patFamily.length ; i++){
                // get the appts of each linked family member and add them to our appts array
                let relationship = patFamily[i].relationship
    // console.log(patFamily[i].id);
                let patname = (await userModel.findById(patFamily[i].id)).name
                let familyMemberUsername = (await userModel.findById(patFamily[i].id)).username
    // console.log(familyMemberUsername);
                let familyMemberAppts = await appointmentsModel.find({patientUsername:familyMemberUsername,status:'completed'})
    // console.log(familyMemberAppts);
                for(let j=0 ; j<familyMemberAppts.length ; j++){
    // console.log(familyMemberAppts[j]);
                    let docname = (await userModel.findOne({username:familyMemberAppts[j].doctorUsername})).name
                    let docspec = (await userModel.findOne({username:familyMemberAppts[j].doctorUsername})).speciality
                    let date = familyMemberAppts[j].date
                    let prevapptID = familyMemberAppts[j]._id
    // console.log(docname, docspec, date);
                    appts.push({patname,relationship,docname,docspec,date,prevapptID})
                }
            }
    // console.log(appts);
            // that way all completed appts of the patient and their linked family members are displayed
            
            res.status(200).json({appts});
        }catch(error){
            res.status(400).json({err:error.message});
        }

    }
    ,
    PatientRequestFollowUp : async (req, res) => {
        // 64
        // request a follow-up to a previous appointment for myself or a family member
        try{
            // if(req.body.existingTimeslot===true){
            //     let start = req.body.start
            //     let end = req.body.end
            //     let previousAppt = await appointmentsModel.findById(req.body.apptID); //get previous appointment to follow up easily
            //     const nextAppointment =  new appointmentsModel({
            //         doctorUsername : previousAppt.doctorUsername,
            //         patientUsername: previousAppt.patientUsername,
            //         date: start,
            //         status: 'pending', 
            //         start: start, 
            //         end: end,
            //         requestFrom: 'patient',
            //     });
            //     console.log(start, end);
            //     await nextAppointment.save();
            //     let allTimeslots = (await userModel.findOne({username:previousAppt.doctorUsername})).timeSlots
            //     console.log(allTimeslots);
            //     allTimeslots = allTimeslots.filter(ts => ts.startTime.getTime() !== start)
            //     // console.log(allTimeslots);
            //     await userModel.updateOne({username:previousAppt.doctorUsername} , {timeSlots:allTimeslots})
            //     res.status(200);
            // }else{
            let startdate = new Date(req.body.apptDate)
            let enddate = new Date(startdate.getTime()+req.body.duration*60000);
            let previousAppt = await appointmentsModel.findById(req.body.apptID); //get previous appointment to follow up easily
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
    ,
    
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