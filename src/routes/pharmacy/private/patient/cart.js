var express = require('express');
const { addToCart, deleteFromCart, viewCart, editCartQuantity } = require('../../../controllers/cartController');

var router = express.Router();

router.post('/addtocart', addToCart);
router.post('/deletefromcart', deleteFromCart)
router.get('/viewcart', viewCart)
router.put('/editquantity', editCartQuantity)

 module.exports = router;
