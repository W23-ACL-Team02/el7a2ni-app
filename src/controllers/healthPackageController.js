const healthPackageModel = require('../models/healthPackage');

module.exports = {
    addHealthPackage: async (req, res) => {
        // Add a health package to the DB
        const {name, price, discountSession, discountMedicine, discountFamilySubscription} = req.body ?? {};
        
        try {
            const healthPackage = await healthPackageModel.create({name, price, discountSession, discountMedicine, discountFamilySubscription});
            await healthPackage.save();
            
            return res.status(200).json({successes: [`Successfully added ${name} health package.`]});
        } catch (error) {
            return res.status(400).json({errors: [error.message]});
        }
    },
    updateHealthPackage: async (req, res) => {
        // Update an existing health package in the DB
        const {_id, name, price, discountSession, discountMedicine, discountFamilySubscription} = req.body ?? {};
        
        try {
            const result = await healthPackageModel.updateOne({_id}, {name, price, discountSession, discountMedicine, discountFamilySubscription});
            
            if (result.modifiedCount < 1) {
                throw new Error(`Health package ${_id} does not exist.`);
            }
            
            return res.status(200).json({successes: [`Successfully updated ${name} health package.`]});
        } catch (error) {
            return res.status(400).json({errors: [error.message]});
        }
    },
    deleteHealthPackage: async (req, res) => {
        // Remove an existing health package from the DB
        const _id = req.body?._id;
        
        try {
            const result = await healthPackageModel.deleteOne({_id});
            
            if (result.deletedCount < 1) {
                throw new Error(`Health package ${_id} does not exist.`);
            }
            
            return res.status(200).json({successes: [`Successfully deleted health package ${_id}.`]})
        } catch (error) {
        return res.status(400).json({errors: [error.message]});
        }
    },
    getHealthPackages: async (req, res) => {
        // Check if specific healthPackage to be viewed
        const _id = req.query?.id ?? null;
        
        try {
            const healthPackages = (_id == null) ? await healthPackageModel.find() : await healthPackageModel.findById(_id);
            return res.status(200).json({healthPackages});
        } catch (error) {
            return res.status(400).json({errors: [error.message]});
        }
    }
}