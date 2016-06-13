(function () {
	angular
		.module("WebAppMaker")
		.factory("WidgetService", WidgetService);

	// Definition of WidgetService with its API
	function WidgetService($http) {
		// Make the API available to the outside world
		return {
			createWidget: createWidget,
			findWidgetsByPageId: findWidgetsByPageId,
			findWidgetById: findWidgetById,
			updateWidget: updateWidget,
			deleteWidget: deleteWidget,
			reorderWidget: reorderWidget
		};

		function createWidget(pageId, widget) {
			console.log("createWidget for page ID - ", pageId);
			widget['pageId'] = pageId;
			return $http.post("/api/page/" + pageId + "/widget", widget);
		}

		function findWidgetsByPageId(pageId) {
			console.log("findWidgetsByPageId - " + pageId);
			return $http.get("/api/page/" + pageId + "/widget");
		}

		function findWidgetById(widgetId) {
			console.log("findWidgetById - " + widgetId);
			return $http.get("/api/widget/" + widgetId);
		}

		function updateWidget(widgetId, widget) {
			console.log("updateWidget - ", widgetId);
			return $http.put("/api/widget/" + widgetId, widget);
		}

		function deleteWidget(widgetId) {
			console.log("deleteWebsite - " + widgetId);
			return $http.delete("/api/widget/" + widgetId);
		}

		function reorderWidget(pageId, start, end){
			console.log("reorderWidget - " + pageId + " ," + start + " ," + end);
			return $http.put("/api/page/" + pageId + "/widget?start=" + start + "&end=" + end);
		}
	}
})();
