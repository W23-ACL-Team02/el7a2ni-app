var express = require('express');
const userModel = require('../../models/user.js');
const { default: mongoose } = require('mongoose');
var router = express.Router();

router.get('/', async(req, res) => {
  const id = req.query.id
  if (id == null) {
    console.log('Getting all users')
    try {
      const user = await userModel.find();
      res.status(200).send(user);
    } catch (error) {
      res.status(400).json({err:error.message});
    }
  }
  else {
    console.log('Getting user by id')
    try {
      const user = await userModel.find({_id:id});
      res.status(200).send(user);
    } catch (error) {
      res.status(400).json({err:error.message});
    }
  }
})

router.get('/getCurrUser', async (req, res) => {
  //const currUserID = req.session?.userId
  const currUserID = "6547cd2f63304dedceb8644b"
  try{ 
    const currUser = await userModel.findOne({_id: currUserID}, '-Password') 
    res.status(200).json(currUser)
  } catch(error){
    res.status(400).json({error: error})
  }
})

module.exports = router;