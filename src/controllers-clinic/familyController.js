const familymemberSchema = require("../models/familymembers.js");
const userModel = require('../models/user.js');
const healthPackageModel = require('../models/healthPackage');

module.exports = {
    getFamilyIDs: async (req, res) => {
        if (req.session?.userId == undefined) {
            return res.status(401).json({errors: ["No Token."]})
        }

        try {
            let parentUser = await userModel.findById(req.session.userId);
            
            // Iterate over created family members
            let resultCreatedArr = [];
            for (let memberID of parentUser.family?.created) {
                let member = await familymemberSchema.findById(memberID.id);
                if (member == null || member == undefined) continue;

                let package = await healthPackageModel.findById(member.healthPackage.packageId)
                resultCreatedArr.push({id: member._id, name: member.name, status: member.healthPackage.status, endDate: member.healthPackage.endDate, packageName: package?.name ?? member.healthPackage.status, packageColor: package?.color ?? "#AEAEAE"});
            }
            // await Promise.all(resultCreatedArr);
            
            // Iterate over linked family members
            let resultLinkedArr = [];
            for (let memberID of parentUser.family?.linked) {
                let member = await userModel.findById(memberID.id, {password: 0});
                if (member == null || member == undefined) continue;

                let package = await healthPackageModel.findById(member.healthPackage?.packageId)
                resultLinkedArr.push({id: member._id, name: member.name, status: member.healthPackage.status, endDate: member.healthPackage.endDate, packageName: package?.name ?? member.healthPackage.status, packageColor: package?.color ?? "#AEAEAE"});
            }
            // await Promise.all(resultLinkedArr);

            return res.status(200).json({family: {listCreated: resultCreatedArr, listLinked: resultLinkedArr}});
        } catch (error) {
            return res.status(500).json({errors: [error.message]})
        }
    },
    cancelSubscription: async (req, res) => {
        const patientId = req.session.userId;
        const memberType = req.body.memberType;
        const memberId = req.body.memberId;

        try{
            const patient = await userModel.findById(patientId)

            // TODO: make sure the family member is of the patient's and update the code below

            if (!patient.healthPackage || patient.healthPackage.status == "Cancelled"){
                res.status(400).json({errors: ["No active subscription to cancel"]})
                return
            }
            if (patient.healthPackage.status == "Subscribed through family member"){
                res.status(400).json({errors: ["Cannot cancel for yourself"]})
                return
            }
            const package = patient.healthPackage
            package.status = "Cancelled"
            await patient.updateOne({_id: patientId}, {healthPackage: package})
            await patient.save()

            res.status(200).json({subscription: patient.healthPackage})
            
        } catch (error){
            res.status(400).json({errors: [error.message]})
        }
    },
    linkFamilyMember: async(req,res) =>{
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
    },
    viewFamilyMember: async (req,res) => {
        //change to params to test
        //TODO
       const userId = req.session.userId;
       //const userId='65771f862e100341613e4a71'
        
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
            console.log(createdFamilyMembers)
            console.log(linkedFamilyMembers)
        
            res.status(200).json({createdFamilyMembers,linkedFamilyMembers})
        } catch(error) {
      
          res.status(400).json({err:error.message})
        }
    },
    createFamilyMember: async (req,res) => {
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
    }
}
