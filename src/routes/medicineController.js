var express = require('express');
const medicineModel = require('../models/medicine.js');
const { default: mongoose } = require('mongoose');
const app = require('../app.js');
var router = express.Router();

// router.get('/add', (req, res) => {
//     res.render('addMedicine');
// })

router.post('/add', async (req, res) => {
    const {name, details, activeIngredients, category, quantity, price} = req.body;
    var splitIngredients = activeIngredients.split("|")
    var jsonIngredients = "["
    for (let index = 0; index < splitIngredients.length; index++) {
        jsonIngredients += "\"" + splitIngredients[index] + "\","
    }
    jsonIngredients = jsonIngredients.substring(0, jsonIngredients.length - 1) + "]"
    jsonIngredients = JSON.parse(jsonIngredients)
    try {
        const exists = await medicineModel.findOne({name: name})
        if (exists != null){
            res.status(400).json(`${name} is already in the database`);
            return
        }
        const medicine = await medicineModel.create({name, details, category, activeIngredients: jsonIngredients, quantity, sales: 0, price})
        await medicine.save()
        res.status(200).json(medicine);
    } catch (error) {
        res.status(400).json({err:error.message});
    }
})

router.put('/edit', async (req, res) => {
    var {id, name, details, category, activeIngredients, quantity, price} = req.body;
    var splitIngredients = activeIngredients.split("|")
    var jsonIngredients = "["
    for (let index = 0; index < splitIngredients.length; index++) {
        jsonIngredients += "\"" + splitIngredients[index] + "\","
    }
    jsonIngredients = jsonIngredients.substring(0, jsonIngredients.length - 1) + "]"
    activeIngredients = JSON.parse(jsonIngredients)
    try {
        const updatedMedicine = await medicineModel.findOneAndUpdate({_id: id}, {_id: id, name, details, category, activeIngredients, quantity, price})
        await updatedMedicine.save()
        res.status(200).json(updatedMedicine)
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
            res.status(400).json(`${name} is not in the database`);
            return
        }
        
        const deletedMedicine = await medicineModel.deleteOne({name: name})
        res.status(200).json({message: `Deleted ${name} successfully`})
    } catch (error) {
        res.status(400).json({err:error.message});
    }
})

router.delete('/nuke', async (req, res) => {    
    try {
        const medicine = await medicineModel.deleteMany()
        res.status(200).json({message: `nuked the model 💣`});
    } catch (error) {
        res.status(400).json({err:error.message});
    }
})

router.get('/find', async (req, res) => { 
    const searchKey = req.query.search

    try {
        const medicine = await medicineModel.find({"$or": [{name: {"$regex": searchKey, "$options": "i"}}, {activeIngredients: {"$regex": searchKey, "$options": "i"}}]})
        // const categories = await medicineModel.find().distinct("category")
        res.status(200).json({medicine: medicine, userType: req.session.userType})
        // res.render("allMedicine", {medicine, categories, userType: req.session.userType})
    } catch (error) {
        res.status(400).json({err:error.message});
    }
})

router.get('/findmedicine', async (req,res) => {
    
    if(req.session.userType=="admin" ||req.session.userType=="patient" || req.session.userType=="pharmacist"){

      try{
        const medicine= await medicineModel.find({});
       res.status(200).json(medicine);
        // res.render('viewmedicine', {medicine:medicine})
      } catch(error){
        res.status(400).json({message: "no medicine"});
      }

    }
    else{
     res.status(400).json("Unauthorized Access");
    }
})

router.get('/getmedstats', async (req,res)=> {
 
    if(req.session.userType=="pharmacist"){
        
      try{
        const medicine= await medicineModel.find({});
       res.status(200).json(medicine);
       //console.log(medicine)
    //    res.render('getmedstats', {medicine:medicine})
      } catch(error){
        res.status(400).json("no medicine");
      }

    }
    else{
     res.status(400).json("Unauthorized Access");
    }
})

router.get('/view', async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.query.id)
    
    try {
        const medicine = await medicineModel.findOne({_id: id})

        var activeIngredients = JSON.stringify(medicine._doc.activeIngredients)
        activeIngredients = activeIngredients.substring(1, activeIngredients.length - 1) //remove []
        activeIngredients = activeIngredients.split(",")
        var activeIngredientsString = ""
        for (let index = 0; index < activeIngredients.length; index++) {
            activeIngredientsString += activeIngredients[index].substring(1, activeIngredients[index].length - 1) + "|"; //remove ""
        }
        activeIngredientsString = activeIngredientsString.substring(0, activeIngredientsString.length - 1) //for the extra | at the end
        medicine._doc.activeIngredients = activeIngredientsString
        res.status(200).json(medicine);
        // res.render("editMedicine", {"medicine": medicine})
    } catch (error) {
        res.status(400).json({err:error.message});
    }
})

router.get('/findByIngredient', async (req, res) => { 
    const name = req.body.name
    try {
        const medicine = await medicineModel.find({activeIngredients: {name: {$regex: String(name), $options: 'i'}}})
        if (medicine == null){
            res.status(400).json(`Couldn't find ${name}`);
            return
        }
        res.status(200).json(medicine);
    } catch (error) {
        res.status(400).json({err:error.message});
    }
})

router.get('/all', async (req, res) => { 
    try {
        const medicine = await medicineModel.find()
        res.status(200).json(medicine);
    } catch (error) {
        res.status(400).json({err:error.message});
    }
})

router.get('/', async (req, res) => {
    try {
        const medicine = await medicineModel.find()
        const categories = await medicineModel.find().distinct("category")
        res.status(200).json(medicine, categories, req.session.userType)
        // res.render("allMedicine", {"medicine": medicine, "categories": categories, userType: req.session.userType})
    } catch (error) {
        res.status(400).json({err:error.message});
    }
})

module.exports = router;