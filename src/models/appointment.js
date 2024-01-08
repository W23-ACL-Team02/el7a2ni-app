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
    enum: ["upcoming", "completed", "cancelled", "rescheduled", 'pending'],
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


}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointSchema);
module.exports = Appointment;