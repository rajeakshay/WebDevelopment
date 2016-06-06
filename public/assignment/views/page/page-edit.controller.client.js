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
			PageService
				.findPageById(vm.pageId)
				.then(function(response){
					vm.page = angular.copy(response.data);
				});
		}
		init();

		vm.updatePage = function updatePage(){
			if (!vm.page || !vm.page.name || !vm.page.title) {
				vm.error = "Check the page name and title.";
			}
			else {
				PageService
					.updatePage(vm.pageId, vm.page)
					.then(
						function(response){
							$location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
						},
						function(error){
							vm.error = "Failed to update page.";
						}
					);
			}
		};

		vm.deletePage = function deletePage() {
			PageService
				.deletePage(vm.pageId)
				.then(
					function(response){
						$location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
					},
					function(error){
						vm.error = "Failed to delete page.";
					}
				);
		}
	}
})();
