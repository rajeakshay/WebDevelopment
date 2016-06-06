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
			WidgetService
				.findWidgetById(vm.widgetId)
				.then(function(response){
					vm.widget = angular.copy(response.data);
				});
		}
		init();

		vm.updateWidget = function updateWidget(){
			WidgetService
				.updateWidget(vm.widgetId, vm.widget)
				.then(
					function(response){
						$location.url("/user/" + vm.userId +
							"/website/" + vm.websiteId +
							"/page/" + vm.pageId +
							"/widget");
					},
					function(error){
						vm.error = "Widget could not be updated.";
					}
				);
		};

		vm.deleteWidget = function deleteWidget(){
			WidgetService
				.deleteWidget(vm.widgetId)
				.then(
					function(response){
						$location.url("/user/" + vm.userId +
							"/website/" + vm.websiteId +
							"/page/" + vm.pageId +
							"/widget");
					},
					function(error){
						vm.error = "Widget could not be deleted.";
					});
		}
	}
})();

