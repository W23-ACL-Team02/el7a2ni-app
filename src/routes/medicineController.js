var express = require('express');
const medicineModel = require('../models/medicine.js');
const { default: mongoose } = require('mongoose');
var router = express.Router();

router.post('/add', async (req, res) => {
    const {name, details, activeIngredients, quantity, sales, price, imageUrl} = req.body;
    
    try {
        const exists = await medicineModel.findOne({name: name}) 
        if (exists != null){
            res.status(400).send(`${name} is already in the database`);
            return
        }
        const medicine = await medicineModel.create({name, details, activeIngredients, quantity, sales, price, imageUrl})
        await medicine.save()
        res.status(200).send(`${name} created successfully!`);
    } catch (error) {
        res.status(400).json({err:error.message});
    }
})
router.get('/findmedicine', async (req,res) => {
    
    if(req.session.userType=="admin" ||req.session.userType=="patient" || req.session.userType=="pharmacist"){

      try{
        const medicine= await medicineModel.find({});
       // res.status(200).json(medicine);
        res.render('viewmedicine', {medicine:medicine})
      } catch(error){
        res.status(400).send("no medicine");
      }

    }
    else{
     res.status(400).send("Unauthorized Access");
    }

  
})
 
router.get('/getmedstats', async (req,res)=>{
 
    if(req.session.userType=="pharmacist"){
        
      try{
        const medicine= await medicineModel.find({});
       //res.status(400).json(medicine);
       //console.log(medicine)
       res.render('getmedstats', {medicine:medicine})
      } catch(error){
        res.status(400).send("no medicine");
      }

    }
    else{
     res.status(400).send("Unauthorized Access");
    }

    }

)


router.put('/edit', async (req, res) => {
    const {name, medicine} = req.body;
    
    try {
        //check if name changed
        if (name != medicine.name){
            //check if new name exists
            const exists = await medicineModel.findOne({name: medicine.name})
            if (exists != null){
                res.status(400).send(`${medicine.name} is already in the database`);
                return
            }
        }
        const updatedMedicine = await medicineModel.findOneAndUpdate({name: name}, medicine)
        await updatedMedicine.save()
        res.status(200).send(`Updated ${name} successfully`)
    } catch (error) {
        res.status(400).json({err:error.message});
    }
})

router.delete('/delete', async (req, res) => {
    const name = req.body.name;
    
    try {
        //check if name exists
        const exists = await medicineModel.find({name: name})
        if (exists == null){
            res.status(400).send(`${name} is not in the database`);
            return
        }
        
        const deletedMedicine = await medicineModel.deleteOne({name: name})
        res.status(200).send(`Deleted ${name} successfully`)
    } catch (error) {
        res.status(400).json({err:error.message});
    }
})

router.delete('/nuke', async (req, res) => {    
    try {
        const medicine = await medicineModel.deleteMany()
        res.status(200).send(`nuked the model 💣`);
    } catch (error) {
        res.status(400).json({err:error.message});
    }
})

router.get('/find', async (req, res) => { 
    const name = req.body.name
    try {
        const medicine = await medicineModel.findOne({name: name})
        res.status(200).send(medicine);
    } catch (error) {
        res.status(400).json({err:error.message});
    }
})

router.get('/findByIngredient', async (req, res) => { 
    const name = req.body.name
    try {
        const medicine = await medicineModel.find({activeIngredients: {name: {$regex: String(name), $options: 'i'}}})
        if (medicine == null){
            res.status(400).send(`Couldn't find ${name}`);
            return
        }
        res.status(200).send(medicine);
    } catch (error) {
        res.status(400).json({err:error.message});
    }
})

router.get('/all', async (req, res) => { 
    try {
        const medicine = await medicineModel.find()
        res.status(200).send(medicine);
    } catch (error) {
        res.status(400).json({err:error.message});
    }
})
module.exports = router;