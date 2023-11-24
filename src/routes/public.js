var express = require('express');
var router = express.Router();

const publicUserRouter = require(`./public/user`);

router.use('/user', publicUserRouter);

module.exports = router;
