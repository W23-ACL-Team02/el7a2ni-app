const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointSchema = new Schema({
  doctorUsername: {
    type: String,
    required: true,
  },
  patientUsername: {
    type: String,
    required: true,
  },
  date:{
    type: date,
    required: true,
  },
  status:{
    type: String,
    enum: ["upcoming", "completed", "cancelled", "rescheduled"],
    required: true,
  }


}, { timestamps: true });

const User = mongoose.model('appointments', appointSchema);
module.exports = User;