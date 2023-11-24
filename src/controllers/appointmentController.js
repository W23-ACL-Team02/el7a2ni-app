const userModel = require(`../models/user`);
const appointmentModel = require(`../models/appointment`);

module.exports = {
    filterAppointments: async (req, res) => {
        //TODO
        try {
            const userId=req.session.userId 
            const user = await userModel.findById(userId)
        
            if(req.session.userType=="admin"){
                return res.status(400).send("Admin cannot filter appointments")
            }
        
            const { status,date } = req.query
            const filter = {}
        
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
        
            
            if(req.session.userType=="doctor") filter.doctorUsername = user.username;
            if(req.session.userType=="patient") filter.patientUsername = user.username;
            
            const filteredAppointments = await appointmentModel.find(filter);
            if (filteredAppointments.length === 0) {
                console.log('No appointments')
                res.status(404).json({ message: 'No appointments' });
                return;
            }
            console.log('Appointments found:', filteredAppointments);
            res.render('filteredAppointments', { filteredAppointments: filteredAppointments });   
        } catch (error) {
            res.status(400).json({ errors: [error.message] });
        }
    },
    allAppointments:  async (req, res) => {
        try {
            const appointments = await appointmentModel.find({});
            if (appointments.length === 0) {
                res.status(404).json({ errors: ['No appointments found'] });
                return;
            }
            res.status(200).json(appointments);
        } catch (error) {
            res.status(400).json({ errors: [error.message] });
        }
    }
}