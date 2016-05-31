(function () {
	angular
		.module("WebAppMaker")
		.controller("ChooseWidgetController", ChooseWidgetController);

	function ChooseWidgetController($routeParams){
		var vm = this;
		vm.userId = $routeParams.uid;
		vm.pageId = $routeParams.pid;
		vm.websiteId = $routeParams.wid;

		function init(){
			// Nothing to do here
		}
		init();
	}
})();

