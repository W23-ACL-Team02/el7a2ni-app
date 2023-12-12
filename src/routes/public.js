var express = require('express');
var router = express.Router({mergeParams: true});

const publicUserRouter = require(`./public/user`);

router.use('/user', publicUserRouter);

module.exports = router;
