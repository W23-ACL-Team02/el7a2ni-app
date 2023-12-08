var express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var publicRouter = require('./routes/public');
var privateRouter = require('./routes/private');
const MongoURI = process.env.MONGO_URI;

var app = express();

// Set port
var port = process.env.PORT || '3000';
app.set('port', port);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(cors({origin: "http://localhost:4000", credentials: true}));

// Routes
app.use('/public', publicRouter);
app.use('/private', privateRouter);

/**
 * MongoDB connection and port listening were extracted to ('./server.js')
 * Please use run script (npm run start)
 */

module.exports = app;