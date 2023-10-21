const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
  },
  mobile: {
    type: String,
  },
  number: {
    type: String,
  },
  emergencyContact: {
    type: Object,
    name: {
      type: String,
    },
    mobile: {
      type: String,
    },
    relation: {
      type: String,
    }
  }
}, { timestamps: true });

const User = mongoose.model('user', userSchema);
module.exports = User;