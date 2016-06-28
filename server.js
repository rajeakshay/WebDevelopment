var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport = require('passport');

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

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

//var userModel = require("./assignment/models/user/user.model.server.js")(db, mongoose);
//var projectUserModel = require("./project/models/user/project-user.model.server.js")(db, mongoose);
//var securityService = require("./security/security.js")(userModel, projectUserModel);

//require ("./test/app.js")(app);
//require("./assignment/app.js")(app, db, mongoose, userModel, securityService);
require("./project/app.js")(app);

app.listen(port, ipaddress);