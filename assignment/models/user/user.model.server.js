module.exports = function() {
	var mongoose = require("mongoose");
	var UserSchema = require("./user.schema.server.js")();
	var User = mongoose.model("User", UserSchema);

	return {
		createUser: createUser,
		findUserById: findUserById,
		findUserByCredentials: findUserByCredentials,
		findUserByUsername: findUserByUsername,
		findUserByFacebookId: findUserByFacebookId,
		updateUser: updateUser,
		deleteUser: deleteUser
	};

	function updateUser(userId, user) {
		delete user._id;
		return User
			.update({_id: userId},{
				$set: {
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email
				}
			});
	}

	function deleteUser(userId) {
		return User.remove({_id: userId});
	}

	function findUserByUsername(username) {
		return User.findOne({username: username});
	}

	function findUserByCredentials(username, password) {
		return User.findOne({username: username, password: password});
	}

	function findUserById(userId) {
		return User.findById(userId);
	}

	function findUserByFacebookId(facebookId) {
		return User.findOne({'facebook.id': facebookId});
	}

	function createUser(user) {
		return User.create(user);
	}
};
