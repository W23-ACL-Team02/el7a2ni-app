const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
  code: {
    type: String,
    required: true,
    
  },
  email:{
    type:String,
    required:true
  }
 }, {
      timestamps: true
    });

const OTP = mongoose.model('OTP', OTPSchema);
module.exports = OTP;