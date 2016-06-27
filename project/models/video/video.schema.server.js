module.exports = function(mongoose) {
	var VideoSchema = mongoose.Schema({
		videoId: {type: String, required: true},
		title: String,
		author: String,
		description: String,
		favBy: {type: Array, default: []},
		lastFavoriteAt: {type: Date, default: Date.now}
	}, {collection: "project.video"});

	return VideoSchema;
};
