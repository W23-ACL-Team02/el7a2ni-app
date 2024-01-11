const userModel = require(`../models/user`);
const appointmentModel = require(`../models/appointment`);
const { createAppointmentNewNotif, createAppointmentCancelledNotif, createAppointmentRescheduledNotif } = require("../handlers/notification/notificationHandler");
const healthPackageModel = require("../models/healthPackage");

module.exports = {
  filterAppointments: async (req, res) => {
    try {
     // const userId = '65771f862e100341613e4a71';
      //Todo
    const userId = req.session.userId
      const user = await userModel.findById(userId)
// Todo
      if (req.session.userType == "admin") {
        return res.status(400).send("Admin cannot filter appointments")
      }
      const { status, date } = req.query;
      const filter = {};

      if (req.session.userType == "doctor") filter.doctorUsername = user.username;
      if (req.session.userType == "patient") filter.patientUsername = user.username;
    //  filter.patientUsername = user.username;
      ;

      const unfilteredAppointments = await appointmentModel.find(filter);

      if (date) {
        const selectedDate = new Date(date);
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        filter.date = {
          $gte: startOfDay,
          $lte: endOfDay,
        };
      }

      if (status) {
        filter.status = status;
      }

      const filteredAppointments = await appointmentModel.find(filter);

      console.log('Appointments found:', filteredAppointments);

      res.status(200).json({ filteredAppointments: filteredAppointments || [], unfilteredAppointments: unfilteredAppointments || [] });
    } catch (error) {
      res.status(400).json({ errors: [error.message] });
    }


  },
  filterAppointmentsByStatus: async (req, res) => {
    try {
      //const userId = '65771f862e100341613e4a71';
      //Todo
     const userId = req.session.userId
      const user = await userModel.findById(userId)
// Todo
      if (req.session.userType == "admin") {
        return res.status(400).send("Admin cannot filter appointments")
      }
      const { status } = req.query;
      const filter = {};

      if (req.session.userType == "doctor") filter.doctorUsername = user.username;
      if (req.session.userType == "patient") filter.patientUsername = user.username;
     // filter.patientUsername = user.username

      ;

      const unfilteredAppointments = await appointmentModel.find(filter);

     
      if (status) {
        filter.status = status;
      }

      const filteredAppointments = await appointmentModel.find(filter);

      console.log('Appointments found:', filteredAppointments);

      res.status(200).json({ filteredAppointments: filteredAppointments || [], unfilteredAppointments: unfilteredAppointments || [] });
    } catch (error) {
      res.status(400).json({ errors: [error.message] });
    }


  },
  allAppointments: async (req, res) => {
    try {
      const userId = req.session.userId
      const user = await userModel.findById(userId)

      if (req.session.userType == "admin") {
        return res.status(400).send("Admin cannot filter appointments")
      }

      const appointments = await appointmentModel.find({});
      if (appointments.length === 0) {
        res.status(404).json({ errors: ['No appointments found'] });
        return;
      }
      res.status(200).json(appointments);
    } catch (error) {
      res.status(400).json({ errors: [error.message] });
    }
  },
  upcomingCompAppointments: async (req, res) => {
    try {
      //const userId = "65771f862e100341613e4a71";
      //TODO
      const userId = req.session.userId
      const user = await userModel.findById(userId)
//TODO
      if (req.session.userType == "admin") {
        return res.status(400).send("Admin cannot view appointments")
      }


      const filter = {
        status: { $in: ["upcoming", "completed"] }, // Use $in to match multiple statuses
        //doctorUsername: "Doctor1" // Assuming you want to filter by doctorUsername
        // patientUsername:"p7"
      };
      if (req.session.userType == "doctor") filter.doctorUsername = user.username;
      if (req.session.userType == "patient") filter.patientUsername = user.username;
      //filter.patientUsername = user.username;

      const filteredAppointments = await appointmentModel.find(filter);

      console.log('Appointments found:', filteredAppointments);

      res.status(200).json({ filteredAppointments: filteredAppointments || [] });
    } catch (error) {
      res.status(400).json({ errors: [error.message] });
    }
  },
  addAppointmentTest: async (req, res) => {
    const { doctorUsername, patientUsername, date, status } = req.body
    try {
      const appointment = await appointmentModel.create({ doctorUsername, patientUsername, date, status })
      await appointment.save()
      res.status(200).send("Appointment created successfully")

      try {
        // Create notification
        let doctor = userModel.findOne({username: doctorUsername})
        let patient = userModel.findOne({username: patientUsername})

        let temp = await Promise.all([doctor, patient]);
        doctor = temp[0]
        patient = temp[1]
        createAppointmentNewNotif(doctor._id, patient._id)
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      res.status(400).json({ errors: [error.message] })
    }
  },
  rescheduleAppointment: async (req, res) => {
    try {
      //TODO
      const userId = req.session.userId;
     
     // const userId = "65771f862e100341613e4a71";
      const user = await userModel.findById(userId);


      //const { appointmentId, newDate, familyMemberUsername } = req.body;
      const { appointmentId, newDate, newStartTime, newEndTime,doctorUsername } = req.body;

      //TODO
      if (req.session.userType !== "patient") {
        return res.status(400).send("Only patients can reschedule appointments");
      }

      const appointment = await appointmentModel.findById(appointmentId);

      if (!appointment) {
        return res.status(404).send("Appointment not found");
      }
      if (appointment.status !== 'upcoming' && appointment.status !== 'rescheduled') {
        return res.status(400).send("The appointment status is not upcoming. Only upcoming appointments can be rescheduled.");
      }

      if (appointment.patientUsername !== user.username) {
        return res.status(403).send("You can only reschedule your own appointments");
      }
      const doctor = await userModel.findOne({ username: doctorUsername })
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

      await appointment.save();

      try {
        // Create notification
        let doctor = await userModel.findOne({username: appointment.doctorUsername})

        await createAppointmentRescheduledNotif(userId, doctor._id, appointment.start)
      } catch (error) {
          console.log(error)
      }

      res.status(200).send("Appointment rescheduled successfully");
    } catch (error) {
      res.status(400).json({ errors: [error.message] });
    }
  },

  rescheduleAppointmentForFamily: async (req, res) => {

    try {


      //TODO
      const userId = req.session.userId;
      //const userId= req.body;

     //const userId = "65771f862e100341613e4a71";
      const user = await userModel.findById(userId);
      //TODO
      // if (req.session.userType !== "patient") {
      //   return res.status(400).send("Only patients can reschedule appointments");
      // }

      //const { appointmentId, newDate, familyMemberUsername } = req.body;
      const { appointmentId, newDate, newStartTime, newEndTime,doctorUsername } = req.body;



      const appointment = await appointmentModel.findById(appointmentId);

      if (!appointment) {
        return res.status(404).send("Appointment not found");
      }
      if (appointment.status !== 'upcoming' && appointment.status !== 'rescheduled') {
        return res.status(400).send("The appointment status is not upcoming. Only upcoming appointments can be rescheduled.");
      }

      // if (appointment.patientUsername !== familyMember) {
      //   return res.status(403).send("You can only reschedule your own family members' appointments");
      // }

      const doctor = await userModel.findOne({ username: doctorUsername })
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

      await appointment.save();

      try {
        // Create notification
        let doctor = await userModel.findOne({username: appointment.doctorUsername})

        await createAppointmentRescheduledNotif(userId, doctor._id, appointment.start)
      } catch (error) {
          console.log(error)
      }

      res.status(200).send("Appointment rescheduled successfully");
    } catch (error) {
      res.status(400).json({ errors: [error.message] });
    }


  },
  cancelAppointment:async (req, res) =>{
    try {
      //TODO
      const userId = req.session.userId;
      //const userId= req.body;
     // const userId = "65771f862e100341613e4a71";
      const user = await userModel.findById(userId);

      const { appointmentId } = req.body;


      const appointment = await appointmentModel.findById(appointmentId);

      if (!appointment) {
        return res.status(404).send("Appointment not found");
      }
      
      if (appointment.status == 'completed') {
        return res.status(400).send(" Completed appointments can not be rescheduled.");
      }

      if (appointment.patientUsername !== user.username) {
        return res.status(403).send("You can only cancel your own appointments");
      }

      appointment.status = 'cancelled';

      await appointment.save();
      console.log("after appointment save")
      
      try {
        // Create notification
        let doctor = await userModel.findOne({username: appointment.doctorUsername})

        createAppointmentCancelledNotif(userId, doctor._id, appointment.start)
      } catch (error) {
        console.log(error)
      }
      
      //TODO
      // refund if not less that 24 hrs
      const isMoreThan24Hours = appointment.isMoreThan24Hours();
      if(isMoreThan24Hours){

          const AllHealthPackages = await healthPackageModel.find();
        //  const currUserID = req.session.userId;
          //const currUserID = "6547b96606043724533eedbf"
         // const currUser = await userModel.findOne({_id: userId})
          const currUserHealthPackageID = user.healthPackage ? user.healthPackage.packageId : null
          let healthPackageDiscount = 0;
          
          if(currUserHealthPackageID &&  user.healthPackage.status === "Subscribed"){
              healthPackageDiscount = AllHealthPackages.filter(hp => hp._id == currUserHealthPackageID.valueOf())[0].discountSession 
          }

          const doctor = await userModel.findOne({username : appointment.doctorUsername})
          const payRate = doctor.payRate
          const price = payRate - (payRate * healthPackageDiscount)    
          // const result = {
          //     price : price,
          //     appliedDiscount : healthPackageDiscount
          // }
          console.log("healthPackageDiscount",healthPackageDiscount)
          console.log("payrate",payRate)
          console.log(price)
          console.log("here")

         const refundto=await userModel.findById(appointment.bookedby)
         
         refundto.addToWallet(price);
         await refundto.save();

      }


      res.status(200).send("Appointment cancelled successfully");
    } catch (error) {
      res.status(400).json({ errors: [error.message] });
    }
  },
  cancelAppointmentForFamily:async (req, res) =>{
    try {
    //TODO
      const userId = req.session.userId;
      //const userId= req.body;
     // const userId = "65771f862e100341613e4a71";
      const user = await userModel.findById(userId);

      const { appointmentId } = req.body;


      const appointment = await appointmentModel.findById(appointmentId);

      if (!appointment) {
        return res.status(404).send("Appointment not found");
      }
      
      if (appointment.status == 'completed') {
        return res.status(400).send(" Completed appointments can not be cancelled.");
      }

     //check isFamilyMember
      // var memberBelongsToUser = false;
      // var memberL = await userModel.findOne({ username: familyMember});
      // var memberC = await userModel.findOne({ name: familyMember });

      // if (memberType == 'linked') {
      // if (memberL) {
      //     user.family.linked.map((member) => {
      //         if (member.id.equals(memberL._id)) {
      //             memberBelongsToUser = true;
      //         }
      //     })
      // }

      // if (!memberBelongsToUser && memberC) {

      //     user.family.created.map((member) => {
      //         if (member.id.equals(memberC._id)) {
      //             memberBelongsToUser = true;
      //         }
      //     })

      // }



      // if (!memberBelongsToUser) {
      //     res.status(400).json({ errors: ["This family member doesn't belong to you"] })
      //     return
      // }

      // if (appointment.patientUsername !== familyMember) {
      //   return res.status(403).send("Not the family member in the appointment");
      // }

      appointment.status = 'cancelled';

      await appointment.save();

      try {
        // Create notification
        let doctor = await userModel.findOne({username: appointment.doctorUsername})

        createAppointmentCancelledNotif(userId, doctor._id, appointment.start)
      } catch (error) {
          console.log(error)
      }

      //TODO
      // refund if not less that 24 hrs
      const isMoreThan24Hours = appointment.isMoreThan24Hours();
      if(isMoreThan24Hours){
     //refund for family logic
     const AllHealthPackages = await healthPackageModel.find();
     //  const currUserID = req.session.userId;
       //const currUserID = "6547b96606043724533eedbf"
      // const currUser = await userModel.findOne({_id: userId})
       const currUserHealthPackageID = user.healthPackage ? user.healthPackage.packageId : null
       let healthPackageDiscount = 0;
       
       if(currUserHealthPackageID &&  user.healthPackage.status === "Subscribed"){
           healthPackageDiscount = AllHealthPackages.filter(hp => hp._id == currUserHealthPackageID.valueOf())[0].discountSession 
       }

       const doctor = await userModel.findOne({username : appointment.doctorUsername})
       const payRate = doctor.payRate
       const price = payRate - (payRate * healthPackageDiscount)    
       // const result = {
       //     price : price,
       //     appliedDiscount : healthPackageDiscount
       // }
       console.log("healthPackageDiscount",healthPackageDiscount)
       console.log("payrate",payRate)
       console.log(price)
       console.log("here")

      const refundto=await userModel.findById(appointment.bookedby)
      refundto.addToWallet(price);
      await refundto.save()

      }


      res.status(200).send("Appointment cancelled successfully");
    } catch (error) {
      res.status(400).json({ errors: [error.message] });
    }

  },
 
  notCompletedPatientAppointments: async (req, res) => {
    try {
        //TODO
        const userId = req.session.userId
        //const userId = "65771f862e100341613e4a71";
        const patient = await userModel.findById(userId)




        const filter = {
            patientUsername: patient.username, // Replace with the doctor's username
            status: { $ne: 'completed' } // $ne is a MongoDB operator meaning "not equal to"
        };

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
notCompletedFamilyAppointments:async (req, res) => {
  try {
    const { familyMember } = req.query; // Extract family member from request body
    console.log(familyMember);


    // Fetch non-completed appointments for the given family member from the database
    const appointments = await appointmentModel.find({
      patientUsername: familyMember,
      status: { $ne: 'completed' } // Filtering by status not equal to 'completed'
    });
    if(!appointments){
      res.status(404).json({ error: 'No appointments found' });
    }

    // Send the non-completed appointments as a response
    res.status(200).json({ appointments });
  } catch (error) {
    // Handle errors appropriately
    res.status(500).json({ error: 'Could not fetch non-completed appointments for the family member' });
  }
}








}
