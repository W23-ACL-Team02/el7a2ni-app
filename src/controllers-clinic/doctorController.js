const userModel = require('../models/user');
const appointmentModel = require('../models/appointment');
const healthPackageModel = require(`../models/healthPackage.js`);
const fileModel = require(`../models/file.js`);
const Appointment = require('../models/appointment');
const { createAppointmentCancelledNotif } = require('../handlers/notification/notificationHandler.js');

module.exports = {
    getPatients: async (req, res) => {
        const FromDate = req.body.FromDate
        const ToDate = req.body.ToDate
        const DocId = req.session?.userId
        //const DocId = '6574c7bbe1e7e13216fa2146';
        try{
            const doctor = await userModel.findOne({_id: DocId, type: "doctor"})
            var appointments = null
            if (FromDate && ToDate) {
                appointments = await appointmentModel.find({ doctorUsername: doctor.username, date: { $gt: new Date(FromDate), $lt: new Date(ToDate) }, status: "upcoming" })
            } else if (FromDate) {
                appointments = await appointmentModel.find({ doctorUsername: doctor.username, date: { $gt: new Date(FromDate) }, status: "upcoming" })
            } else if (ToDate) {
                appointments = await appointmentModel.find({ doctorUsername: doctor.username, date: { $lt: new Date(ToDate) }, status: "upcoming" })
            } else {
                appointments = await appointmentModel.find({ doctorUsername: doctor.username, status: "upcoming" })
            }

            var patientUsers = []
            appointments.forEach((appointment, index) => {
                patientUsers[index] = appointment.patientUsername
            })
            const patients = await userModel.find({ username: { $in: patientUsers } })
            res.status(200).json(patients)
        } catch (error) {
            res.status(400).json({ err: error.message })
        }
    },
    getPatientbyId: async (req, res) => {
        try {
            const patient = await userModel.findById({ _id: req.params.id }, '-Password');
            res.status(200).send(patient)
        } catch (error) {
            res.status(400).json({ err: error.message })
        }
    },
    getPatientbyName: async (req, res) => {
        try {
            const patient = await userModel.findOne({ Name: req.body.Name, type: 'patient' }, '-Password');
            if (patient.length == 0) {
                res.status(200).send("No patient with this name")
            }
            res.status(200).send(patient)
        } catch (error) {
            res.status(400).json({ err: error.message })
        }
    },
    getAppointments: async (req, res) => {
        const DocId = req.session.userId
        //const DocId = "6547cd2f63304dedceb8644b"
        try {
            const doctor = await userModel.findOne({ _id: DocId, type: "doctor" })
            const appointments = await appointmentModel.find({ doctorUsername: doctor.username })
            res.status(200).json(appointments)
        } catch (error) {
            res.status(400).json({ err: error.message })
        }
    },
    addTimeSlot: async (req, res) => {
        const { date, start, end } = req.body;

        try {
            // Check if the user making the request is a doctor (optional check)
            //TODO
            if (req.session?.userType !== 'doctor') {
                return res.status(403).json({ message: 'Permission denied.' });
            }

            // Find the doctor in the database

            //TODO
            const  userId=req.session.userId
           // const { userId } = req.body

            const doctor = await userModel.findOne({ _id: userId });

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
            const starts = new Date(date);
            starts.setHours(hoursS);
            starts.setMinutes(minutesS);

            const ends = new Date(date);
            ends.setHours(hoursE);
            ends.setMinutes(minutesE);



            const newTimeSlot = {
                date: new Date(date), // Convert date string to Date object
                startTime: starts,
                endTime: ends
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
        const { userId, email, payRate, affiliation } = req.body;

        try {
            if (userId != req.session?.userId) {
                return res.status(403).json({ errors: [`Edited doctor does not match with authentication.`] })
            }

            let updateResponse = await userModel.updateOne({ _id: userId }, { email: email || undefined, payRate: payRate || undefined, affiliation: affiliation || undefined })

            if (updateResponse.matchedCount < 1) {
                throw new Error(`No document found with id: ${userId}`);
            } else if (updateResponse.modifiedCount < 1) {
                throw new Error(`Document not modified.`);
            }

            return res.status(200).send("Updated doctor");
        } catch (error) {
            return res.status(400).json({ errors: [error.message] });
        }
    },
    viewHealthRecords: async (req, res) => {
        try {
            const patientUsername = req.body.patientUsername
            //get doctor's username
            const doctor = await userModel.findById(req.session.userId)
            const doctorUsername = doctor.username
            //check if there are shared appointments
            const appointments = await Appointment.find({ doctorUsername: doctorUsername, patientUsername: patientUsername })
            if (!appointments) {
                res.status(400).json({ error: "You don't have any appointments with this patient." });
                return;
            }
            //send patient's health records
            const patient = await userModel.findOne({ username: patientUsername })
            var patientFiles = []
            if (patient.files) {
                patientFiles = patient.files
                patientFiles.forEach(file => {
                    if (file.fileType == "healthRecord")
                        file = fileModel.decodeBase64ToFile(file.fileData)
                });
            }
            res.status(200).json({ files: patientFiles })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    viewDoctorDetails: async (req, res) => {
        //40,41
        //select a doctor from the search/filter results
        //view all details of selected doctor including specilaty, affiliation (hospital), educational background

        if (req.session.userType != 'patient') {
            return res.status(400).send("Only patients can access this.")
        }
        const doctor = await userModel.findOne({ _id: req.params.id })
        let discountRate = 0;
        let user = await userModel.findById(req.session.userId);
        if (user?.healthPackage != undefined) {
            let userHealthPackage = await healthPackageModel.findById(user?.healthPackage);
            discountRate = userHealthPackage.discountSession;
        }
        res.render('viewOneDoctor', { doctor, discountRate });
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
        if (docname == "")
            docname = "All"
        // if(theDate=="" || theTime==""){
        //     console.log("empyty date")
        // }
        // console.log(docname)
        // console.log(docSpeciality)
        // console.log(theDate)
        // console.log(theTime)
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


            // if the patient asks for a specific date and time for a doctor to be available
            if (docs != [] && theDate != ":00.000Z") {
                console.log(theDate)
                theDate = new Date(theDate)
                // const dateNtime = new Date(theDate);
                // console.log(dateNtime)
                const docsWithAppts = await appointmentsModel.find({ start: { $lte: theDate }, end: { $gte: theDate } })
                for (let i = 0; i < docsWithAppts.length; i++) {
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
            res.render('patientDoctor', { docs, discountRate });

            // if(docs==[])
            //     return "no doctors found matching this search"
        } catch (error) {
            res.status(400).json({ err: error.message })
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
            let docs = await userModel.find({ type: 'doctor', acceptanceStatus: 'accepted' })
            let user = await userModel.findById(req.session.userId);
            if (user?.healthPackage != undefined) {
                let userHealthPackage = await healthPackageModel.findById(user?.healthPackage);
                discountRate = userHealthPackage.discountSession;
            }
            res.render('patientDoctor', { docs, discountRate });
        } catch (error) {
            res.status(400).json({ err: error.message })
        }

    },
    reschedulePatientAppointment: async (req, res) => {
        try {
            const { appointmentId, newDate, newStartTime, newEndTime } = req.body;
            console.log(appointmentId);



            // Check if the logged-in user is a doctor
            //TODO
            if (req.session?.userType !== 'doctor') {
              return res.status(403).json({ message: 'Only doctors can reschedule appointments' });
            }

            // Fetch the appointment from the database
            const appointment = await appointmentModel.findById(appointmentId);
            //TODO
           // const doctorUsername = "testDoctor";
            //TODO
            const doctor=await userModel.findById(req.session.userId);
            if(!doctor){
                return res.status(404).json({ message: 'Doctor not found' });
            }

            // Check if the appointment exists
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }
            console.log("1");
            if (appointment.status !== 'upcoming' && appointment.status !== 'rescheduled') {
                return res.status(400).send("The appointment status is not upcoming. Only upcoming appointments can be rescheduled.");
            }
            console.log("2");
            // Check if the logged-in doctor is the assigned doctor for this appointment

            //TODO
            if (appointment.doctorUsername !== doctor.username) {
            //if (appointment.doctorUsername !== doctorUsername) {
                return res.status(403).json({ message: 'You can only reschedule your own patient appointments' });
            }

            console.log("3");
            // Fetch the patient's details from the database using the provided username
            const patient = await userModel.findOne({ username: appointment.patientUsername });

            // Check if the patient exists
            // if (!patient || patient.type !== 'patient') {
            //     return res.status(404).json({ message: 'Patient not found' });
            // }

            // Check if the appointment is associated with the specified patient
            // if (appointment.patientUsername !== patientUsername) {
            //     return res.status(403).json({ message: 'The appointment does not belong to the specified patient' });
            // }


          //  const doctor = await userModel.findOne({ username: doctorUsername }); // Assuming 'doctorUsername' is available in the function's scope
            const updatedAvailableSlots = doctor.timeSlots.filter((slot) => {
                return !(
                    slot.date.toString() === new Date(newDate).toString() &&
                    slot.startTime.toString() === new Date(newStartTime).toString() &&
                    slot.endTime.toString() === new Date(newEndTime).toString()
                );
            });
    
            doctor.timeSlots = updatedAvailableSlots;
            await doctor.save();
            console.log("4")

            const parsedNewDate = new Date(newDate);
            const parsedNewStartTime = new Date(newStartTime);
            const parsedNewEndTime = new Date(newEndTime);

            appointment.date = parsedNewDate;

            // Extract hours and minutes for start and end times
            const startHours = parsedNewStartTime.getHours();
            const startMinutes = parsedNewStartTime.getMinutes();
            const endHours = parsedNewEndTime.getHours();
            const endMinutes = parsedNewEndTime.getMinutes();

            // Set the new start and end times based on extracted hours and minutes
            appointment.start = new Date(parsedNewDate);
            appointment.start.setHours(startHours, startMinutes);
            appointment.end = new Date(parsedNewDate);
            appointment.end.setHours(endHours, endMinutes);
            appointment.status = 'rescheduled';
            console.log(appointment);

            
            await appointment.save();

            try {
                await createAppointmentCancelledNotif(req.session?.userId, patient._id, appointment.start)
            } catch (error) {
            console.log(error)
            }

            res.status(200).send("Appointment rescheduled successfully");
        } catch (error) {
            res.status(400).json({ errors: [error.message] });
        }
    },
    cancelPatientAppointment: async (req, res) => {
        try {
            //TODO
            const userId = req.session.userId;
            //const userId= req.body;
            //const userId = "6574c7bbe1e7e13216fa2146";
            const doctor = await userModel.findById(userId);

           // const { appointmentId } = req.body;
           const { appointmentId } = req.body;

           console.log('Appointment ID:', appointmentId);

            const appointment = await appointmentModel.findById(appointmentId);

            if (!appointment) {
                return res.status(404).send("Appointment not found");
            }

            if (appointment.status == 'completed') {
                return res.status(400).send(" Completed appointments can not be rescheduled.");
            }

            if (appointment.doctorUsername !== doctor.username) {
                return res.status(403).send("You can only cancel your appointments");
            }

            appointment.status = 'cancelled';

            try {
                // Create notification
                let patient = await userModel.findOne({username: appointment.patientUsername})

                createAppointmentCancelledNotif(userId, patient._id, appointment.start)
            } catch (error) {
                console.log(error)
            }

            await appointment.save();
            console.log("after appointment save")
            //TODO
            // refund 


            const refundto = await userModel.findById(appointment.bookedby)
            const AllHealthPackages = await healthPackageModel.find();
            //  const currUserID = req.session.userId;
            //const currUserID = "6547b96606043724533eedbf"
            // const currUser = await userModel.findOne({_id: userId})

            const currUserHealthPackageID = refundto.healthPackage ? refundto.healthPackage.packageId : null
            let healthPackageDiscount = 0;

            if (currUserHealthPackageID && refundto.healthPackage.status === "Subscribed") {
                healthPackageDiscount = AllHealthPackages.filter(hp => hp._id == currUserHealthPackageID.valueOf())[0].discountSession
            }


            const payRate = doctor.payRate
            const price = payRate - (payRate * healthPackageDiscount)
            // const result = {
            //     price : price,
            //     appliedDiscount : healthPackageDiscount
            // }
            console.log("healthPackageDiscount", healthPackageDiscount)
            console.log("payrate", payRate)
            console.log(price)
            console.log("here")

            //  const refundto=await userModel.findById(appointment.bookedby)
            refundto.addToWallet(price);
            await refundto.save();

            //    const filter = {
            //     doctorUsername: doctor.username, // Replace with the doctor's username
            //     status: { $ne: 'completed' } // $ne is a MongoDB operator meaning "not equal to"
            //   };

            //   const Appointments = await appointmentModel.find(filter);
            //   comsole.log(Appointments);
            //   res.status(200).json({ appointments: Appointments || [] });

            // const Appointments = await appointmentModel.find(filter);

            //  res.status(200).json({ appointments: Appointments || [] });
            res.status(200).send("Appointment cancelled successfully");
        }  catch (error) {
            res.status(400).json({ errors: error.message });
        }
        

    },
    notCompletedDoctorAppointments: async (req, res) => {
        try {
            //TODO
            const userId = req.session.userId
         //  const userId = "6574c7bbe1e7e13216fa2146";
           const doctor = await userModel.findById(userId)




            const filter = {
                //TODO
                doctorUsername: doctor.username, // Replace with the doctor's username
              // doctorUsername: "testDoctor ",
                status: { $ne: 'completed' } // $ne is a MongoDB operator meaning "not equal to"
            };
            console.log("aftrfilter")

            //const Appointments = await appointmentModel.find(filter);
            //comsole.log(Appointments);
            //res.status(200).json({ appointments: Appointments || [] });

            const Appointments = await appointmentModel.find(filter);
            console.log('Appointments found:', Appointments);
            res.status(200).json({ appointments: Appointments || [] });


            //res.status(200).json({ filteredAppointments: filteredAppointments || [] });
        } catch (error) {
            res.status(400).json({ errors: [error.message] });
        }
    },
    getAvailableTime:async (req, res) => {
        const doctorUsername = req.query.doctorUsername;
        // Assuming you receive the doctor's username from the request parameters
        console.log(doctorUsername)

    try {
      // Find the doctor based on the provided username
      const doctor = await userModel.findOne({ username: doctorUsername });
  
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      // Get the doctor's appointments
     const doctorAppointments = doctor.timeSlots;
  
      // Logic to determine available time slots based on the doctor's appointments
      // Assuming you have a predefined schedule (e.g., working hours), you can generate available slots from that
  
      // Example: Generate available time slots based on a predefined schedule
     
      // Your logic to generate available time slots from the doctor's appointments and working hours
      // ...
  
      // Return available time slots as a response
      console.log(doctorAppointments)
      res.status(200).json({ availableTimeSlots: doctorAppointments });
  
    } catch (error) {
      console.error('Error fetching available time slots: ', error);
      res.status(500).json({ message: 'Internal server error' });
    }
}
 
  
  

    

};

