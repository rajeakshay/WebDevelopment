(function(){
	angular
		.module("WebAppMaker")
		.controller("WebsiteListController", WebsiteListController);

	function WebsiteListController($location, $routeParams, WebsiteService){
		var vm = this;
		vm.userId = $routeParams.uid;

		function init() {
			WebsiteService
				.findWebsitesByUser(vm.userId)
				.then(function(response){
					vm.websites = response.data;
				});
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
