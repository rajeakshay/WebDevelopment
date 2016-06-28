module.exports = function(app) {
	var models = require("./models/models.server")();
	require("./services/project-user.service.server.js")(app, models);
	require("./services/video.service.server.js")(app, models);
};
