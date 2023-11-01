var express = require('express');
const healthPackageModel = require('../models/healthPackage');
var router = express.Router();

router.all('*', (req, res, next) => {
  // Ensure admin
  if (req.session.userType != 'admin') {
    return res.status(400).send('Unauthorized Access.')
  }

  next();
});

router.route('/healthPackage')
  .post(async (req, res) => {
    // Add a health package to the DB
    const {name, price, discountSession, discountMedicine, discountFamilySubscription} = req.body ?? {};

    try {
      const healthPackage = await healthPackageModel.create({name, price, discountSession, discountMedicine, discountFamilySubscription});
      await healthPackage.save();

      return res.status(200).send(`Successfully added ${name} health package.`);
    } catch (error) {
      return res.status(400).json({err: error.message});
    }
  })
  .put(async (req, res) => {
    // Update an existing health package in the DB
    const {_id, name, price, discountSession, discountMedicine, discountFamilySubscription} = req.body ?? {};
    
    try {
      const result = await healthPackageModel.updateOne({_id}, {name, price, discountSession, discountMedicine, discountFamilySubscription});

      if (result.modifiedCount < 1) {
        throw new Error(`Health package ${_id} does not exist.`);
      }

      return res.status(200).send(`Successfully updated ${name} health package.`);
    } catch (error) {
      return res.status(400).json({err: error.message});
    }
  })
  .delete(async (req, res) => {
    // Remove an existing health package from the DB
    const _id = req.body?._id;

    try {
      const result = await healthPackageModel.deleteOne({_id});

      if (result.deletedCount < 1) {
        throw new Error(`Health package ${_id} does not exist.`);
      }

      return res.status(200).send(`Successfully deleted health package ${_id}.`)
    } catch (error) {
      return res.status(400).json({err: error.message});
    }
  })

module.exports = router;