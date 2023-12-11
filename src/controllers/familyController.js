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
                let package = await healthPackageModel.findById(member.healthPackage.packageId)
                resultCreatedArr.push({id: member._id, name: member.name, status: member.healthPackage.status, endDate: member.healthPackage.endDate, packageName: package.name, packageColor: package.color});
            }
            // await Promise.all(resultCreatedArr);
            
            // Iterate over linked family members
            let resultLinkedArr = [];
            for (let memberID of parentUser.family?.linked) {
                let member = await userModel.findById(memberID.id, {password: 0});
                let package = await healthPackageModel.findById(member.healthPackage.packageId)
                resultLinkedArr.push({id: member._id, name: member.name, status: member.healthPackage.status, endDate: member.healthPackage.endDate, packageName: package.name, packageColor: package.color});
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
    }
}