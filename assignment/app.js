module.exports = function(app, db, mongoose) {
	var models = require("./models/models.server")(db, mongoose);
	require("./services/page.service.server.js")(app, models);
	require("./services/user.service.server.js")(app, models);
	require("./services/website.service.server.js")(app, models);
	require("./services/widget.service.server.js")(app, models);
};
