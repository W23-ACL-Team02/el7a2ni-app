var express = require('express');
var router = express.Router();
const {payByCard, payByWallet, getAllSelectedMedicine} = require("../../../controllers-pharmacy/paymentController")

router.post("/payByCard", payByCard)
router.post("/payByWallet", payByWallet)
router.get("/getAllSelectedMedicine", getAllSelectedMedicine)

module.exports = router;