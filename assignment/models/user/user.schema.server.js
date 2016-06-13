module.exports = function() {
	var mongoose = require("mongoose");

	var UserSchema = mongoose.Schema({
		username: {type: String, required: true},
		password: String,
		firstName: String,
		lastName: String,
		dob: Date,
		email: String,
		phone: String,
		websites: {type: Array, default: []},
		dateCreated: {type: Date, default: Date.now}
	}, {collection: "assignment.user"});

	return UserSchema;
};
