const mongoose = require('mongoose');
const userModel = require('./user');
const {createMedicineOutOfStockNotif} = require('../handlers/notification/notificationHandler')
const Schema = mongoose.Schema;

const medicineSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true
  },
  dosage:{
    type:String,

  },
  category: {
    type: String,
    required: true
  },
  activeIngredients: {
    type: Object,
    name: {
        type: String,
        required: true
    },
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },    
  sales: {
    type: Number,
    required: true
  },   
  imageUrl: {
     type: Object,
       },
  archived: {
    type: Boolean,
    default: false,
  },
  dosage: {
    type: String
  }
}, { timestamps: true,
  methods: {
    incrementSales(quantity) {
      if (this.sales == undefined) this.sales = 0;
      
      this.sales= this.sales+ quantity
    },
    async decrementQuantity(sales){
      this.quantity= this.quantity- sales

      // Send notif out of stock
      if (this.quantity < 1) {
        // Fetch all pharmacists and create notif for all
        try {
          let pharmacists = await userModel.find({type: "pharmacist"})
  
          for (let pharmacist of pharmacists) {
            createMedicineOutOfStockNotif(pharmacist._id, this._id, this.name);
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    decrementSales(quantity) {
      if (this.sales == undefined) this.sales = 0;
      
      this.sales= this.sales- quantity
    },
    incrementQuantity(sales){
      this.quantity= this.quantity+sales
    },
  } });

const Medicine = mongoose.model('medicine', medicineSchema);
module.exports = Medicine;