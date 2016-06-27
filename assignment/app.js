module.exports = function(app, db, mongoose, userModel, securityService) {
	var models = require("./models/models.server")(db, mongoose, userModel);
	require("./services/page.service.server.js")(app, models);
	require("./services/user.service.server.js")(app, models, securityService);
	require("./services/website.service.server.js")(app, models);
	require("./services/widget.service.server.js")(app, models);
};
