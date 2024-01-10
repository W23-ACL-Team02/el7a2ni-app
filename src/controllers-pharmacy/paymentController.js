const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const nodemailer = require('nodemailer')
const userModel = require("../models/user")
const medicineModel = require("../models/medicine");
const healthPackageModel = require("../models/healthPackage");

module.exports = {
    payByCard : async (req, res) => {
        let status, error;
        const {token, amount} = req.body;
        console.log(Math.ceil(amount))
        try{
            await stripe.charges.create({
                source: token.id,
                amount: Math.ceil(amount),
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
            res.status(400).json(error)
        }
        
    },
    getAllSelectedMedicine : async (req, res) => {
        //const medicine = req.query.medicine;
       const currUserID = req.session.userId;
        try{
            const AllHealthPackages = await healthPackageModel.find();
            const AllMedicine = await medicineModel.find(); 
            const currUser = await userModel.findOne({_id: currUserID})
            const cart = currUser.cart;
            const currUserHealthPackageID = currUser.healthPackage ? currUser.healthPackage.packageId : null
            
            let healthPackageDiscount = 0;
            if(currUserHealthPackageID &&  currUser.healthPackage.status === "Subscribed"){
                healthPackageDiscount = AllHealthPackages.filter(hp => hp._id == currUserHealthPackageID.valueOf())[0].discountMedicine 
            }
            
            let totalMedicine = [];
           
            cart.forEach(med => {
                let medicineInfo = med.medicine
                let medicineName = medicineInfo.name; 
                let medicineUnitPrice = medicineInfo.price - healthPackageDiscount*medicineInfo.price
                let medicinePrice = medicineUnitPrice * med.quantity 
                
                totalMedicine.push({
                    medicineName : medicineName,
                    medicinePrice : medicinePrice,
                    medicineQuantity  : med.quantity, 
                    appliedDiscount : healthPackageDiscount
                })
            });     

            let totalPrice = 0
            totalMedicine.forEach(m => totalPrice += m.medicinePrice)
            
            const result = {
                totalPrice : totalPrice,
                totalMedicine : totalMedicine
            }
    
            res.status(200).json(result);
        } catch(error){
            res.status(400).json({ error: error.message});
        }
    }
}

