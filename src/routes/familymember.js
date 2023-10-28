var express= require('express');
const familymemberSchema=require("../models/familymembers.js");
const userModel = require('../models/user.js');
var router = express.Router(); 



router.get('/addfamily',(req,res)=>
 {
      res.render('addfamilymember')   
 })
router.post('/addFamily', async (req,res) => {
  try {
    const {name, nationalID, age, gender, relationship} = req.body;
    const familymember =  await familymemberSchema.create({name,nationalID,age,gender,relationship});

    const userId = req.session.userId;
    let user = await userModel.findOne({_id: userId});

    // Add family member
    user.addFamilyMember(familymember);
  
    await familymember.save()
    await user.save()
    res.status(200).send("add familymember Successfully")
  } catch(error) {
    res.status(400).json({err:error.message})
  }
})

router.get('/viewfamilymember', async (req,res) => {
  try {
    const userId = req.session.userId;
    let user = await userModel.findOne({_id: userId});

    const familymembers = user.viewfamilymember();

    res.render('familymember',{familymembers})
  } catch(error) {
    res.status(400).json({err:error.message})
  }
})

module.exports= router;