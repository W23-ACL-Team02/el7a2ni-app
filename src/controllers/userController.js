const userModel = require('../models/user');

module.exports = {
    getPendingDoctors: async (req, res) => {
        const id = req.query?.id ?? null;
        let query = {acceptanceStatus: 'pending'};

        if (id !== null) {
            // Return all documents of pending doctors   
            query._id = id;
        }
        
        const doctors = await userModel.find(query);
        return doctors;
        // return res.status(200).json(doctors);
    } 
}