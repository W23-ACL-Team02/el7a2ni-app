const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointSchema = new Schema({
  // doctor: {
  //   type: mongoose.Types.ObjectId,
  //   ref:'user',
  //   required: true
  // },
  // patient: {
  //   type: mongoose.Types.ObjectId,
  //   ref:'user',
  //   required: true
  // },
  doctorUsername:{
    type:String,
    required: true,
  },
  patientUsername:{
    type:String,
    required: true,
  },
  date:{
    type: Date,
    required: true,
  },
  status:{
    type: String,
    enum: ["upcoming", "completed", "cancelled", "rescheduled", "pending"],
    required: true,
  },
  start:{
    type: Date, 
    required: true,
  },
  end:{
    type: Date,
    required: true,
  },
  requestFrom:{
    type: String,
    enum: ["patient", "doctor"],
  },
  bookedby:{
    type: ObjectId,
  },


}, { timestamps: true });

appointSchema.methods.isMoreThan24Hours = function () {
  const currentDateTime = new Date(); // Current date and time
  const appointmentDateTime = new Date(this.start); // Convert appointment time to Date object
  // console.log(currentDateTime)
  // console.log(appointmentDateTime)

  // Calculate the time difference in milliseconds
  const timeDifference = appointmentDateTime - currentDateTime;
  const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  return timeDifference > twentyFourHours; // Return true if the time difference is more than 24 hours
};


const Appointment = mongoose.model('Appointment', appointSchema);
module.exports = Appointment;
