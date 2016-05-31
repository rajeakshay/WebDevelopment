(function () {
	angular
		.module("WebAppMaker")
		.controller("ProfileController", ProfileController);

	function ProfileController($routeParams, UserService) {
		var vm = this;
		vm.updateUser = updateUser;
		vm.userId = $routeParams.uid;

		function init(){
			vm.user = angular.copy(UserService.findUserById(vm.userId));
		}
		init();

		// Facilitate updating user details
		function updateUser(newUser) {
			var flag = UserService.updateUser(vm.userId, newUser);
			if(flag){
				vm.updateSuccess = "Success! ";
			}
			else{
				vm.updateError = "Error! ";
			}
		}
	}
})();
