(function () {
	angular
		.module("WebAppMaker")
		.factory("WidgetService", WidgetService);

	// Widget ID counter which should increment when a new widget is created
	var _globalWidgetUid = 800;

	// Initialize a list of widgets
	var widgets = [
		{"_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
		{"_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
		{
			"_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
			"url": "http://lorempixel.com/400/200/"
		},
		{
			"_id": "456",
			"widgetType": "HTML",
			"pageId": "321",
			"text": '<p class="first-text">Investing in undersea internet cables has been a <a href="http://gizmodo.com/why-more-technology-giants-are-paying-to-lay-their-own-1703904291">big part of data strategy </a>plans for tech giants in recent years. Now Microsoft and Facebook are teaming up for the mother of all cables: A 4,100-mile monster that can move 160 Tbps, which will make it the highest-capacity cable on Earth. The cable even has a name, MAREA, and it will break ground (break waves?) later this year. Hopefully it can handle all your selfies.</p>'
		},
		{"_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
		{
			"_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
			"url": "https://youtu.be/AM2Ivdi9c4E"
		},
		{"_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
	];

	// Definition of WidgetService with its API
	function WidgetService() {
		// Make the API available to the outside world
		return {
			createWidget: createWidget,
			findWidgetsByPageId: findWidgetsByPageId,
			findWidgetById: findWidgetById,
			updateWidget: updateWidget,
			deleteWidget: deleteWidget
		};

		function createWidget(pageId, widget) {
			console.log("createWidget for page ID - ", pageId);
			_globalWidgetUid += 1;
			widget._id = _globalWidgetUid.toString();
			widget.pageId = pageId;
			widgets.push(widget);
			return true;
		}

		function findWidgetsByPageId(pageId) {
			console.log("findWidgetsByPageId - " + pageId);
			var results = [];
			for (var i in widgets) {
				if (widgets[i].pageId === pageId) {
					results.push(widgets[i]);
				}
			}
			console.log("Found " + results.length + " widgets for page ID " + pageId);
			return results;
		}

		function findWidgetById(widgetId) {
			console.log("findWidgetById - " + widgetId);
			for (var i in widgets) {
				if (widgets[i]._id === widgetId) {
					console.log("Found widget -" + widgets[i]);
					return widgets[i];
				}
			}
			console.log("Widget not found");
			return false;
		}

		function updateWidget(widgetId, widget) {
			console.log("updateWidget - ", widgetId);
			for (var i in widgets) {
				if (widgets[i]._id === widgetId) {
					widgets[i] = widget;
					console.log("Widget updated -" + widgets[i]);
					return true;
				}
			}
			console.log("Widget not found");
			return false;
		}

		function deleteWidget(widgetId) {
			console.log("deleteWebsite - " + widgetId);
			for (var i in widgets) {
				if (widgets[i]._id === widgetId.toString()) {
					console.log("Deleted widget with ID " + widgetId);
					widgets.splice(i, 1);
					return true;
				}
			}
			console.log("Widget not found");
			return false;
		}
	}
})();
