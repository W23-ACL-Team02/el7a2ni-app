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
       }
}, { timestamps: true,
  methods: {
    incrementSales(quantity) {
      if (this.sales == undefined) this.sales = 0;
      
      this.sales= this.sales+ quantity
    },
    decrementQuantity(sales){
      this.quantity= this.quantity- sales
<<<<<<< HEAD
    }
=======
    },
    decrementSales(quantity) {
      if (this.sales == undefined) this.sales = 0;
      
      this.sales= this.sales- quantity
    },
    incrementQuantity(sales){
      this.quantity= this.quantity+sales
    },
>>>>>>> a2b2fcb3c991e470ba305c1626a803c1110f554a
  } });

const Medicine = mongoose.model('medicine', medicineSchema);
module.exports = Medicine;