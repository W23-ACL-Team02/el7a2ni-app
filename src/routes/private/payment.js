const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const userModel = require("../../models/user")
const healthPackageModel = require("../../models/healthPackage");
const bodyParser = require('body-parser');
var router = express.Router()

router.post('/payForHealthPackageByCard', async (req, res) => {
    const packages = req.body.packages;
    const packageIds = packages.map( p => p.packageID)
    
    const totalPackages = [];
    packages.forEach(package => {
        let packageFound = false;
        totalPackages.forEach(p => {
            if(package.packageID == p.id){
                p.quantity = p.quantity + 1; 
                packageFound = true;
            }
        })
        if(!packageFound){
            totalPackages.push({id: package.packageID, quantity: 1})
        }
    });    

    console.log(totalPackages)

    try{
        const healthPackages = await healthPackageModel.find({ _id: { $in: packageIds }})
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], 
            mode: 'payment',
            line_items: totalPackages.map(package => {
                const healthPackage = healthPackages.filter( p => p._id == package.id )
                if (!healthPackage[0]) {
                    // Handle the case where the health package is not found
                    console.error('Health package not found for ID:', package.id);
                    return null; // Skip this item
                }
                console.log(healthPackage[0])
                return {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: healthPackage[0].name
                        },
                        unit_amount: healthPackage[0].price    
                    },
                    quantity: package.quantity
                }
            }).filter(Boolean),
            success_url: "https://localhost:4000",
            cancel_url: "https://localhost:4000"   
        })
        res.json({ url: session.url })
    } catch(e) {
        res.status(400).json({ error: e.message})
    }
});

router.post('/payForHealthPackageByWallet', async (req, res) => {
    const packages = req.body.packages;
    const packageIds = packages.map( p => p.packageID)

    const totalPackages = [];
    packages.forEach(package => {
        let packageFound = false;
        totalPackages.forEach(p => {
            if(package.packageID == p.id){
                p.quantity = p.quantity + 1; 
                packageFound = true;
            }
        })
        if(!packageFound){
            totalPackages.push({id: package.packageID, quantity: 1})
        }
    }); 
    
    let totalPrice = 0;

    const patientID = req.session.userId;
    try{
        const patient = await userModel.findOne({_id: patientID})
        const healthPackages = await healthPackageModel.find({ _id: { $in: packageIds }})
        totalPackages.forEach(p => {
            healthPackages.filter( hp => hp._id == p.id)
            if(healthPackages[0]){
                totalPrice += hp.price * p.quantity    
            }
        })
        //const balance = patient.wallet
        const balance = 20000; // in cents
        if(balance>totalPrice){
            const newBalance = balance - totalPrice;
            //await userModel.findOneAndUpdate({_id: patient._id}, {wallet : newBalance})
            //update new wallet balance 
            res.status(200).json()   
        }else{
            res.status(500).json("not enough balance in wallet")
        }

    }catch(error){
        res.status(400).json(error)
    }
    
});

router.post('/payForAppointmentByCard', async (req, res) => {
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], 
            mode: 'payment',
            line_items: req.body.items.map(item => {
                const storeItem = medicine.get(item.id)
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: storeItem.name
                        },
                        unit_amount: storeItem.priceInCents    
                    },
                    quantity: item.quantity
                }
            }),
            success_url: "https://localhost:4000",
            cancel_url: "https://localhost:4000"   
        })
        res.json({ url: session.url })
    } catch(e) {
        res.status(400).json({ error: e.message})
    }
})

// This is your Stripe CLI webhook secret for testing your endpoint locally.
// const endpointSecret = "whsec_d7d73edaaa2d08f3f0ee5ca1c1cef759ac9b764935764053870433daf816c077";

// router.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
//   const sig = request.headers['stripe-signature'];

//   let event;

//   console.log('Stripe Signature:', sig);
//   //console.log('Request Payload:', request.body);

//   try {
//     event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//   } catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'checkout.session.completed':
//       console.log(event.data.object);
//       console.log("bbbbb");

//       break;
   
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.status(200).end();
// });


module.exports = router;