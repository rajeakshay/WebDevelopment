module.exports = function(mongoose) {
	var ProjectUserSchema = mongoose.Schema({
		email: {type: String, required: true},
		password: String,
		firstName: String,
		lastName: String,
		facebook: {
			token: String,
			id: String
		},
		google: {
			token: String,
			id: String
		},
		followers: {type: Array, default: []},
		following: {type: Array, default: []},
		favorites: {type: Array, default: []},
		role: {type: String, default: "regular"},
		application: {type: String, default: "iTube"},
		dateCreated: {type: Date, default: Date.now}
	}, {collection: "project.user"});

	return ProjectUserSchema;
};
