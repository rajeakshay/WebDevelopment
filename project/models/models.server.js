module.exports = function() {
	var mongoose = require('mongoose');

	// For local development
	var connectionString = 'mongodb://127.0.0.1:27017/cs5610summer1';

	// Openshift environment variable MONGODB_URL is set by the custom cartridge for
	// latest version of MongoDB (3.2.6).
	// See: https://github.com/icflorescu/openshift-cartridge-mongodb
	if(process.env.MONGODB_URL) {
		connectionString =  process.env.MONGODB_URL + process.env.OPENSHIFT_APP_NAME;
	}
	mongoose.connect(connectionString);

	return {
		projectUserModel: require("./user/project-user.model.server.js")(),
		videoModel: require("./video/video.model.server.js")()
	};
};

