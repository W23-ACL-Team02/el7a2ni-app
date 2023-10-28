const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['admin', 'patient', 'doctor', 'pharmacist'],
    required: true,
    default: 'patient'
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
  emergencyContact: {
    type: Object,
    default: {
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
  },
  family: {
    type: Array,
  },
  prescriptions: {
    type: Array,
  },
  payRate: {
    type: Number,
  },
  affiliation: {
    type: String,
  },
  education: {
    type: Object,
    default: {
      name: {
        type: String,
      },
      startYear: {
        type: Number,
      },
      endYear: {
        type: Number,
      }
    }
  },
  isAccepted: {
    type: Boolean,
  }
}, 
{ 
  timestamps: true,
  methods: {
    isAdmin() {
      return this.type == 'admin';
    },
    isDoctor() {
      return this.type == 'doctor';
    },
    isPatient() {
      return this.type == 'patient';
    },
    isPharmacist() {
      return this.type == 'pharmacist';
    }
  }
}
);

const User = mongoose.model('user', userSchema);
module.exports = User;