const mongoose = require('mongoose');
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
  isprescription:{
    type: Boolean,
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
  
    salesReport: {
      name: {
        type: String,
      },
      price: {
        type: Number,
      },
      amount: {
        type: Number,
      },
      Date: {
        type: Date,
      }
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
      
      this.sales= this.sales+ quantity;
      this.salesReport.amount= quantity;
      this.salesReport.Date= Date.now();
      this.salesReport.price=this.price*quantity;
      this.salesReport.name=this.name;

    },
    decrementQuantity(sales){
      this.quantity= this.quantity- sales
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