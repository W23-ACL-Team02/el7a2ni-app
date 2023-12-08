const familymemberSchema = require("../models/familymembers.js");
const userModel = require('../models/user.js');

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
                resultCreatedArr.push({id: member._id, name: member.name});
            }
            // await Promise.all(resultCreatedArr);
            
            // Iterate over linked family members
            let resultLinkedArr = [];
            for (let memberID of parentUser.family?.linked) {
                let member = await userModel.findById(memberID.id, {password: 0});
                resultLinkedArr.push({id: member.id, name: member.name});
            }
            // await Promise.all(resultLinkedArr);

            return res.status(200).json({listCreated: resultCreatedArr, listLinked: resultLinkedArr});
        } catch (error) {
            return res.status(500).json({errors: [error.message]})
        }
    }
}