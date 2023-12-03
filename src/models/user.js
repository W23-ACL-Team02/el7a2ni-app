const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
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
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: true,
    // ! select: false currently need password in handling login server-side
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  mobile: {
    type: String,
  },
  emergencyContact: {
    name: {
      type: String,
    },
    mobile: {
      type: String,
    },
    relation: {
      type: String,
    }
  },
  family: {
    type: Array,
    default: undefined
  },
  prescriptions: {
    type: Array,
    default: undefined
  },
  payRate: {
    type: Number,
  },
  affiliation: {
    type: String,
  },
  education: {
    name: {
      type: String,
    },
    endYear: {
      type: Number,
    }
  },
  acceptanceStatus: {
    type: String,
    enum: ['accepted', 'rejected', 'pending']
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
    },
    addFamilyMember(familymember) {
      if (this.family == undefined) this.family = [];
      
      this.family.push(familymember)
    },
    viewfamilymember() {
      return this.family;
    }
  }
  
}
);

// * Commented out encryption
// userSchema.pre('save', async function() {
//   if (this.isModified('password')){
//     this.password = await bcrypt.hash(this.password, 12)
//   }
// })
const User = mongoose.model('user', userSchema);
module.exports = User;