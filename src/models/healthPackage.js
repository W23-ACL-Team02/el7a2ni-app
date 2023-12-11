const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const healthPackageSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  price: {
    type: Number,
    min: 0,
    required: true
  },
  discountSession: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  discountMedicine: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  discountFamilySubscription: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  color: String
}, {
  timestamps: true
});

const healthPackage = mongoose.model('healthPackages', healthPackageSchema);
module.exports = healthPackage;