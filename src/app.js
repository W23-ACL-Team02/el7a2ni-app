var express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const MongoURI = process.env.MONGO_URI;

var publicRouter = require('./routes/public');
var privateRouter = require('./routes/private');

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

// Routes
app.use('/public', publicRouter);
app.use('/private', privateRouter);

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