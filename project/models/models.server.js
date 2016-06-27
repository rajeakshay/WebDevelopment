module.exports = function(db, mongoose) {
	return {
		projectUserModel: require("./user/project-user.model.server.js")(db, mongoose),
		videoModel: require("./video/video.model.server.js")(db, mongoose)
	};
};

