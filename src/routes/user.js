var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Virtual Clinic' });
});

router.put('/addFamily/:username', async (req, res) => {
    // Fetch user
    const {nameOf, nationalID, age, gender, relation} = req.body;
    const username = req.params.username;
    let user = await userModel.findOne({username});
  
    // Add family member
    user.addFamilyMember(req.body);
  
    // Save
    await user.save();
  
    return res.status(200).send("Ok")
  })

module.exports = router;
