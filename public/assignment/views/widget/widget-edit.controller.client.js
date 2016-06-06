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

		vm.deleteWidget = deleteWidget;
		vm.updateWidget = updateWidget;

		function init(){
			WidgetService
				.findWidgetById(vm.widgetId)
				.then(function(response){
					vm.widget = angular.copy(response.data);
				});
		}
		init();

		function updateWidget(widget){
			if(widget.widgetType === "HEADER"){
				updateHeading(widget);
			}
			else if(widget.widgetType === "IMAGE"){
				updateImage(widget);
			}
			else{
				updateYoutube(widget);
			}
		}

		function updateHeading(widget) {
			if (!widget.text){
				vm.error = "Text field left blank.";
			}
			else{
				if(!widget.size){
					widget.size = 1;
				}
				WidgetService
					.updateWidget(vm.widgetId, widget)
					.then(function (response) {
						$location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
					}, function (err) {
						vm.error = "Widget could not be updated.";
					});
			}
		}

		function updateYoutube(widget){
			if(!widget.url){
				vm.error = "URL field left blank.";
			}
			else{
				if(!widget.width){
					widget.width = "100%";
				}
				WidgetService
					.updateWidget(vm.widgetId, widget)
					.then(function (response) {
						$location.url("/user/"+ vm.userId +"/website/"+ vm.websiteId +"/page/"+ vm.pageId +"/widget");
					}, function (err) {
						vm.error = "Widget could not be updated.";
					});
			}
		}

		function updateImage(widget){
			if(!widget.url){
				vm.error = "URL field left blank.";
			}
			else{
				if(!widget.width){
					widget.width = "100%";
				}
				WidgetService
					.updateWidget(vm.widgetId, widget)
					.then(function (response) {
						$location.url("/user/"+ vm.userId +"/website/"+ vm.websiteId +"/page/"+ vm.pageId +"/widget");
					}, function (err) {
						vm.error = "Widget could not be updated.";
					});
			}
		}

		function deleteWidget(){
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

