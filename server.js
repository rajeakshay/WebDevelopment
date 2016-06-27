var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport = require('passport');

// For local development
var connectionString = 'mongodb://127.0.0.1:27017/cs5610summer1';

// Openshift environment variable MONGODB_URL is set by the custom cartridge for
// latest version of MongoDB (3.2.6).
// See: https://github.com/icflorescu/openshift-cartridge-mongodb
if(process.env.MONGODB_URL) {
	connectionString =  process.env.MONGODB_URL + process.env.OPENSHIFT_APP_NAME;
}

var mongoose = require('mongoose');
var db = mongoose.connect(connectionString);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

//require ("./test/app.js")(app);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

require("./assignment/app.js")(app, db, mongoose);
require("./project/app.js")(app, db, mongoose);

app.listen(port, ipaddress);