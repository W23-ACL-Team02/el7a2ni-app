const { ObjectId } = require('mongodb');
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
    default: 'patient',
    required: true
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true
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
  speciality: {
    type: String,
    enum: ['General Practitioner', 'Cardiologist', 'Neurologist', 'Dermatologist', 'Surgeon', 'Ophthalmologist', 'Optometrist', 'Pediatrician', 'Family Medicine', 'Radiologist', 'Psychiatrist', 'Anesthesiologist'],
  },
  acceptanceStatus: {
    type: String,
    enum: ['accepted', 'rejected', 'pending']
  },
  healthPackage: {
    type: ObjectId,
    ref: 'healthPackage'
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
    },
    addprescription(prescription){
      if (this.prescriptions== undefined) this.prescriptions=[];
      this.prescriptions.push(prescription)

    },
    viewprescription()
    {
      return this.prescriptions
    }
  }
  
}
);

const User = mongoose.model('user', userSchema);
module.exports = User;