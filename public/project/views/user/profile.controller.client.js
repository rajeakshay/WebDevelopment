(function(){
	angular
		.module("iTube")
		.controller("ProfileController", ProfileController);

	function ProfileController($location, $rootScope, ProjectUserService){
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
