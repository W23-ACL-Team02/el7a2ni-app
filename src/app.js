var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

const MongoURI = process.env.MONGO_URI;

// Import routers
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var app = express();

// Set port
var port = process.env.PORT || '3000';
app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'el7a2ni',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

// Define Routes
app.use('/', indexRouter);
app.use('/user', userRouter);

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
