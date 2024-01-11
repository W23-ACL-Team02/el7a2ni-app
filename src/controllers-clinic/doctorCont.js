const userModel = require('../models/user.js');
const appointmentsModel = require('../models/appointment.js');
const fileModel = require('../models/file.js');

module.exports = { 
    viewContract : async (req, res) => {
        //16
        //view and accept the employment contract
        //Contract includes the markup added by the system so the clinic can make a profit
        try{
            let doctor = await userModel.findById(req.session.userId)
            let clinicMarkUp = 1.1
            res.status(200).json({doctor, clinicMarkUp});
        } catch(error) {
            res.status(400).json({err:error.message})
        }
    }
    ,
    acceptContract : async (req, res) => {
        //16
        //accept the employment contract
        try {
            //we set status in enum of acceptanceStatus to accepted instead of pendingContract
			let result = await userModel.findByIdAndUpdate(req.session.userId, {acceptanceStatus: 'accepted'});
		
			if (result.modifiedCount < 1) {
				throw new Error(`Doctor ${_id} does not exist.`);
			}
            // send status 200 and load into doctor homepage
			return res.status(200).json();
		} catch (error) {
			return res.status(400).json({err:error.message});
		}

    }
    ,
    rejectContract : async (req, res) => {
        //16
        //accept the employment contract
        try {
            //we set status in enum of acceptanceStatus to accepted instead of pendingContract
			let result = await userModel.findByIdAndUpdate(req.session.userId, {acceptanceStatus: 'rejected'});
		
			if (result.modifiedCount < 1) {
				throw new Error(`Doctor ${_id} does not exist.`);
			}
			return res.status(200).json();
		} catch (error) {
			return res.status(400).json({err:error.message});
		}
        //what if the doctor rejects the employment contact??
    }
    ,
    selectFollowUpMenu : async (req, res) => {
        //51
        //open the follow up menu with possible patients and time(drop down list)
        try{
            
            // let date1 = new Date();
            // let date2 = new Date(date1);
            // date2.setHours(date1.getHours() + 1);
            // date1 += ":00.000Z"
            // date2 += ":00.000Z"
            // await userModel.updateOne({username:'doctor1'},{ $push:{ timeSlots:{date:date1,startTime:date1,endTime:date2} }});
            // userModel.save()
            // console.log((await userModel.findOne({username:'doctor1'})).timeSlots)
            
            //get all patients who have already had their appointment from this doctor
            let docUsername = (await userModel.findById(req.session.userId)).username
            // console.log(docUsername)
            let completedAppts = await appointmentsModel.find({doctorUsername:docUsername,status:"completed"})
            // console.log(completedAppts)
            let patientsNames = []
            for(let i = 0; i<completedAppts.length; i++){
                //get patients name using their username
                curPatName = (await userModel.findOne({username:completedAppts[i].patientUsername})).name
                //append it to array
                if(!patientsNames.includes(curPatName)){
                    patientsNames.push(curPatName)
                }
            }
            // console.log(patientsNames)
            //list with patients names sent from here as well
            
            //get the list of the avaialble appointments/timeslots for the doctor
            let availableTimeslots = (await userModel.findById(req.session.userId)).timeSlots
            let docName = (await userModel.findById(req.session.userId)).name
            // console.log(availableTimeslots[3]._id)
            // console.log(await userModel.find({type:'doctor'}))
            res.status(200).json({patientsNames, availableTimeslots, docName})
        }catch(error){
            res.status(400).json({err:error.message})
        }
    }
    ,
    scheduleFollowUp : async (req, res) => {
        //51
        //schedule a follow-up for a patient
        try{
            let patientName = req.body.patName
            let timeSlotStartTime = new Date(req.body.timeSlotStartTime)
            let patUsername = (await userModel.findOne({name:patientName})).username
            let docUsername = (await userModel.findById(req.session.userId)).username
            // console.log(patUsername)
            // console.log(docUsername)
            // console.log('timeSlotStartTime: ',timeSlotStartTime)
            let allTimeslots = (await userModel.findById(req.session.userId)).timeSlots
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

            try {
                // Create notification
                let doctor = userModel.findOne({username: docUsername})
                let patient = userModel.findOne({username: patUsername})
        
                let temp = await Promise.all([doctor, patient]);
                doctor = temp[0]
                patient = temp[1]
                createAppointmentNewNotif(doctor._id, patient._id)
            } catch (error) {
                console.log(error)
            }

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
    addHealthRecords : async (req, res) => {
        //60
        //add new health records for a patient
        try{
            //get patients for this doctor
            let docUsername = (await userModel.findById(req.session.userId)).username
            let appointmentList = await appointmentsModel.find({doctorUsername:docUsername})
            let patientsNames = []
            for(let i=0;i<appointmentList.length;i++){
                //get patients name
                let patName = await userModel.findOne({username:appointmentList[i].patientUsername})
                //add it to list if it is not already there
                if(!patientsNames.includes(patName)){
                    patientsNames.push(patName)
                }
            }
            res.status(200).json({patientsNames})
        }catch(error){
            res.status(400).json({err:error.message})
        }


    }
    ,
    uploadHealthRecord : async (req, res) => {
        try {
            const patient = await userModel.findById(req.session.userId)
            const healthRecordDocument = req.file ? req.file : null;
            const b64 = fileModel.encodeFileToBase64(healthRecordDocument)
            const file = await fileModel.File.create({fileName: healthRecordDocument.originalname, fileType: "healthRecord", fileData: b64})
            const files = patient.files ? patient.files : []
            files.push(file)
            await patient.updateOne({files: files})
            return res.status(200).json({successes: [`Successfully uploaded ${healthRecordDocument.originalname}.`]});
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }
    ,
    viewRequestedFollowUps : async (req, res) => {
        
        // 65
        // accept or revoke a follow-up session request from a patient
        try{
            // let docUsername = 'doctor1'
            // let patUsername = 'patient1'
            // let date1 = new Date(Date.now());
            // let date2 = new Date(date1.getTime() + 60 * 60 * 1000);
            // console.log(await userModel.find({username:'patient1'}))
            // console.log(await appointmentsModel.find({patientUsername:'patient1'}))
            // let pendingAppts = await appointmentsModel.find({doctorUsername:docUsername})
            // const nextAppointment =  new appointmentsModel({
            //     doctorUsername : docUsername,
            //     patientUsername: patUsername,
            //     date: date1,
            //     status: 'pending', 
            //     start: date1, 
            //     end: date2,
            //     requestFrom: 'patient',
            // });
            // await nextAppointment.save();
            let docUsername = (await userModel.findById(req.session.userId)).username
            let pendingAppts = await appointmentsModel.find({doctorUsername:docUsername,requestFrom:'patient',status:'pending'})
            let patientNames = []
            for(let i=0 ; i<pendingAppts.length ; i++){
                let patientUsername = pendingAppts[i].patientUsername
                console.log(patientUsername)
                let patname = (await userModel.findOne({username:patientUsername})).name
                patientNames.push(patname)
            }
            res.status(200).json({pendingAppts,patientNames});
            // console.log(pendingAppts)
        }catch(error){
            res.status(400).json({error: error.message});
        }


    }
    ,
    respondToRequestedFollowUps : async (req, res) => {

        // 65
        // accept or revoke a follow-up session request from a patient
        try{
            let apptID = req.body.appointmentID;
            if(req.body.followUpStatus=='accept'){
                await appointmentsModel.updateOne({_id:apptID},{status:"upcoming"});
            }
            else if(req.body.followUpStatus=='reject'){
                await appointmentsModel.updateOne({_id:apptID},{status:"cancelled"});
            }

            res.status(200);
        }catch(error){
            res.status(400).json({error: error.message});
        }
    }
}



