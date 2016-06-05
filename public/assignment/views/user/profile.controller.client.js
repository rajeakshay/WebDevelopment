(function () {
	angular
		.module("WebAppMaker")
		.controller("ProfileController", ProfileController);

	function ProfileController($routeParams, $location,  UserService) {
		var vm = this;
		vm.updateUser = updateUser;
		vm.unregister = unregister;

		vm.userId = $routeParams.uid;

		function init(){
			UserService
				.findUserById(vm.userId)
				.then(function(response){
					vm.user = angular.copy(response.data);
				});
		}
		init();

		// Facilitate updating user details
		function updateUser(newUser) {
			UserService
				.updateUser(vm.userId, newUser)
				.then(
					function(){
						vm.updateSuccess = "Success! ";
					},
					function(){
						vm.updateError = "Error! ";
					}
				);
		}

		// Facilitate removing the user account
		function unregister() {
			UserService
				.deleteUser(vm.userId)
				.then(
					function(){
						// Take the user to login page on successful deletion
						$location.url("/login");
					},
					function(){
						// Display failure message
						vm.deleteError = "Error! ";
					}
				);
		}
	}
})();
