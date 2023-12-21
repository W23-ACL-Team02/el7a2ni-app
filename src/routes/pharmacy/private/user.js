var express = require('express');
const { getSelf, logout, changePassword, getUserInSession, getUsers } = require('../../../controllers-pharmacy/userController.js');
var router = express.Router();

router.get('/', getUsers)

// TODO: (CLEANUP) Duplicate Endpoints?
router.get('/getSelfUser', getSelf);
router.get('/getCurrUser', getUserInSession);

router.get('/logout', logout);
router.post('/changePassword', changePassword);


module.exports = router;