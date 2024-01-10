"use strict";

var createError = require('http-errors');

var express = require('express');

var mongoose = require('mongoose');

mongoose.set('strictQuery', false);

require("dotenv").config();

var path = require('path');

var cookieParser = require('cookie-parser');

var logger = require('morgan');

var MongoURI = process.env.MONGO_URI;

var indexRouter = require('./routes/index');

var userRouter = require('./routes/user');

var medicineRouter = require('./routes/medicineController');

var app = express(); // Set port

var port = process.env.PORT || '3000';
app.set('port', port); // view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express["static"](path.join(__dirname, 'public'))); // Routes

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/medicine', medicineRouter); // Mongo DB

mongoose.connect(MongoURI).then(function () {
  console.log("MongoDB is now connected!"); // Starting server

  app.listen(port, function () {
    console.log("Listening to requests on http://localhost:".concat(port));
  });
})["catch"](function (err) {
  return console.log(err);
});
module.exports = app;