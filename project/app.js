module.exports = function(app, db, mongoose, projectUserModel, securityService) {
	var models = require("./models/models.server")(db, mongoose, projectUserModel);
	require("./services/project-user.service.server.js")(app, models, securityService);
	require("./services/video.service.server.js")(app, models);
};
