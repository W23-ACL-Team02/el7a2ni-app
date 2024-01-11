var express = require('express');
require("dotenv").config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var pharmacyRouter = require('./routes/pharmacy');
var clinicRouter = require('./routes/clinic');
var mainRouter = require('./routes/main');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(cors({origin: "http://localhost:4000", credentials: true})); //Take cross origin cookies from port 4000

// Routes
app.use('/pharmacy', pharmacyRouter);
app.use('/clinic', clinicRouter);
app.use('/main', mainRouter);

/**
 * MongoDB connection and port listening were extracted to ('./server.js')
 * Please use run script (npm run start)
 */

module.exports = app;