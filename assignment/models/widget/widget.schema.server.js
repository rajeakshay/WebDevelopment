module.exports = function(){
	var mongoose = require("mongoose");

	var WidgetSchema = mongoose.Schema({
		pageId: {type: mongoose.Schema.ObjectId, ref: "Page"},
		widgetType: String,
		name: String,
		text: String,
		placeholder: String,
		description: String,
		url: String,
		width: String,
		height: String,
		rows: Number,
		size: Number,
		class: String,
		icon: String,
		deleteable: Boolean,
		formatted: Boolean,
		order: Number,
		dateCreated: {type: Date, default: Date.now}
	}, {collection: "assignment.widget" });

	return WidgetSchema;
};
