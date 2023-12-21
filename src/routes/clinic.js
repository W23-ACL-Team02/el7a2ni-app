var express = require('express');
var router = express.Router({mergeParams: true});

const publicRouter = require('./clinic/public') 
const privateRouter = require('./clinic/private') 

router.use('/public', publicRouter);
router.use('/private', privateRouter);

module.exports = router;
