var express = require('express');
const { getSelf } = require('../../../controllers-pharmacy/userController');
const { getNotifications } = require('../../../controllers-main/userController');
var router = express.Router({mergeParams: true});

router.get('/', getSelf);
router.get('/notifications', getNotifications);

module.exports = router;