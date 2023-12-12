const userModel = require(`../models/user`);
const appointmentModel = require(`../models/appointment`);

module.exports = {
    filterAppointments: async (req, res) => {
        try {
            const userId=req.session.userId 
            const user = await userModel.findById(userId)
        
            if(req.session.userType=="admin"){
                return res.status(400).send("Admin cannot filter appointments")
            }
          const { status, date } = req.query;
          const filter = {};

          if(req.session.userType=="doctor") filter.doctorUsername = user.username;
          if(req.session.userType=="patient") filter.patientUsername = user.username;
      
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
    allAppointments:  async (req, res) => {
        try {
            const userId=req.session.userId 
            const user = await userModel.findById(userId)
        
            if(req.session.userType=="admin"){
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
            const userId=req.session.userId 
            const user = await userModel.findById(userId)
        
            if(req.session.userType=="admin"){
                return res.status(400).send("Admin cannot view appointments")
            }


          const filter = {
            status: { $in: ["upcoming", "completed"] }, // Use $in to match multiple statuses
            //doctorUsername: "Doctor1" // Assuming you want to filter by doctorUsername
           // patientUsername:"p7"
          };
          if(req.session.userType=="doctor") filter.doctorUsername = user.username;
          if(req.session.userType=="patient") filter.patientUsername = user.username;
      
          const filteredAppointments = await appointmentModel.find(filter);
      
          console.log('Appointments found:', filteredAppointments);
      
          res.status(200).json({ filteredAppointments: filteredAppointments || [] });
        } catch (error) {
          res.status(400).json({ errors: [error.message] });
        }
      }
      


}