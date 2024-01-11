const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const userModel = require("../models/user")
const healthPackageModel = require("../models/healthPackage");
const familyModel = require("../models/familymembers");

module.exports = {
    payByCard : async (req, res) => {
        let status, error;
        const {token, amount} = req.body;
        try{
            await stripe.charges.create({
                source: token.id,
                amount,
                currency: 'eur',
            });
            status = "success"
        } catch(error){
            console.log(error);
            status = "failure"
        }
        res.json(status)
    },
    payByWallet :  async (req, res) => {
        let status
        const totalPrice = req.body.totalPrice;
    
        const patientID = req.session.userId;
        
        try{
            const patient = await userModel.findOne({_id: patientID})
            const balance = patient.wallet
            console.log(balance)
    
            if(balance>=totalPrice){
                const newBalance = balance - totalPrice;
                const updatedPatient = await userModel.findOneAndUpdate({_id: patient._id}, {wallet : newBalance})
                await updatedPatient.save()
                //update new wallet balance 
                status = "success"
                res.status(200).json(status)   
            }else{
                status = "failure"
                res.json(status)
            }
    
        } catch(error){
            console.log(error)
            res.status(400).json(error)
        }
        
    },
    getAllSelectedHealthPackages : async (req, res) => {
        const packages = req.query.packages;
    
        try{
            const AllPatients = await userModel.find({type: 'patient'});
            const AllFamilyMembers = await familyModel.find();
            const AllHealthPackages = await healthPackageModel.find();
            const currUserID = req.session.userId;
            //const currUserID = "6547b96606043724533eedbf"
            const currUser = await userModel.findOne({_id: currUserID})
            const currUserHealthPackageID = currUser.healthPackage ? currUser.healthPackage.packageId : null
            let healthPackageDiscount = 0;
            if(currUserHealthPackageID &&  currUser.healthPackage.status === "Subscribed"){
                healthPackageDiscount = AllHealthPackages.filter(hp => hp._id == currUserHealthPackageID.valueOf())[0].discountFamilySubscription 
            }
            
            let totalPackages = [];

            packages.forEach(package => {
                let patient;
                if(package.patientType == "Myself" || package.patientType == "linked" ){
                    patient = AllPatients.filter(p => p._id == package.patientID)[0]
                }else{
                    patient = AllFamilyMembers.filter(p => p._id == package.patientID)[0]
                    console.log(patient)
                }

                let selectedPackage = AllHealthPackages.filter(hp => hp._id == package.packageID)[0];
                let patientName = patient.name;
                let packageName = selectedPackage.name;
                let packagePrice = selectedPackage.price; 
                let appliedDiscount = package.patientType !== "Myself" ? healthPackageDiscount : 0;
                if(patient._id != currUserID){
                    let discount = packagePrice * appliedDiscount
                    packagePrice = packagePrice - discount;
                }
                let forCurrUser = false;
                package.patientID === currUserID ? forCurrUser = true : forCurrUser = false ;
                totalPackages.push({
                    patientName : patientName,
                    packageName : packageName,
                    packagePrice : packagePrice,
                    appliedDiscount : appliedDiscount,
                    forCurrUser : forCurrUser
                })
            });     
    
            let totalPrice = 0
            totalPackages.forEach(p => totalPrice += p.packagePrice)
            
            const result = {
                totalPrice : totalPrice,
                totalPackages : totalPackages
            }
    
            res.status(200).json(result);
        } catch(error){
            res.status(400).json({ error: error.message});
        }
    },
    getAppointmentPrice : async (req, res) => {
        const doctorID = req.query.doctorID
        try{
            const AllHealthPackages = await healthPackageModel.find();
            const currUserID = req.session.userId;
            //const currUserID = "6547b96606043724533eedbf"
            const currUser = await userModel.findOne({_id: currUserID})
            const currUserHealthPackageID = currUser.healthPackage ? currUser.healthPackage.packageId : null
            let healthPackageDiscount = 0;
            
            if(currUserHealthPackageID &&  currUser.healthPackage.status === "Subscribed"){
                healthPackageDiscount = AllHealthPackages.filter(hp => hp._id == currUserHealthPackageID.valueOf())[0].discountSession 
            }
            const doctor = await userModel.findOne({_id : doctorID})
            const payRate = doctor.payRate
            const price = payRate - (payRate * healthPackageDiscount)    
            const result = {
                price : price,
                appliedDiscount : healthPackageDiscount
            }
            res.status(200).json(result)
        }catch(error){
            res.status(400).json({error: error})
        }
    }
}

// router.post('/payForHealthPackageByCard', async (req, res) => {
//     const packages = req.body.packages;
//     const packageIds = packages.map( p => p.packageID)
    
//     const totalPackages = [];
//     packages.forEach(package => {
//         let packageFound = false;
//         totalPackages.forEach(p => {
//             if(package.packageID == p.id){
//                 p.quantity = p.quantity + 1; 
//                 packageFound = true;
//             }
//         })
//         if(!packageFound){
//             totalPackages.push({id: package.packageID, quantity: 1})
//         }
//     });    

//     console.log(totalPackages)

//     try{
//         const healthPackages = await healthPackageModel.find({ _id: { $in: packageIds }})
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'], 
//             mode: 'payment',
//             line_items: totalPackages.map(package => {
//                 const healthPackage = healthPackages.filter( p => p._id == package.id )
//                 if (!healthPackage[0]) {
//                     // Handle the case where the health package is not found
//                     console.error('Health package not found for ID:', package.id);
//                     return null; // Skip this item
//                 }
//                 console.log(healthPackage[0])
//                 return {
//                     price_data: {
//                         currency: 'eur',
//                         product_data: {
//                             name: healthPackage[0].name
//                         },
//                         unit_amount: healthPackage[0].price    
//                     },
//                     quantity: package.quantity
//                 }
//             }).filter(Boolean),
//             success_url: "https://localhost:4000",
//             cancel_url: "https://localhost:4000"   
//         })
//         res.json({ url: session.url })
//     } catch(e) {
//         res.status(400).json({ error: e.message})
//     }
// });
