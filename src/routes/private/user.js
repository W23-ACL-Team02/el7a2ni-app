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

module.exports = router;