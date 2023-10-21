var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Virtual Clinic' });
});

router.post('/register/doctor', (req, res) => {

    res.send('Registered doctor');
});

router.post('/register/doctor', (req, res) => {

    res.send('Registered doctor');
});

module.exports = router;
