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
  wallet: {
    type: Number,
    default: 0,
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
    enum: ['accepted', 'rejected', 'pending', 'pendingContract']
  },
  acceptanceDate:{
    type: Date,
    default: undefined,
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
  addresses: {
    type: Array,
    default: []
  },
  deliveryAddress: {
    type: mongoose.Schema.ObjectId,
    ref: "address"
  },
  orders: {
    type: Array,
    default: []
  },
  cart: {
    type: Array,
    default: []
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
  notifications: [
    {
      notifId: {
        type: ObjectId,
        ref: 'notification'
      },
      isRead: {
        type: Boolean,
        default: false
      }
    }
  ]
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
          linked: [],
          created: []
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
          linked: [],
          created: []
        }
      }
      
      return this.family;
    },
    additemTocart(cartItem) {
      if (this.cart == undefined) this.cart = [];
      
      this.cart.push(cartItem)
    },
    deleteitemfromcart(medicineId){
      if (this.cart.length === 0) {
        return; // No items in the cart, nothing to delete
      }
    
      // Find the index of the item with the specified medicineId in the cart
      const cartItemIndex = this.cart.findIndex(item => item.medicineId === medicineId);
    
      if (cartItemIndex !== -1) {
        // If the item is found, remove it from the cart
        this.cart.splice(cartItemIndex, 1);
      }
    },
    incrementq(index) {
      this.cart[index]+=1
      User.save()
    },
    addAddress(newaddress) {
      if (this.addresses == undefined) this.addresses = [];
      
      this.addresses.push(newaddress);
    },
    addOrder(order) {
      if (this.orders == undefined) this.oders = [];
      
      this.orders.push(order)
    },
    emptyCart(){
      this.cart=[];
    },
    viewcartt() {
      return this.cart;
    },
    cancelOrder(index){
      this.orders[index].status="cancelled"
    },
    addLinkedFamilyMember(LinkedFamilyMember){
      if (this.family == undefined) {
        this.family = {
          linked: {},
          created: {}
        }
      }

      this.family.linked.push(LinkedFamilyMember)
    },
    addprescription(prescription){
      if (this.prescriptions== undefined) this.prescriptions=[];
      this.prescriptions.push(prescription)

    },
    async updatePrescription(prescriptionId, updatedPrescription) {
      const index = this.prescriptions.findIndex((p) => p._id.toString() === prescriptionId);
      if (index !== -1) {
        console.log( "hallo"+ this.prescriptions[index] )
        this.prescriptions[index] = updatedPrescription;
        await this.save();
      }
    },
    viewprescription()
    {
      if (this.prescriptions== undefined) this.prescriptions=[]; //if the patient wants to view prescription and there is no prescriptions yet it will open prescription page without prescriptions 
      return this.prescriptions
    },
    addToWallet(amount)
    {
      if (this.wallet==undefined) this.wallet=0;
      this.wallet+= amount
    
    },
    setWallet(amount){
      if (this.wallet==undefined) this.wallet=0;
      this.wallet = amount;
   
    },
    setAcceptanceDate()
    {
      if (this.acceptanceDate==undefined) this.acceptanceDate=Date.now();
      this.acceptanceDate= Date.now()

    },
    isFamilyMember(familyMemberUsername){
      if (!this.family || !this.family.linked || this.family.linked.length === 0) {
        return false; // No family members linked
      }
    
      // Check if the familyMemberUsername exists in the patient's linked family members
      const foundFamilyMember = this.family.linked.find(member => member.name === familyMemberUsername);
      return !!foundFamilyMember;
    }

  }
}
);


const User = mongoose.model('user', userSchema);
module.exports = User;