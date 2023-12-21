const express = require("express");
var router = express.Router()
const {payByCard, payByWallet, getAllSelectedHealthPackages, getAppointmentPrice} = require("../../../controllers-clinic/paymentController.js")

router.post('/payByCard', payByCard)
router.post('/payByWallet', payByWallet)
router.get('/getAllSelectedHealthPackages', getAllSelectedHealthPackages)
router.get("/getAppointmentPrice", getAppointmentPrice)

module.exports = router;