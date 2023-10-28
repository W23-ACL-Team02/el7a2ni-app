var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Virtual Clinic' });
});

router.get('/register', (req, res) => {
  const registerType = req.query.type ?? "patient";
  res.status(200).render('register', {registerType});
})

module.exports = router;
