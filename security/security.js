var passport = require('passport');
var bcrypt = require("bcrypt-nodejs");
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(userModel, projectUserModel){

	var assignment_fbConfig = {
		clientID     : process.env.FB_A_CLIENT_ID,
		clientSecret : process.env.FB_A_CLIENT_SECRET,
		callbackURL  : process.env.FB_A_CALLBACK_URL,
		profileFields: ['id', 'name', 'email']
	};
	var project_fbConfig = {
		clientID     : process.env.FB_P_CLIENT_ID,
		clientSecret : process.env.FB_P_CLIENT_SECRET,
		callbackURL  : process.env.FB_P_CALLBACK_URL,
		profileFields: ['id', 'name', 'email']
	};
	var project_gConfig = {
		clientID     : process.env.G_P_CLIENT_ID,
		clientSecret : process.env.G_P_CLIENT_SECRET,
		callbackURL  : process.env.G_P_CALLBACK_URL
	};

	passport.use('assignment', new LocalStrategy(assignmentStrategy));
	passport.use('project', new LocalStrategy(projectStrategy));
	passport.use('fb-assignment', new FacebookStrategy(assignment_fbConfig, assignment_fbLogin));
	//passport.use('fb-project', new FacebookStrategy(project_fbConfig, project_fbLogin));
	passport.use('goog-project', new GoogleStrategy(project_gConfig, project_gLogin));
	passport.serializeUser(serializeUser);
	passport.deserializeUser(deserializeUser);

	return {
		getPassport : getPassport
	};

    function getPassport() {
		return passport;
	}

	function serializeUser(user, cb) {
		cb(null, user);
	}

	function deserializeUser(user, cb) {
		if(user.application == "assignment"){
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
		else if(user.application == "iTube"){
			projectUserModel
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
	}

	function projectStrategy(email, password, cb) {
		userModel
			.findUserByEmail(email)
			.then(
				function(user) {
					if(user && user.email === email && bcrypt.compareSync(password, user.password)) {
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

	// function project_fbLogin(token, refreshToken, profile, cb) {
	// 	// console.log("===========================================");
	// 	// console.log(profile);
	// 	// console.log("===========================================");
	// 	projectUserModel
	// 		.findUserByEmail(profile.emails[0].value)
	// 		.then(
	// 			function(facebookUser) {
	// 				if(facebookUser) {
	// 					return cb(null, facebookUser);
	// 				} else {
	// 					facebookUser = {
	// 						email: profile.emails[0].value,
	// 						firstName: profile.name.givenName,
	// 						lastName: profile.name.familyName,
	// 						facebook: {
	// 							token: token,
	// 							id: profile.id
	// 						}
	// 					};
	// 					userModel
	// 						.createUser(facebookUser)
	// 						.then(
	// 							function(user) {
	// 								cb(null, user);
	// 							}
	// 						);
	// 				}
	// 			}
	// 		);
	// }

	function project_gLogin(token, refreshToken, profile, cb){
		// console.log("===========================================");
		// console.log(profile);
		// console.log("===========================================");
		projectUserModel
			.findUserByEmail(profile.emails[0].value)
			.then(
				function(googleUser) {
					if(googleUser) {
						return cb(null, googleUser);
					} else {
						googleUser = {
							email: profile.emails[0].value,
							firstName: profile.name.givenName,
							lastName: profile.name.familyName,
							google: {
								token: token,
								id: profile.id
							}
						};
						userModel
							.createUser(googleUser)
							.then(
								function(user) {
									cb(null, user);
								}
							);
					}
				}
			);
	}
};
