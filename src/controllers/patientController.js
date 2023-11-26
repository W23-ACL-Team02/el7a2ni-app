const userModel = require('../models/user');


module.exports = {
    subscribeToHealthPackage: async (req, res) => {
        try{
            const packageId = req.body.packageId
            
            // TODO: add package to specified family members 

            const package = {
                packageId: packageId,
                startDate: new Date().getDate(),
                includedFamilyMembers: [],
                status: `Subscribed`,
                endDate: new Date().setDate(new Date.getDate() + 30)
            }

            const patient = await userModel.updateOne({_id:req.session.userId}, {healthPackage: package})
            await patient.save()

            res.status(200).json(patient)
        } catch (error) {
        res.status(400).json({ errors: [error.message] })
      }
    }
}