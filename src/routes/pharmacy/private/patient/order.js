var express = require('express');
const { getAddress, getOrderTotal, addAddress, viewAddress, chooseAddress, viewOrders, cancelOrder, placeOrder } = require('../../../../controllers-pharmacy/orderController.js');
const { getCart } = require('../../../../controllers-pharmacy/cartController.js');

var router = express.Router();

router.get('/getaddress', getAddress);
router.get('/gettotal', getOrderTotal);
router.post('/addaddress', addAddress);
router.get('/viewaddress', viewAddress);
router.post('/chooseaddress/:id', chooseAddress);
router.get('/vieworders', viewOrders);
router.post('/cancelorder/:id', cancelOrder);
router.post('/placeorder', placeOrder); 
router.get("/getCart", getCart);

module.exports = router;