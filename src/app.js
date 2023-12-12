var express = require('express');
require("dotenv").config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

var publicRouter = require('./routes/public');
var privateRouter = require('./routes/private');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(cors({origin: "http://localhost:3000", credentials: true}));

// Routes
app.use('/public', publicRouter);
app.use('/private', privateRouter);

/**
 * MongoDB connection and port listening were extracted to ('./server.js')
 * Please use run script (npm run start)
 */

module.exports = app;