const userModel = require('../models/user');
const healthPackageModel = require('../models/healthPackage');

module.exports = {
    subscribeToHealthPackage: async (req, res) => {
        try{
            const packageId = req.body.packageId;
            const patientId = req.session.userId;
            const patient = await userModel.findById(patientId);

            // TODO: add package to specified family members 

            if (patient.healthPackage?.status !== "Cancelled"){
                res.status(400).json({errors: ["Already subscribed"]})
                return
            }
            const startDate = new Date()
            const endDate = new Date()
            endDate.setDate(endDate.getDate() + 30)

            const package = {
                packageId: packageId,
                startDate: startDate,
                includedFamilyMembers: [],
                status: `Subscribed`,
                endDate: endDate
            }

            await patient.updateOne({healthPackage: package});
            await patient.save();

            res.status(200).json(package)
        } catch (error) {
        res.status(400).json({errors: [error.message]})
      }
    },
    viewSubscriptionDetails: async (req, res) => {
        const patientId = req.session.userId;

        try{

            const patient = await userModel.findById(patientId)
            const package = await healthPackageModel.findById(patient.healthPackage?.packageId)
            res.status(200).json({package: package, subscription: patient.healthPackage})
            
        } catch (error){
            res.status(400).json({errors: [error.message]})
        }
    },
    cancelSubscription: async (req, res) => {
        const patientId = req.session.userId;

        try{

            const patient = await userModel.findById(patientId)
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
    upgradeSubscription: async (req, res) => {
        const patientId = req.session.userId;
        const newPackageId = req.body.packageId;

        try{

            const patient = await userModel.findById(patientId)
            if (!patient.healthPackage || patient.healthPackage.status == "Cancelled"){
                res.status(400).json({errors: ["No active subscription to upgrade"]})
                return
            }
            if (patient.healthPackage.status == "Subscribed through family member"){
                res.status(400).json({errors: ["Cannot upgrade for yourself"]})
                return
            }

            // TODO: check if new package is a higher tier one

            const package = patient.healthPackage
            package.upgrade = newPackageId
            await patient.updateOne({_id: patientId}, {healthPackage: package})
            await patient.save()

            res.status(200).json({subscription: patient.healthPackage})
            
        } catch (error){
            res.status(400).json({errors: [error.message]})
        }
    },
    renewSubscription: async (req, res) => {
        const patientId = req.session.userId;

        // TODO: make sure next subscription payment is collected somehow

        try{

            const patient = await userModel.findById(patientId)
            if (!patient.healthPackage || patient.healthPackage.status == "Cancelled"){
                res.status(400).json({errors: ["No active subscription to upgrade"]})
                return
            }
            if (patient.healthPackage.status == "Subscribed through family member"){
                res.status(400).json({errors: ["Cannot renew for yourself"]})
                return
            }
            const package = patient.healthPackage
            const oldEndDate = package.endDate
            const newEndDate = oldEndDate
            newEndDate.setDate(newEndDate.getDate() + 30) //adding 30 days to endDate
            package.endDate = newEndDate
            //checking for upgrade
            if (!package.upgrade){
                package.packageId = package.upgrade
                package.upgrade = undefined
            }
            
            await patient.updateOne({healthPackage: package})
            await patient.save()

            res.status(200).json({subscription: patient.healthPackage})
            
        } catch (error){
            res.status(400).json({errors: [error.message]})
        }
    }
}