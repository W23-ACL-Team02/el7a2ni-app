var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Virtual Clinic' });
});

router.get('/register', (req, res) => {
  res.status(200).render('register');
})

module.exports = router;
