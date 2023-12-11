const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const cartItemSchema = new Schema({
//   medicine: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Medicine',
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//   },
// });

// const cartSchema = new Schema({
//   items: [cartItemSchema],
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'user', 
//     required: true,
//   },
// }, { timestamps: true });

// const Cart = mongoose.model('Cart', cartSchema);
// module.exports = Cart;

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