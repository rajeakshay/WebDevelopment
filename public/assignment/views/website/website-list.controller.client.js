(function(){
	angular
		.module("WebAppMaker")
		.controller("WebsiteListController", WebsiteListController);

	function WebsiteListController($location, $routeParams, WebsiteService){
		var vm = this;
		vm.userId = $routeParams.uid;

		function init() {
			vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
		}
		init();

		vm.editWebsite = function editWebsite(wid) {
			vm.websiteId = wid;
			$location.url("/user/" + vm.userId + "/website/" + wid);
		};

		vm.openPages = function openPages(wid){
			$location.url("/user/" + vm.userId + "/website/" + wid + "/page");
		}
	}
})();
