var express = require('express');
var router = express.Router({mergeParams: true});

const publicRouter = require('./pharmacy/public') 
const privateRouter = require('./pharmacy/private') 

router.use('/public', publicRouter);
router.use('/private', privateRouter);

module.exports = router;
