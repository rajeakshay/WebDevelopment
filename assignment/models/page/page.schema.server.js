module.exports = function(mongoose){
	var PageSchema = mongoose.Schema({
		websiteId: {type: mongoose.Schema.ObjectId, ref: "Website"},
		name: String,
		title: String,
		description: String,
		widgets: {type: Array, "default": []},
		dateCreated: {type: Date, default: Date.now}
	}, {collection: "assignment.page" });

	return PageSchema;
}
