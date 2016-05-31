(function(){
	angular
		.module("WebAppMaker")
		.controller("EditWebsiteController", EditWebsiteController);

	function EditWebsiteController($location, $routeParams, WebsiteService){
		var vm = this;
		vm.userId = $routeParams.uid;
		vm.websiteId = $routeParams.wid;

		function init() {
			vm.website = angular.copy(WebsiteService.findWebsiteById(vm.websiteId));
		}
		init();

		vm.updateWebsite = function updateWebsite(updatedWebsite){
			if(!updatedWebsite || !updatedWebsite.name){
				vm.error = "Cannot update website!";
			}
			else{
				var flag = WebsiteService.updateWebsite(updatedWebsite._id, updatedWebsite);
				if(flag){
					$location.url("/user/"+vm.userId+"/website");
				}else{
					vm.error = "Cannot update Website!";
				}
			}
		};

		vm.deleteWebsite = function deleteWebsite(websiteId){
			var flag = WebsiteService.deleteWebsite(websiteId);
			if(flag){
				$location.url("/user/"+vm.userId+"/website");
			}else{
				vm.error = "Unable to delete!";
			}
		};
	}
})();
