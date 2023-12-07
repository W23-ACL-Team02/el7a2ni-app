var express = require('express');
var router = express.Router({mergeParams: true});

const userModel = require('../../models/user.js');
const appointmentModel = require('../../models/appointment.js');
const { getSelf } = require('../../controllers/userController.js');
const { filterAppointments, allAppointments } = require('../../controllers/appointmentController.js');

router.get('/filterAppointments', filterAppointments);

//for testing
router.get('/allAppointments', allAppointments);

//AddApointment for testing 
router.post('/addAppointment', async (req, res) => {
  const { doctorUsername, patientUsername, date, status } = req.body
  try {
    const appointment = await appointmentModel.create({ doctorUsername, patientUsername, date, status })
    await appointment.save()
    res.status(200).send("Appointment created successfully")
  } catch (error) {
    res.status(400).json({ errors: [error.message] })
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

router.get('/getSelfUser', getSelf);

module.exports = router;