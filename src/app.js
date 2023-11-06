var express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const MongoURI = process.env.MONGO_URI;

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var familyMemberRouter = require('./routes/familymember');
var doctorRouter = require('./routes/doctors');
var prescriptionRouter= require('./routes/prescription');
var doctorController = require("./routes/doctorController");

var app = express();

// Set port
var port = process.env.PORT || '3000';
app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(session({
  secret: 'el7a2ni',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }
}))

// Routes
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/familymember', familyMemberRouter);
app.use('/doctors', doctorRouter);
app.use('/prescription',prescriptionRouter);
app.use('/patients', doctorController)

// Mongo DB
mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));

module.exports = app;