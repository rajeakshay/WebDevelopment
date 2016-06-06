(function () {
	angular
		.module("WebAppMaker")
		.controller("ChooseWidgetController", ChooseWidgetController);

	function ChooseWidgetController($routeParams, $location, WidgetService){
		var vm = this;
		vm.userId = $routeParams.uid;
		vm.pageId = $routeParams.pid;
		vm.websiteId = $routeParams.wid;

		vm.addWidget = function addWidget(widgetType){
			var widget = {
				widgetType: widgetType
			};

			WidgetService
				.createWidget(vm.pageId, widget)
				.then(function (response) {
					var widgetId = response.data._id;
					$location.url("/user/" + vm.userId +
						"/website/" + vm.websiteId +
						"/page/" + vm.pageId +
						"/widget/" + widgetId);
				}, function (error) {
					vm.error = "Could not create a widget.";
				});
		};
	}
})();

