const userModel = require('../models/user');

module.exports = {
    async getPendingDoctors(id) {
        if (id == undefined) {
            // Return all documents of pending doctors   
            return await userModel.find({acceptanceStatus: 'pending'})
        }

        return await userModel.find({_id: id, acceptanceStatus: 'pending'});
    }
}