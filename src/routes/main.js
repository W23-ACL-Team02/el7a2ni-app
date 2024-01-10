var express = require('express');
var router = express.Router({mergeParams: true});

const publicRouter = require('./main/public') 
const privateRouter = require('./main/private') 

router.use('/public', publicRouter);
router.use('/private', privateRouter);

module.exports = router;