(function () {
	angular
		.module("WebAppMaker")
		.controller("ProfileController", ProfileController);

	function ProfileController($routeParams, $location, $rootScope, UserService) {
		var vm = this;
		vm.updateUser = updateUser;
		vm.unregister = unregister;
		vm.logout = logout;
		vm.userId = $rootScope.currentUser._id;

		function init(){
			UserService
				.findUserById(vm.userId)
				.then(function(response){
					var currentUser = response.data;
					if(currentUser && currentUser._id){
						vm.user = angular.copy(response.data);
					}
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
						$rootScope.currentUser = null;
					},
					function(){
						// Display failure message
						vm.deleteError = "Error! ";
					}
				);
		}

		// Facilitate user logout
		function logout(){
			UserService
				.logout()
				.then(
					function (response){
						$rootScope.currentUser = null;
						$location.url("/");
					});
		}
	}
})();
