const userModel = require('../models/user');

module.exports = {
  getPendingDoctors: async (req, res) => {
    const id = req.query?.id ?? null;
    let query = {acceptanceStatus: 'pending', type:'doctor'};

    // Return all documents of pending doctors   
    if (id !== null) {
      query._id = id;
    }
    
    try {
      const doctors = await userModel.find(query);
      return res.status(200).json(doctors);
    } catch (error) {
      return res.status(400).json({errors: [error.message]})
    }
  },
  rejectDoctor: async (req, res) => {
    const _id = req.body._id;
  
    try {
      // Update user
      let result = await userModel.findByIdAndUpdate(_id, {acceptanceStatus: 'rejected'});
  
      if (result.modifiedCount < 1) {
        throw new Error(`Health package ${_id} does not exist.`);
      }
  
      return res.status(200).json({successes: [`Successfully rejected doctor ${_id}`]});
    } catch (error) {
      return res.status(400).json({errors: [error.message]});
    }
  },
  acceptDoctor: async (req, res) => {
    const _id = req.body._id;
  
    try {
      // Update user
      let result = await userModel.findByIdAndUpdate(_id, {acceptanceStatus: 'accepted'});
  
      if (result.modifiedCount < 1) {
        throw new Error(`Health package ${_id} does not exist.`);
      }
  
      return res.status(200).json({successes: [`Successfully approved doctor ${_id}`]});
    } catch (error) {
      return res.status(400).json({errors: [error.message]});
    }
  },
  removeUser: async (req, res) => {
    try {
      // Authenticate that the user is an admin first
      if (req.session.userType !== 'admin') {
        return res.status(403).json({ errors: ['Permission denied. You must be an admin to remove a user.'] });
      }
  
      const { username } = req.body
      const user = await userModel.findOneAndRemove({ username: username });
      if (!user) {
        res.status(404).json({ errors: ['User not found'] });
        return;
      }
      res.status(200).json({ successes: ['User removed successfully'] });
  
    } catch (error) {
      res.status(400).json({ errors: [error.message] })
    }
  },
  addAdmin: async (req, res) => {
    try {
      if (req.session.userType !== 'admin') {
        return res.status(403).json({ message: 'Permission denied. You must be an admin to add another administrator.' });
      }
  
      const { username, password } = req.body;
      const admin = await userModel.create({ username: username, password: password, type: "admin" });
      await admin.save();
  
      res.status(200).json({successes: ["Admin added successfully"]});
  
    } catch (error) {
      res.status(400).json({ errors: [error.message] })
    }
  }
}