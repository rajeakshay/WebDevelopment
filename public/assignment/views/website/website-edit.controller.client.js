(function(){
	angular
		.module("WebAppMaker")
		.controller("EditWebsiteController", EditWebsiteController);

	function EditWebsiteController($location, $routeParams, WebsiteService){
		var vm = this;
		vm.userId = $routeParams.uid;
		vm.websiteId = $routeParams.wid;

		function init() {
			WebsiteService
				.findWebsiteById(vm.websiteId)
				.then(function(response){
					vm.website = angular.copy(response.data);
				});
		}
		init();

		vm.updateWebsite = function updateWebsite(updatedWebsite){
			if(!updatedWebsite || !updatedWebsite.name){
				vm.error = "Website name is required!";
			}
			else{
				WebsiteService
					.updateWebsite(updatedWebsite._id, updatedWebsite)
					.then(
						function(response){
							$location.url("/user/"+vm.userId+"/website");
						},
						function(error){
							vm.error = "Cannot update Website!";
						}
					);
			}
		};

		vm.deleteWebsite = function deleteWebsite(websiteId){
			WebsiteService
				.deleteWebsite(websiteId)
				.then(
					function(response){
						$location.url("/user/"+vm.userId+"/website");
					},
					function(error){
						vm.error = "Unable to delete!";
					}
				);
		};
	}
})();
