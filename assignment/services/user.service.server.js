module.exports = function(app, models) {
	var passport = require('passport');
	var bcrypt = require("bcrypt-nodejs");
	var LocalStrategy = require('passport-local').Strategy;
	var FacebookStrategy = require('passport-facebook').Strategy;

	var assignment_fbConfig = {
		clientID     : process.env.FB_A_CLIENT_ID,
		clientSecret : process.env.FB_A_CLIENT_SECRET,
		callbackURL  : process.env.FB_A_CALLBACK_URL,
		profileFields: ['id', 'name', 'email']
	};

	passport.use(new LocalStrategy(assignmentStrategy));
	passport.use(new FacebookStrategy(assignment_fbConfig, assignment_fbLogin));
	passport.serializeUser(serializeUser);
	passport.deserializeUser(deserializeUser);

	var userModel = models.userModel;

	app.post("/api/user", createUser);
	app.get("/api/user/:userId", findUserById);
	app.put("/api/user/:userId", updateUser);
	app.delete("/api/user/:userId", deleteUser);

	app.get('/auth/assignment/facebook', passport.authenticate('facebook', { scope : 'email' }));
	app.get('/auth/assignment/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect: '/assignment/#/user',
			failureRedirect: '/assignment/#/login'
		}));

	app.get("/api/loggedIn", loggedIn);
	app.post("/api/register", register);
	app.post("/api/logout", logout);
	app.post("/api/login", passport.authenticate('local'), login);

	function serializeUser(user, cb) {
		cb(null, user);
	}

	function deserializeUser(user, cb) {
		userModel
			.findUserById(user._id)
			.then(
				function(user){
					delete user.password;
					cb(null, user);
				},
				function(err){
					cb(err, null);
				}
			);
	}

	function assignmentStrategy(username, password, cb) {
		userModel
			.findUserByUsername(username)
			.then(
				function(user) {
					if(user && user.username === username && bcrypt.compareSync(password, user.password)) {
						return cb(null, user);
					} else {
						return cb(null, false);
					}
				},
				function(err) {
					if (err) { return cb(err); }
				}
			);
	}

	function assignment_fbLogin(token, refreshToken, profile, cb) {
		// console.log("===========================================");
		// console.log(profile);
		// console.log("===========================================");
		userModel
			.findUserByFacebookId(profile.id)
			.then(
				function(facebookUser) {
					if(facebookUser) {
						return cb(null, facebookUser);
					} else {
						facebookUser = {
							username: profile.name.givenName.concat(profile.name.familyName).toLowerCase(),
							firstName: profile.name.givenName,
							lastName: profile.name.familyName,
							email: profile.emails[0].value,
							facebook: {
								token: token,
								id: profile.id
							}
						};
						userModel
							.createUser(facebookUser)
							.then(
								function(user) {
									cb(null, user);
								}
							);
					}
				}
			);
	}

	function loggedIn(req, res) {
		if(req.isAuthenticated()){
			res.json(req.user);
		} else {
			res.send(false);
		}
	}

	function login(req, res){
		var user = req.user;
		res.json(user);
	}

	function logout(req, res) {
		req.logout();
		res.sendStatus(200);
	}

	function register(req, res){
		var username = req.body.username;
		var password = req.body.password;

		userModel
			.findUserByUsername(username)
			.then(
				function (user){
					if(user){
						res.status(400).send("Username already exist");
					}
					else {
						password = bcrypt.hashSync(req.body.password);
						return userModel
							.createUser({username: username, password: password});
					}
				},
				function (err){
					res.status(400).send(err);
				}
			).then(
			function (user){
				if (user) {
					req.login(user,  function (err) {
						if(err){
							res.status(400).send(err);
						} else {
							res.json(user);
						}
					});
				}
			}
		);
	}

	function createUser(req, res){
		var user = req.body;
		userModel
			.findUserByUsername(user.username)
			.then(function (stats) {
				if(stats.length !== 0){
					res.status(400).send("Username already exist");
				}
				else {
					userModel
						.createUser(user)
						.then(
							function (user) {
								res.json(user);
							},
							function (error) {
								res.statusCode(400).send("Not able to create user");
							});
				}
			});
	}

	function findUserByUsername(username, res) {
		userModel.findUserByUsername(username)
			.then(function (user){
				res.json(user);
			}, function (error){
				res.sendStatus(404);
			});
	}

	function findUserByCredentials(username, password, res) {
		userModel.findUserByCredentials(username, password)
			.then(function (user){
				res.json(user);
			}, function (err){
				res.sendStatus(404);
			});
	}

	function findUserById(req, res) {
		var id = req.params.userId;
		userModel
			.findUserById(id)
			.then(function (user){
				res.send(user);
			}, function (error){
				res.sendStatus(404);
			});
	}

	function updateUser(req, res) {
		var id = req.params.userId;
		var newUser = req.body;
		userModel
			.updateUser(id, newUser)
			.then(function(stats){
				res.sendStatus(200);
			}, function(error) {
				res.sendStatus(404);
			});
	}

	function deleteUser(req, res) {
		var id = req.params.userId;
		userModel
			.deleteUser(id)
			.then(function (stats){
				res.sendStatus(200);
			}, function (error){
				res.sendStatus(404);
			});
	}
};