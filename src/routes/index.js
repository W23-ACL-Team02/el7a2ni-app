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

router.get('/logout', (req, res) => {
  let userType = req.session.userType;
  req.session.destroy();

  res.status(200).send(`Successfully logged out of ${userType} account.`);
})

router.get('/', (req, res) => {
  res.redirect('/home');
})

router.get('/home', (req, res) => {
  // Go to home page
  res.render('home', {userType: req.session.userType ?? "patient"})
})

/* GET admin page */
router.get('/admin', (req, res) => {
  if(req.session.userType=="admin"){
    res.render('admin');
  }
  else{
    res.status(400).send("Unauthorized Access")
  }
})

/* GET addAdmin page */
router.get('/addAdmin', (req, res) => {
  res.render('addAdmin');
})

/* GET removeUser page */
router.get('/removeUser', (req, res) => {
  res.render('removeUser');
})



module.exports = router;