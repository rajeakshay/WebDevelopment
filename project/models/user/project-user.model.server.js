module.exports = function(db, mongoose) {
	var ProjectUserSchema = require("./project-user.schema.server.js")(mongoose);
	var ProjectUser = mongoose.model("ProjectUser", ProjectUserSchema);

	return {
		createUser: createUser,
		findUserById: findUserById,
		findUserByEmail: findUserByEmail,
		findUserByCredentials: findUserByCredentials,
		findUserByFacebookId: findUserByFacebookId,
		findUserByGoogleId: findUserByGoogleId,
		findAllUsers: findAllUsers,
		findFollowersForUser: findFollowersForUser,
		findFollowingForUser: findFollowingForUser,
		addFavorite: addFavorite,
		removeFavorite: removeFavorite,
		addFollower: addFollower,
		removeFollower: removeFollower,
		addFollowing: addFollowing,
		removeFollowing: removeFollowing,
		removeUserFromAllFollowing: removeUserFromAllFollowing,
		removeUserFromAllFollowers: removeUserFromAllFollowers,
		updateUser: updateUser,
		deleteUser: deleteUser
	};

	function createUser(user) {
		return ProjectUser.create(user);
	}

	function updateUser(userId, user) {
		delete user._id;
		return ProjectUser
			.update({_id: userId},{
				$set: {
					password: user.password,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					role: user.role
				}
			});
	}

	function deleteUser(userId) {
		return ProjectUser.remove({_id: userId});
	}

	function findUserById(userId) {
		return ProjectUser.findById(userId);
	}

	function findUserByEmail(email) {
		return ProjectUser.findOne({email: email});
	}

	function findUserByCredentials(email, password) {
		return ProjectUser.findOne({email: email, password: password});
	}

	function findUserByFacebookId(facebookId) {
		return ProjectUser.findOne({'facebook.id': facebookId});
	}

	function findUserByGoogleId(googleId) {
		return ProjectUser.findOne({'google.id': googleId});
	}

	function findAllUsers(){
		return ProjectUser.aggregate([
			{
				$project: {
					firstName: 1,
					lastName: 1,
					noOfFollowers: { $size: "$followers" },
					noOfFollowing: { $size: "$following"},
					noOfFavorites: { $size: "$favorites"},
					dateCreated: 1
				}
			}
		]);
	}

	function findFollowersForUser(user) {
		return ProjectUser.aggregate([
			{
				$match: {_id: {$in: user.followers}}
			},
			{
				$project: {
					firstName: 1,
					lastName: 1,
					noOfFollowers: {$size: "$followers"},
					noOfFollowing: {$size: "$following"},
					noOfFavorites: {$size: "$favorites"},
					dateCreated: 1
				}
			}
		]);
	}

	function findFollowingForUser(user) {
		return ProjectUser.aggregate([
			{
				$match: {_id: {$in: user.following}}
			},
			{
				$project: {
					firstName: 1,
					lastName: 1,
					noOfFollowers: {$size: "$followers"},
					noOfFollowing: {$size: "$following"},
					noOfFavorites: {$size: "$favorites"},
					dateCreated: 1
				}
			}
		]);
	}

	function addFavorite(videoId, userId){
		return ProjectUser
			.update({_id: userId}, {
				$push: {favorites: videoId}
			});
	}

	function removeFavorite(videoId, userId){
		return ProjectUser
			.update({_id: userId}, {
				$pull: {favorites: videoId}
			});
	}

	function addFollower(followerId, userId){
		return ProjectUser
			.update({_id: userId}, {
				$push: {followers: followerId}
			});
	}

	function removeFollower(followerId, userId){
		return ProjectUser
			.update({_id: userId}, {
				$pull: {followers: followerId}
			});
	}

	function addFollowing(followingId, userId){
		return ProjectUser
			.update({_id: userId}, {
				$push: {following: followingId}
			});
	}

	function removeFollowing(followingId, userId){
		return ProjectUser
			.update({_id: userId}, {
				$pull: {following: followingId}
			});
	}

	function removeUserFromAllFollowing(user){
		return ProjectUser
			.update(
				{_id: {$in: user.following}},
				{$pull: {followers: user._id}},
				{ multi: true });
	}

	function removeUserFromAllFollowers(user){
		return ProjectUser
			.update(
				{_id: {$in: user.followers}},
				{$pull: {following: user._id}},
				{ multi: true });
	}
};

