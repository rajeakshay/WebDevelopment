(function(){
	angular
		.module("iTube")
		.controller("NetworkController", NetworkController);

	function NetworkController($location, $rootScope, ProjectUserService){
		var vm = this;
		//TODO
		function init(){

		}
		init();

		vm.logout = function(){
			ProjectUserService
				.signout()
				.then(
					function(response){
						$rootScope.currentUser = null;
						$location.url("/");
					}
				);
		}
	}
})();