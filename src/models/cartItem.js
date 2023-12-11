const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const cartitemSchema = new Schema({
     
        medicine: {
          type:  Object,
          //  ref: 'Medicine',
         // required: true
        },
        quantity: {
          type: Number,
         // required: true
        }
      
    
  });
  
const Cart = mongoose.model('cart', cartitemSchema);
module.exports = Cart;