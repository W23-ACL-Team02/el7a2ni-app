var express = require('express');
var router = express.Router();
const {addHealthPackage, updateHealthPackage, deleteHealthPackage, getHealthPackages} = require("../../../../controllers-clinic/healthPackageController.js")

router.route('/')
  .post(addHealthPackage)
  .put(updateHealthPackage)
  .delete(deleteHealthPackage)
  .get(getHealthPackages)

module.exports = router;