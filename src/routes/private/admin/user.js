var express = require('express');
var router = express.Router();
const { removeUser, addAdmin } = require('../../../controllers/userController');

router.post('/removeUser', removeUser);
router.post('/addAdmin', addAdmin);

module.exports = router;