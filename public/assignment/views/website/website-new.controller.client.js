(function() {
	angular
		.module("WebAppMaker")
		.controller("NewWebsiteController", NewWebsiteController);

	function NewWebsiteController($location, $routeParams, WebsiteService) {
		var vm = this;
		vm.userId = $routeParams.uid;
		vm.createWebsite = function createWebsite(name, description) {
			if (!(name)) {
				vm.error = "Website name cannot be blank!"
			} else {
				var newSite = {
					name: name,
					description: description
				};
				WebsiteService
					.createWebsite(vm.userId, newSite)
					.then(
						function(response){
							$location.url("/user/" + vm.userId + "/website");
						},
						function(error){
							vm.error = "Unable to create website";
						}
					);
			}
		}
	}
})();

