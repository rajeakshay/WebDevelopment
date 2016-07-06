module.exports = function() {
	var mongoose = require("mongoose");
	var UserSchema = mongoose.Schema({
		username: {type: String, required: true},
		password: String,
		firstName: String,
		lastName: String,
		facebook: {
			token: String,
			id: String
		},
		email: String,
		websites: {type: Array, default: []},
		application: {type: String, default: "assignment"},
		dateCreated: {type: Date, default: Date.now}
	}, {collection: "assignment.user"});

	return UserSchema;
};
