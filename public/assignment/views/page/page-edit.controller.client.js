(function(){
	angular
		.module("WebAppMaker")
		.controller("EditPageController", EditPageController);

	function EditPageController($routeParams, $location, PageService){
		var vm = this;
		vm.userId = $routeParams.uid;
		vm.websiteId = $routeParams.wid;
		vm.pageId = $routeParams.pid;

		function init() {
			vm.page = angular.copy(PageService.findPageById(vm.pageId));
		}
		init();

		vm.updatePage = function updatePage(){
			if (!vm.page || !vm.page.name || !vm.page.title) {
				vm.error = "Check the page name and title.";
			}
			else {
				var flag = PageService.updatePage(vm.pageId, vm.page);
				if (flag) {
					$location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
				} else {
					vm.error = "Failed to update page.";
				}
			}
		};

		vm.deletePage = function deletePage() {
			var flag = PageService.deletePage(vm.pageId);
			if(flag) {
				$location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
			} else {
				vm.error = "Failed to delete page.";
			}
		}
	}
})();
