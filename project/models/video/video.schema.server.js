module.exports = function() {
	var mongoose = require("mongoose");
	var VideoSchema = mongoose.Schema({
		videoId: String,
		title: String,
		author: String,
		description: String,
		favBy: {type: Array, default: []},
		lastFavoriteAt: {type: Date, default: Date.now}
	}, {collection: "project.video"});

	return VideoSchema;
};
