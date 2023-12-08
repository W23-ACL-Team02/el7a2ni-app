var express= require('express');
const { getFamilyIDs } = require('../../controllers/familyController');
var router = express.Router({mergeParams: true}); 

router.get(`/`, getFamilyIDs)

module.exports = router;