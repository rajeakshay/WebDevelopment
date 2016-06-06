(function () {
	angular
		.module("WebAppMaker")
		.controller("NewWidgetController", NewWidgetController);

	function NewWidgetController($location, $routeParams, WidgetService){
		var vm = this;
		vm.userId = $routeParams.uid;
		vm.pageId = $routeParams.pid;
		vm.websiteId = $routeParams.wid;
		vm.widgetType = $routeParams.wtype;

		function init(){
			// Nothing to do here
		}
		init();

		vm.createWidget = function createWidget(){
			var flag = true;
			vm.myerror = "";

			// Widget name and text are mandatory
			if(!vm.widget || !vm.widget.text || !vm.widget.text.trim()
				|| !vm.widget.name || !vm.widget.name.trim()){
				flag = false;
			}
			else {
				// Handle a heading widget
				if (vm.widgetType == "myheader") {
					if (!vm.widget || !vm.widget.size) {
						flag = false;
						vm.myerror = "Size or Text";
					} else {
						vm.widget.widgetType = "HEADER";
					}
				}
				// Handle an image widget
				else if (vm.widgetType == "myimage") {
					if (!vm.widget || !vm.widget.width) {
						vm.widget.width = "100%";
						vm.widget.widgetType = "IMAGE";
					} else if (!vm.widget || !vm.widget.url) {
						vm.myerror = "URL";
						flag = false;
					} else {
						vm.widget.widgetType = "IMAGE";
					}
				}
				// Handle a YouTube Video widget
				else if (vm.widgetType == "myyoutube") {
					if (!vm.widget || !vm.widget.width) {
						vm.widget.width = "100%";
						vm.widget.widgetType = "YOUTUBE";
					} else if (!vm.widget || !vm.widget.url) {
						vm.myerror = "URL";
						flag = false;
					} else {
						vm.widget.widgetType = "YOUTUBE";
					}
				}
			}

			if(!flag){
				vm.error = "Some fields are required. Check " + vm.myerror;
			}
			else{
				WidgetService
					.createWidget(vm.pageId, vm.widget)
					.then(
						function(response){
							$location.url("/user/" + vm.userId +
								"/website/" + vm.websiteId +
								"/page/" + vm.pageId +
								"/widget");
						},
						function(error){
							vm.error = "Widget could not be created.";
						}
					);
			}
		};

		vm.deleteWidget = function deleteWidget(){
			// Nothing to do here
		}
	}
})();

