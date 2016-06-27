module.exports = function(db, mongoose){
	var WidgetSchema = require("./widget.schema.server.js")(mongoose);
	var Widget = mongoose.model("Widget", WidgetSchema);

	return {
		createWidget: createWidget,
		findAllWidgetsForPage: findAllWidgetsForPage,
		findWidgetById: findWidgetById,
		updateWidget: updateWidget,
		deleteWidget: deleteWidget,
		reorderWidgets: reorderWidgets,
		findHighestOrder: findHighestOrder
	};

	function createWidget(pageId, widget){
		widget.pageId = pageId;
		return Widget.create(widget);
	}

	function findHighestOrder(pageId){
		return Widget
			.find({pageId: pageId})
			.sort({order : -1})
			.findOne().exec();
	}

	function findAllWidgetsForPage(pageId){
		return Widget.find({pageId: pageId});
	}

	function findWidgetById(widgetId){
		return Widget.findById({_id: widgetId});
	}

	function updateWidget(widgetId, widget){
		delete widget._id;
		return Widget
			.update({_id: widgetId}, {
				$set: widget
			});
	}

	function deleteWidget(widgetId){
		return Widget.remove({_id: widgetId});
	}

	function reorderWidgets(pageId, start, end){
		start = parseInt(start);
		end = parseInt(end);

		return Widget
			.find({pageId: pageId})
			.sort({order: 1})
			.then(function (widgets){
				var oldOrder = -1;
				if(start < end) {
					for (var idx = 0; idx < widgets.length; idx++) {
						if (idx == start) {
							oldOrder = widgets[idx].order;
						}
						else if (idx > start && idx <= end) {
							var currentPos = widgets[idx].order;
							widgets[idx].order = oldOrder;
							oldOrder = currentPos;
							if (idx == end) {
								widgets[start].order = oldOrder;
								widgets[start].save();
							}
							widgets[idx].save();
						}
					}
				} else {
					for (var idx = widgets.length-1; idx >= 0; idx--) {
						if (idx == start) {
							oldOrder = widgets[idx].order;
						}
						else if (idx < start && idx >= end) {
							var currentPos = widgets[idx].order;
							widgets[idx].order = oldOrder;
							oldOrder = currentPos;
							if (idx == end) {
								widgets[start].order = oldOrder;
								widgets[start].save();
							}
							widgets[idx].save();
						}
					}
				}
				res.sendStatus(200);
			});
	}
};
