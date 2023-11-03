var express = require('express');

const userModel = require('../models/user.js');
const appointmentModel = require('../models/appointment.js')
const { default: mongoose } = require('mongoose');


var router = express.Router();

router.get('/', function (req, res, next) {
  // Redirect back to home
  res.redirect('/');
});

router.post('/register/doctor', async (req, res) => {
  const { username, name, email, password, dateOfBirth, hourlyRate, affiliation, education_name, education_end } = req.body;
  const education = {
    name: education_name,
    endYear: education_end.split("-")[0]
  }
  const type = "doctor";
  const acceptanceStatus = 'pending';

  try {
    const user = await userModel.create({username, name, email, password, dateOfBirth, hourlyRate, affiliation, education, type, acceptanceStatus});
    await user.save();

    res.status(200).send(`Doctor ${user.username} created successfully!`);
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
});

router.post('/register/patient', async (req, res) => {
  // Add user to database
  const { username, name, email, password, dateOfBirth, gender, mobile, emergency_name, emergency_mobile, emergency_relation } = req.body;
  const emergencyContact = {
    name: emergency_name,
    mobile: emergency_mobile,
    relation: emergency_relation
  };
  const type = "patient";

  try {
    const user = await userModel.create({ username, name, email, password, dateOfBirth, gender, mobile, type, emergencyContact });
    await user.save();

    res.status(200).send(`Patient ${user.username} created successfully!`);
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
});



router.post('/addAdmin', async (req, res) => {
  try {
    if (req.session.userType !== 'admin') {
      return res.status(403).json({ message: 'Permission denied. You must be an admin to add another administrator.' });
    }

    const { username, password } = req.body
    const admin = await userModel.create({ username: username, password: password, type: "admin" })
    await admin.save()
    res.status(200).send("Admin added successfully")

  } catch (error) {
    res.status(400).json({ err: error.message })
  }

})

router.post('/removeUser', async (req, res) => {
  try {
    // Authenticate that the user is an admin first
    if (req.session.userType !== 'admin') {
        return res.status(403).json({ message: 'Permission denied. You must be an admin to remove a user.' });
      }
    const { username } = req.body
    const user = await userModel.findOneAndRemove({ username: username });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User removed successfully ' });

  } catch (error) {
    res.status(400).json({ err: error.message })
  }
})



router.get('/filterAppointments', async (req, res) => {
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

    
      if(req.session.userType=="doctor")
      filter.doctorUsername = user.username;
      if(req.session.userType=="patient")
      filter.patientUsername = user.username;

    
    
    const filteredAppointments = await appointmentModel.find(filter);
    if (filteredAppointments.length === 0) {
      console.log('No appointments')
      res.status(404).json({ message: 'No appointments' });
      return;
    }
    console.log('Appointments found:', filteredAppointments);
    res.render('filteredAppointments', { filteredAppointments: filteredAppointments });

   
  } catch (error) {
    res.status(400).json({ err: error.message });
  }

})


//for testing
router.get('/allAppointments', async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    if (appointments.length === 0) {
      res.status(404).json({ message: 'No appointments found' });
      return;
    }
    res.json(appointments);
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
});


//AddApointment for testing 
router.post('/addAppointment', async (req, res) => {
  const { doctorUsername, patientUsername, date, status } = req.body
  try {
    const appointment = await appointmentModel.create({ doctorUsername, patientUsername, date, status })
    await appointment.save()
    res.status(200).send("Appointment created successfully")
  } catch (error) {
    res.status(400).json({ err: error.message })
  }
})



router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check for user in database
    const user = await userModel.findOne({ username: username });

    if (!user || password != user.password || user.type == 'pharmacist') {
      // If not found reload page with error message
      return res.redirect('/login')

    // } else if (user?.type == 'doctor' && user.acceptanceStatus != 'accepted') {
    //   return res.status(400).send(`Doctor ${user.name} ${(user.acceptanceStatus == 'pending' ? "not yet approved.":"rejected.")}`)

    } else {
      // Else load session variables
      req.session.loggedin = true;
      req.session.userId = user?._id;
      req.session.userType = user?.type;

      return res.redirect('/home');
    }
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
})


router.post( '/addDoctor' , async(req,res) => {
  try{
      const doctors =  await userModel.find({username:req.body.username, type:"doctor"})
      if(doctors.length!=0){
          res.status(200).send("doctor already created");
          return;
      }
      const doctor =  await userModel.create(req.body)
      await doctor.save()
      res.status(200).send("doctor created successfully")
  }catch(error){
      res.status(400).json({err:error.message})
  }
})









module.exports = router;