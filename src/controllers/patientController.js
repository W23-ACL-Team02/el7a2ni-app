const userModel = require('../models/user');

module.exports = {
    subscribeToHealthPackage: async (req, res) => {
        try{
            const packageId = req.body.packageId
            
            // TODO: add package to specified family members 

            const startDate = new Date()
            const endDate = new Date()
            endDate.setDate(endDate.getDate() + 30)

            const package = {
                packageId: packageId,
                startDate: endDate,
                includedFamilyMembers: [],
                status: `Subscribed`,
                endDate: endDate
            }

            const patient = await userModel.updateOne({_id:req.session.userId}, {healthPackage: package});

            res.status(200).json(package)
        } catch (error) {
        res.status(400).json({ errors: [error.message] })
      }
    }
}