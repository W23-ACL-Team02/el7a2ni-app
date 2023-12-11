
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  addressline1: {
    type: String,
    required: true
  },
  addressline2: {
    type: String,
    required: true
  },
  floor: {
    type: String,
    required: true
  },
  apartment: {
    type: String,
    required: true
  },
  postalcode: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  
  },
  country: {
    type: String,
    required: true
 
  }
}, 
{ 
  timestamps: true,
}
);

const address = mongoose.model('address', addressSchema);
module.exports = address;