var express = require('express');
var router = express.Router({mergeParams: true});
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const userModel = require('../../models/user.js');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check for user in database
        const user = await userModel.findOne({ username: username });

        if (!user || password != user.password || user.type == 'doctor') {
            // If not found reload page with error message
            return res.status(400).json({errors: ["Incorrect username/password"]});
        }
        
        if (user?.type == 'pharmacist' && user.acceptanceStatus != 'accepted') {
            // If a pharmacist and not yet accepted
            return res.status(400).json({errors: [`Pharmacist ${user.name} ${(user.acceptanceStatus == 'pending') ? "not yet approved.":"rejected."}`]} );
        }

        // Else load session variables
        let payload = {
            loggedin: true,
            userId: user?._id,
            userType: user?.type
        }

        // const token = jwt.sign(payload, secret, {expiresIn: '1h'});
        const token = jwt.sign(payload, secret);

        req.session = payload;

        return res.status(200).send(token);
        // return res.status(200).end();
    } catch (error) {
        res.status(400).json({ errors: [error.message] });
    }
})

router.post('/register/patient', async (req, res) => {
    // Add user to database
    const { username, name, email, password, dateOfBirth, gender, mobile, emergency_name, emergency_mobile, emergency_relation } = req.body;
    const emergencyContact = {
      name: emergency_name,
      mobile: emergency_mobile,
      relation: emergency_relation
    };
    const type = "patient";
    const family = [];
    const prescriptions = [];
  
    try {
      const user = await userModel.create({ username, name, email, password, dateOfBirth, gender, mobile, type, family, prescriptions, emergencyContact });
      await user.save();
  
      res.status(200).send(`Patient ${user.username} created successfully!`);
    } catch (error) {
      res.status(400).json({ errors: [error.message] });
    }
});

router.post('/register/pharmacist', async (req, res) => {
    const {username, name, email, password, dateOfBirth, hourlyRate, affiliation, education_name, education_end} = req.body;
    const education = {
      name: education_name,
      endYear: education_end.split("-")[0]
    }
    const type = "pharmacist";
    const acceptanceStatus = 'pending';
  
    try {
      const user = await userModel.create({username, name, email, password, dateOfBirth, hourlyRate, affiliation, education, type, acceptanceStatus});
      await user.save();
  
      res.status(200).send(`Pharmacist ${user.username} created successfully!`);
    } catch (error) {
      res.status(400).json({err:error.message});
    }
});

module.exports = router;