const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const userModel = require("../models/user")
const medicineModel = require("../models/medicine");

module.exports = {
    payByCard : async (req, res) => {
        let status, error;
        const {token, amount} = req.body;
        console.log(amount)
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
    
        //const patientID = req.session.userId;
        const patientID = "6547b96606043724533eedbf"
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
        const medicine = req.body.medicine;
    
        try{
            const AllMedicine = await medicineModel.find();        
            let totalMedicine = [];
           
            medicine.forEach(med => {
                let medicineInfo = AllMedicine.filter(m => m._id == med.id)[0]
                let medicineName = medicineInfo.name;
                let medicineUnitPrice = medicineInfo.price
                let medicinePrice = medicineUnitPrice * med.quantity 
                
                totalMedicine.push({
                    medicineName : medicineName,
                    medicinePrice : medicinePrice,
                    medicineQuantity  : med.quantity 
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
    },
}

