const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema ({
    items: {
        type: Array //medicine +quantity (basically cart)
    },
    total: {
        type: Number
    },
    address: {
      type: Object
    },
    status : {
        type: String,
        enum: ['placed', 'cancelled', 'shipped', 'delivered']
        
    },
    COD: {
        type: Boolean
    }

})

const Order = mongoose.model('order', orderSchema);
module.exports = Order;