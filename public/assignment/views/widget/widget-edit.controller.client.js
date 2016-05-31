(function () {
	angular
		.module("WebAppMaker")
		.controller("EditWidgetController", EditWidgetController);

	function EditWidgetController($location, $routeParams, WidgetService){
		var vm = this;
		vm.userId = $routeParams.uid;
		vm.pageId = $routeParams.pid;
		vm.websiteId = $routeParams.wid;
		vm.widgetId = $routeParams.wgid;

		function init(){
			vm.widget = angular.copy(WidgetService.findWidgetById(vm.widgetId));
		}
		init();

		vm.updateWidget = function updateWidget(){
			var result = WidgetService.updateWidget(vm.widgetId, vm.widget);
			if(!result){
				vm.error = "Widget could not be updated.";
			}
			else{
				$location.url("/user/" + vm.userId +
					"/website/" + vm.websiteId +
					"/page/" + vm.pageId +
					"/widget");
			}
		};

		vm.deleteWidget = function deleteWidget(){
			var flag = WidgetService.deleteWidget(vm.widgetId);
			if(!flag){
				vm.error = "Widget could not be deleted.";
			}
			else{
				$location.url("/user/" + vm.userId +
					"/website/" + vm.websiteId +
					"/page/" + vm.pageId +
					"/widget");
			}
		}
	}
})();

