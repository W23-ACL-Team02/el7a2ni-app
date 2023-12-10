const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
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
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
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
    linked: {
      type: Array
    },
    created: {
      type: Array
    }
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
  files: {
    type: Array,
    default: []
  },
  healthPackage: {
    packageId: {
      type: ObjectId,
      ref: 'healthPackage'
    },
    startDate: {
      type: Date
    },
    includedFamilyMembers: {
      type: Array
    },
    status: {
      type: String,
      required: true,
      enum: ['Subscribed', 'Unsubscribed', 'Subscribed through family member'],
      default: 'Unsubscribed'
    },
    endDate: {
      type: Date
    },
    upgrade: {
      type: ObjectId
    }
  },
  files :{
    type:Array,
    default: undefined
  },
  timeSlots: [
    {
      date: Date,
      startTime: Date, 
      endTime: Date,   
    }
  ],

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
    async addFamilyMember(familymember) {
      if (this.family == undefined) {
        this.family = {
          linked: {},
          created: {}
        }
      }

      this.family.created.push({
        id: familymember._id,
        relationship: familymember.relationship
      })
    },
    viewfamilymember() {
      if (this.family == undefined) {
        this.family = {
          linked: {},
          created: {}
        }
      }
      
      return this.family;
    },
    addprescription(prescription){
      if (this.prescriptions== undefined) this.prescriptions=[];
      this.prescriptions.push(prescription)

    },
    viewprescription()
    {
      if (this.prescriptions== undefined) this.prescriptions=[]; //if the patient wants to view prescription and there is no prescriptions yet it will open prescription page without prescriptions 
      return this.prescriptions
    }
  }
  
}
);

const User = mongoose.model('user', userSchema);
module.exports = User;