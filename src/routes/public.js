var express = require('express');
<<<<<<< HEAD
var router = express.Router();
=======
var router = express.Router({mergeParams: true});
>>>>>>> 4e1ec30cba0a29053bccdb5d3c5b9d0ef9fb461b

const publicUserRouter = require(`./public/user`);

router.use('/user', publicUserRouter);

module.exports = router;
