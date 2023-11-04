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
}, { timestamps: true });

const Medicine = mongoose.model('medicine', medicineSchema);
module.exports = Medicine;