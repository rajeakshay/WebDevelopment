module.exports = function(db, mongoose, projectUserModel) {
	return {
		projectUserModel: projectUserModel,
		videoModel: require("./video/video.model.server.js")(db, mongoose)
	};
};

