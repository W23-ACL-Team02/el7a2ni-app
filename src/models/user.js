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
    additemTocart(cartItem) {
      if (this.cart == undefined) this.cart = [];
      
      this.cart.push(cartItem)
    },
    viewcartt() {
      return this.cart;
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
    viewfamilymember() {
      return this.family;
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
    additemTocart(cartItem) {
      if (this.cart==undefined) this.cart= [];
      this.cart.push(cartItem);
    },
    emptyCart(){
      this.cart=[];
    },
    viewcartt() {
      return this.cart;
    },
    cancelOrder(index){
      this.orders[index].status="cancelled"
    }
  }
});

// * Commented out encryption
// userSchema.pre('save', async function() {
//   if (this.isModified('password')){
//     this.password = await bcrypt.hash(this.password, 12)
//   }
// })
const User = mongoose.model('user', userSchema);
module.exports = User;