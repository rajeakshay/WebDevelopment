module.exports = function(app, db, mongoose) {
	var models = require("./models/models.server")(db, mongoose);
	require("./services/project-user.service.server.js")(app, models);
	require("./services/video.service.server.js")(app, models);
};
