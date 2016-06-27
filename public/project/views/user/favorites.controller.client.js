(function(){
	angular
		.module("iTube")
		.controller("FavoritesController", FavoritesController);

	function FavoritesController($location, $rootScope, ProjectUserService){
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