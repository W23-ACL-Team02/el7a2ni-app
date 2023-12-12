var express= require('express');
const familymemberSchema=require("../../models/familymembers.js");
const userModel = require('../../models/user.js');
var router = express.Router({mergeParams: true}); 

router.get('/addfamily',(req,res) => {
  res.render('addfamilymember')   
})

router.post('/addFamily', async (req,res) => {
  const {name, nationalID, age, gender, relationship} = req.body; 
// add to test
// const familymember= req.body

  try {
    const familymember =  await familymemberSchema.create({name,nationalID,age,gender,relationship});
    
    const userId = req.session?.userId;
    let user = await userModel.findOne({_id: userId});
    
    if (user == null) { //comment to test
      throw new Error("User not found. Maybe Session timed out.")
    }

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
  //change to params to test
  const userId = req.session.userId;
  
  try {
    //change from userId to username
    let user = await userModel.findOne({_id:userId});

    if (user == null) {
      throw new Error("User not found. Maybe Session timed out.")
    }

    const familymembers = user.viewfamilymember();
    const createdFamilyMembers = [];
    if (familymembers && familymembers.created) {
      for (const member of familymembers.created) {
        const familyMemberData = await familymemberSchema.findById(member.id);
        if (familyMemberData) {
          createdFamilyMembers.push(familyMemberData);
        }
      }
    }
   const  linkedFamilyMembers=[]
    if (familymembers && familymembers.linked) {
      for (const member of familymembers.linked) {
        const familyMemberData = await userModel.findById(member.id);
        const relationship=member.relationship
        if (familyMemberData) {
          linkedFamilyMembers.push({familyMemberData,relationship});
        }
      }
    }

    res.status(200).json({createdFamilyMembers,linkedFamilyMembers})
  } catch(error) {

    res.status(400).json({err:error.message})
  }
})


router.post ('/linkFamilyMember',async(req,res) =>{
  const userId = req.session.userId;
  const  {phoneNumber,email,relationship} = req.body
  try{

    let user = await userModel.findOne({_id:userId});
    const LinkedFamilyMemberAccount = await userModel.findOne({
      $or: [
          { mobile: phoneNumber },
          { email: email }
      ]
  });

  const LinkedFamilyMember= {
    
      id: LinkedFamilyMemberAccount._id,
      relationship: relationship
    }
  
   user.addLinkedFamilyMember(LinkedFamilyMember)
   await user.save();
   res.status(200).send("add familymember Successfully")

    
  } catch(error) {
    res.status(400).json({err:error.message})
  }
})

// router.get('viewLinkedFamilyMember',async(req,res)=>
// {
//   const userId=req.session.userId;
//   try{
//   let user = await userModel.findOne({username:userId});
//   const linkedFamilyMembers = user.linkedFamilyMembers;
//   res.status(200).json({linkedFamilyMembers})
//   }catch(error) {

//   res.status(400).json({err:error.message})
// }


// })

module.exports= router;