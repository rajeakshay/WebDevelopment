(function(){
	angular
		.module("WebAppMaker")
		.controller("NewPageController", NewPageController);

	function NewPageController($routeParams, $location, PageService){
		var vm = this;
		vm.userId = $routeParams.uid;
		vm.websiteId = $routeParams.wid;
		vm.createPage = createPage;

		function createPage() {
			if (!vm.page || !vm.page.name || !vm.page.title) {
				vm.error = "Page name and title are required.";
			}else{
				PageService
					.createPage(vm.websiteId, vm.page)
					.then(
						function(response){
							$location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
						},
						function(error){
							vm.error = "Failed to create page.";
						}
					);
			}
		}
	}
})();