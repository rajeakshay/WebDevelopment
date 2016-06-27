module.exports = function(db, mongoose) {
	return {
		userModel: require("./user/user.model.server.js")(db, mongoose),
		websiteModel: require("./website/website.model.server.js")(db, mongoose),
		pageModel: require("./page/page.model.server.js")(db, mongoose),
		widgetModel: require("./widget/widget.model.server.js")(db, mongoose)
	};
};
