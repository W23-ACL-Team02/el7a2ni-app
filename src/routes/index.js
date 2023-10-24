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

/* GET admin/Viewing Patient page */
router.get('/selectpatient', (req, res) => {
  res.render('selectpatient');
})

/* GET admin/Viewing Pharmacist page */
router.get('/selectpharmacist', (req, res) => {
  res.render('selectpharmacist');
})






module.exports = router;
