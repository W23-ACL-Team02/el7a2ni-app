var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET login page */
router.get('/login', (req, res) => {
  res.render('login');
})

/* GET register page */
router.get('/register', (req, res) => {
  res.render('register');
})

/* GET admin page */
router.get('/admin', (req, res) => {
  res.render('admin');
})






module.exports = router;
