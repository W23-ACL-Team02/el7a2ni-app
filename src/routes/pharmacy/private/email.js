var express = require('express');
var router = express.Router();
const { sendEmail } = require("../../../controllers-pharmacy/emailController")

router.post("/sendEmail", sendEmail)

module.exports = router;