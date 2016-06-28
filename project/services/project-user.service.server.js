module.exports = function(app, models) {
	var passport = require('passport');
	var bcrypt = require("bcrypt-nodejs");
	var LocalStrategy = require('passport-local').Strategy;
	var FacebookStrategy = require('passport-facebook').Strategy;
	var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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
	
	passport.use(new LocalStrategy(projectStrategy));
	passport.use(new FacebookStrategy(project_fbConfig, project_fbLogin));
	passport.use(new GoogleStrategy(project_gConfig, project_gLogin));
	passport.serializeUser(serializeUser);
	passport.deserializeUser(deserializeUser);

	var projectUserModel = models.projectUserModel;
	var videoModel = models.videoModel;

	app.post("/api/user", createUser);
	app.get("/api/user", getAllUsers);
	app.get("/api/user/:userId/feed", getUserFeed);
	app.get("/api/user/:userId/favorites", getFavoritesForUser);
	app.get("/api/user/:userId/followers", getFollowersForUser);
	app.get("/api/user/:userId/following", getFollowingForUser);
	app.get("/api/user/:userId", getUserById);
	app.put("/api/user/:userId", updateUser);
	app.put("/api/user/:userId/favorites", addToFavorite);
	app.put("/api/user/:userId/followers", addToFollowers);
	app.put("/api/user/:userId/following", addToFollowing);
	app.delete("/api/user/:userId", deleteUser);
	app.delete("/api/user/:userId/favorites", removeFromFavorites);
	app.delete("/api/user/:userId/followers", removeFromFollowers);
	app.delete("/api/user/:userId/following", removeFromFollowing);

	app.get('/auth/project/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
	app.get('/auth/project/google/callback',
		passport.authenticate('google', {
			successRedirect: '/project/#/profile',
			failureRedirect: '/project/#/signin'
		}));

	app.get('/auth/project/facebook', passport.authenticate('facebook', { scope : 'email' }));
	app.get('/auth/project/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect: '/project/#/profile',
			failureRedirect: '/project/#/signin'
		}));

	app.get("/api/loggedIn", loggedIn);
	app.post("/api/register", signup);
	app.post("/api/logout", signout);
	app.post("/api/login", passport.authenticate('local'), signin);

	function serializeUser(user, cb) {
		cb(null, user);
	}

	function deserializeUser(user, cb) {
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

	function projectStrategy(email, password, cb) {
		projectUserModel
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

	function project_fbLogin(token, refreshToken, profile, cb) {
		// console.log("===========================================");
		// console.log(profile);
		// console.log("===========================================");
		projectUserModel
			.findUserByEmail(profile.emails[0].value)
			.then(
				function(facebookUser) {
					if(facebookUser) {
						return cb(null, facebookUser);
					} else {
						facebookUser = {
							email: profile.emails[0].value,
							firstName: profile.name.givenName,
							lastName: profile.name.familyName,
							facebook: {
								token: token,
								id: profile.id
							}
						};
						projectUserModel
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
						projectUserModel
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

	function loggedIn(req, res) {
		if(req.isAuthenticated()){
			res.json(req.user);
		} else {
			res.send(false);
		}
	}

	function signin(req, res){
		var user = req.user;
		res.json(user);
	}

	function signout(req, res) {
		req.logout();
		res.sendStatus(200);
	}

	function signup(req, res){
		var email = req.body.email;
		var password = req.body.password;
		var firstName = req.body.firstName;
		var lastName = req.body.lastName;

		projectUserModel
			.findUserByEmail(email)
			.then(
				function (user){
					if(user){
						res.status(400).send("User already exist");
					}
					else {
						password = bcrypt.hashSync(req.body.password);
						return projectUserModel
							.createUser({
								email: email,
								password: password,
								firstName: firstName,
								lastName: lastName
							});
					}
				},
				function (err){
					res.status(400).send(err);
				}
			).then(
			function (user){
				if (user) {
					req.login(user, function (err) {
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
		projectUserModel
			.findUserByEmail(user.email)
			.then(function (stats) {
				if(stats.length !== 0){
					res.status(400).send("User with that email already exists.");
				}
				else {
					projectUserModel
						.createUser(user)
						.then(
							function (user) {
								res.json(user);
							},
							function (error) {
								res.status(400).send("Unable to create user.");
							});
				}
			});
	}

	function getAllUsers(req, res){
		projectUserModel
			.findAllUsers()
			.then(
				function(response){
					res.json(response);
				},
				function(err){
					res.status(404).send("Unable to find any users.");
				}
			);
	}

	function getUserFeed(req, res){
		var uId = req.params.userId;
		projectUserModel
			.findUserById(uId)
			.then(
				function(user){
					videoModel
						.getUserFeed(user)
						.then(
							function(feed){
								res.json(feed);
							},
							function(err){
								res.status(400).send("Did not find anything for this user.");
							}
						);
				},
				function(err){
					res.status(404).send("User not found.");
				}
			);
	}

	function getFavoritesForUser(req, res){
		var uId = req.params.userId;
		projectUserModel
			.findUserById(uId)
			.then(
				function(user){
					videoModel
						.getFavoritesForUser(user)
						.then(
							function(favorites){
								res.json(favorites);
							},
							function(err){
								res.status(404).send("Could not find favorites for user.");
							}
						);
				},
				function(err){
					res.status(404).send("Could not find user.");
				}
			);
	}

	function getFollowersForUser(req, res){
		var uId = req.params.userId;
		projectUserModel
			.findUserById(uId)
			.then(
				function(user){
					projectUserModel
						.findFollowersForUser(user)
						.then(
							function(followers){
								res.json(followers);
							},
							function(err){
								res.status(404).send("Could not find followers for user.");
							}
						);
				},
				function(err){
					res.status(404).send("Could not find user.");
				}
			);
	}

	function getFollowingForUser(req, res){
		var uId = req.params.userId;
		projectUserModel
			.findUserById(uId)
			.then(
				function(user){
					projectUserModel
						.findFollowingForUser(user)
						.then(
							function(following){
								res.json(following);
							},
							function(err){
								res.status(404).send("Could not find following for user.");
							}
						);
				},
				function(err){
					res.status(404).send("Could not find user.");
				}
			);
	}

	function getUserById(req, res){
		var uId = req.params.userId;
		projectUserModel
			.findUserById(uId)
			.then(
				function(user){
					res.json(user);
				},
				function(err){
					res.status(404).send("Could not find user.");
				}
			);
	}

	function updateUser(req, res){
		var uId = req.params.userId;
		var newUser = req.body;
		projectUserModel
			.updateUser(uId, newUser)
			.then(
				function(success){
					res.status(200).send("User updated successfully.");
				},
				function(err){
					res.status(400).send("Problem in updating user.");
				}
			);
	}

	function deleteUser(req, res){
		var uId = req.params.userId;
		projectUserModel
			.findUserById(uId)
			.then(
				function(user){
					videoModel
						.removeAllFavoritesBy(user)
						.then(
							function(success){
								projectUserModel
									.removeUserFromAllFollowing(user)
									.then(
										function(success){
											projectUserModel
												.removeUserFromAllFollowers(user)
												.then(
													function(success){
														projectUserModel
															.deleteUser(uId)
															.then(
																function(success){
																	res.status(200).send("Deleted user.");
																},
																function(err){
																	res.status(400).send("Could not delete user.");
																}
															);
													},
													function(err){
														res.status(400).send("Could not remove user from Followers objects.");
													}
												);
										},
										function(err){
											res.status(400).send("Could not remove user from Following objects.");
										}
									);
							},
							function(err){
								res.status(400).send("Could not erase favorites for user.");
							}
						);
				},
				function(err){
					res.status(404).send("Could not find user");
				}
			);
	}
	
	function addToFavorite(req, res){
		var uId = req.params.userId;
		var vId = req.body._id;
		projectUserModel
			.findUserById(uId)
			.then(
				function(user){
					videoModel
						.findVideoById(vId)
						.then(
							function(video){
								projectUserModel
									.addFavorite(video._id, user._id)
									.then(
										function(success){
											videoModel
												.addFavoriteBy(video._id, user._id)
												.then(
													function(success){
														res.status(200).send("User favorite registered.");
													},
													function(err){
														res.status(400).send("Could not add user to videos favoriteBy list.");
													}
												);
										},
										function(err){
											res.status(400).send("Could not add to favorites.");
										}
									);
							},
							function(err){
								res.status(404).send("Could not find video.");
							}
						);
				},
				function(err){
					res.status(404).send("Could not find user.");
				}
			);
	}

	function removeFromFavorites(req, res){
		var uId = req.params.userId;
		var vId = req.query.videoId;
		projectUserModel
			.findUserById(uId)
			.then(
				function(user){
					videoModel
						.findVideoById(vId)
						.then(
							function(video){
								projectUserModel
									.removeFavorite(video._id, user._id)
									.then(
										function(success){
											videoModel
												.removeFavoriteBy(video._id, user._id)
												.then(
													function(success){
														res.status(200).send("User favorite removed.");
													},
													function(err){
														res.status(400).send("Could not remove user from videos favoriteBy list.");
													}
												);
										},
										function(err){
											res.status(400).send("Could not remove from favorites.");
										}
									);
							},
							function(err){
								res.status(404).send("Could not find video.");
							}
						);
				},
				function(err){
					res.status(404).send("Could not find user.");
				}
			);
	}
	
	function addToFollowers(req, res){
		var uId = req.params.userId;
		var fId = req.body._id;
		projectUserModel
			.addFollower(fId, uId)
			.then(
				function(success){
					projectUserModel
						.addFollowing(uId, fId)
						.then(
							function(success){
								res.status(200).send("Finished adding follower for user.");
							},
							function(err){
								res.status(400).send("Could not add user to following list.");
							}
						);
				},
				function(err){
					res.status(400).send("Could not add follower for user.");
				}
			);
	}

	function removeFromFollowers(req, res){
		var uId = req.params.userId;
		var fId = req.query.followerId;
		projectUserModel
			.removeFollower(fId, uId)
			.then(
				function(success){
					projectUserModel
						.removeFollowing(uId, fId)
						.then(
							function(success){
								res.status(200).send("Finished removing follower for user.");
							},
							function(err){
								res.status(400).send("Could not remove user from following list.");
							}
						);
				},
				function(err){
					res.status(400).send("Could not remove follower for user.");
				}
			);
	}

	function addToFollowing(req, res){
		var uId = req.params.userId;
		var fId = req.body._id;
		projectUserModel
			.addFollowing(fId, uId)
			.then(
				function(success){
					projectUserModel
						.addFollower(uId, fId)
						.then(
							function(success){
								res.status(200).send("Finished adding following for user.");
							},
							function(err){
								res.status(400).send("Could not add user to follower list.");
							}
						);
				},
				function(err){
					res.status(400).send("Could not add to following list for user.");
				}
			);
	}

	function removeFromFollowing(req, res){
		var uId = req.params.userId;
		var fId = req.query.followingId;
		projectUserModel
			.removeFollowing(fId, uId)
			.then(
				function(success){
					projectUserModel
						.removeFollower(uId, fId)
						.then(
							function(success){
								res.status(200).send("Finished removing following for user.");
							},
							function(err){
								res.status(400).send("Could not remove user from follower list.");
							}
						);
				},
				function(err){
					res.status(400).send("Could not remove from following list for user.");
				}
			);
	}
};
