module.exports = function(app) {
	var models = require("./models/models.server")();
	require("./services/page.service.server.js")(app, models);
	require("./services/user.service.server.js")(app, models);
	require("./services/website.service.server.js")(app, models);
	require("./services/widget.service.server.js")(app, models);
};
