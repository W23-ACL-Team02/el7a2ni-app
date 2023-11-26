const express = require("express");
var router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

app.post('/api/payments/payByCard', async (req, res) => {
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card']    
        })
    } catch(error) {

    }
})