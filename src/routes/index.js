var express = require('express');
var router = express.Router();

router.get('/login', (req, res) => {
  if (req.session.loggedin) {
    return res.redirect('home')
  }
  res.render('login');
})

router.get('/register', (req, res) => {
  if (req.session.loggedin) {
    return res.redirect('home')
  }
  const registerType = req.query.type ?? "patient";
  res.status(200).render('register', {registerType});
})

router.get('*', function(req, res, next) {
  // If not logged in, go to login page
  if (!req.session.loggedin) {
    return res.redirect('/login')
  }
  
  next();
});

router.get('/', (req, res) => {
  res.redirect('/home');
})

router.get('/home', (req, res) => {
  // Go to home page
  res.render('home', {userType: req.session.userType ?? "patient"})
})


/* GET admin page */
router.get('/admin', (req, res) => {
  res.render('admin');
})

module.exports = router;




//////

