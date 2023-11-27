const userModel = require('../models/user');

module.exports = {
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
  },
  getPatientById: async (req,res) => {
    // Ensure admin access
    if(req.session.userType != "admin") {
      return res.status(403).send("Unauthorized Access");
    }
    
    try {
      const patient = await userModel.findById(req.params.id);
      
      return res.status(200).json(patient);
    } catch(error) {
      res.status(400).json({err: error.message});
    }
  },
  getPharmacistById: async (req,res) => {
    // Ensure admin access
    if(req.session.userType != "admin") {
      return res.status(400).send("Unauthorized Access");
    }
    
    try {
      const pharmacist = await userModel.findById(req.params.id);
  
      return res.status(200).json(pharmacist)
    } catch(error) {
      res.status(400).json({err: error.message});
    }  
  },
  getPatients: async(req,res)  => { 
    // Ensure admin access
    if(req.session.userType != "admin") {
      return res.status(400).send("Unauthorized Access");
    }
  
    try {
      const users = await userModel.find();
      const usersFiltered= users.filter( (user) => user.type === "patient") //only patient types
  
      return res.status(200).json(usersFiltered)
    } catch(error){
      res.status(400).json({err:error.message})
    }
  },
  getPharmacists:  async(req,res)  => { 
    // Ensure admin access
    if(req.session.userType != "admin") {
        return res.status(400).send("Unauthorized Access");
    }

    try {
        //retrieve only pharmacist types who are accepted
        const users = await userModel.find();
        const usersFiltered = users.filter((user) => user.acceptanceStatus == 'accepted' && user.type == "pharmacist")

        return res.status(200).json(usersFiltered);
    } catch(error){
        res.status(400).json({err:error.message})
    }
  },
  getPendingPharmacists: async(req,res)  => { 
    // Ensure admin access
    if(req.session.userType != "admin") {
      return res.status(400).send("Unauthorized Access");
    }

    const id = req.query?.id ?? null;
   
    try {
      //retrieve only pending pharmacists
      const users = await userModel.find();
      let usersFiltered = users.filter((user) => user.acceptanceStatus == 'pending' && user.type == "pharmacist")

      if (id != null) usersFiltered = usersFiltered.filter((user) => user._id == id);
  
      return res.status(200).json(usersFiltered)
    } catch(error) {
      res.status(400).json({err:error.message})
    }
  },
  rejectPharmacist: async (req, res) => {
    const _id = req.body._id;
  
    try {
      if (_id == undefined) {
        throw new Error("No user id provided to reject.")
      }

      // Update user
      let result = await userModel.findByIdAndUpdate(_id, {acceptanceStatus: 'rejected'});
  
      if (result.modifiedCount < 1) {
        throw new Error(`Pharmacist ${_id} does not exist.`);
      }
  
      return res.status(200).json({successes: [`Successfully rejected pharmacist ${_id}`]});
    } catch (error) {
      return res.status(400).json({errors: [error.message]});
    }
  },
  acceptPharmacist: async (req, res) => {
    const _id = req.body._id;
  
    try {
      if (_id == undefined) {
        throw new Error("No user id provided to reject.")
      }
      
      // Update user
      let result = await userModel.findByIdAndUpdate(_id, {acceptanceStatus: 'accepted'});
  
      if (result.modifiedCount < 1) {
        throw new Error(`Pharmacist ${_id} does not exist.`);
      }
  
      return res.status(200).json({successes: [`Successfully approved pharmacist ${_id}`]});
    } catch (error) {
      return res.status(400).json({errors: [error.message]});
    }
  }
}