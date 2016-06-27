module.exports = function(db, mongoose, userModel) {
	return {
		userModel: userModel,
		websiteModel: require("./website/website.model.server.js")(db, mongoose),
		pageModel: require("./page/page.model.server.js")(db, mongoose),
		widgetModel: require("./widget/widget.model.server.js")(db, mongoose)
	};
};
