module.exports = function(app, models) {
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
						.findVideoByIdProjection(vId)
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
						.findVideoByIdProjection(vId)
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
